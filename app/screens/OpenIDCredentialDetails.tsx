import {
  getCredentialForDisplay,
  getOpenId4VcCredentialMetadata,
  getW3cCredentialDisplay,
  getW3cIssuerDisplay,
  W3cCredentialRecord,
} from '@adeya/ssi'
import { StackScreenProps } from '@react-navigation/stack'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DeviceEventEmitter, FlatList, StyleSheet, Text, View } from 'react-native'
import { Edge, SafeAreaView } from 'react-native-safe-area-context'

import OpenIdCredentialCard from '../components/OpenId/OpenIDCredentialCard'
import { useOpenIDCredentials } from '../components/Provider/OpenIDCredentialRecordProvider'
import Button, { ButtonType } from '../components/buttons/Button'
import CommonRemoveModal from '../components/modals/CommonRemoveModal'
import RecordField from '../components/record/RecordField'
import RecordFooter from '../components/record/RecordFooter'
import RecordHeader from '../components/record/RecordHeader'
import RecordRemove from '../components/record/RecordRemove'
import { EventTypes, OpenIDCredScreenMode } from '../constants'
import { useTheme } from '../contexts/theme'
import { TextTheme } from '../theme'
import { DeliveryStackParams, Screens, TabStacks } from '../types/navigators'
import { ModalUsage } from '../types/remove'
import { useAppAgent } from '../utils/agent'
import { buildFieldsFromOpenIDTemplate } from '../utils/credential'
import { testIdWithKey } from '../utils/testable'

import CredentialOfferAccept from './CredentialOfferAccept'

type OpenIDCredentialDetailsProps = StackScreenProps<DeliveryStackParams, Screens.OpenIDCredentialDetails>

const OpenIDCredentialDetails: React.FC<OpenIDCredentialDetailsProps> = ({ navigation, route }) => {
  // FIXME: change params to accept credential id to avoid 'non-serializable' warnings
  const { credential, screenMode } = route.params
  const credentialDisplay = getCredentialForDisplay(credential)
  const { display, attributes } = credentialDisplay
  const fields = buildFieldsFromOpenIDTemplate(attributes)
  const { t } = useTranslation()
  const { ColorPallet } = useTheme()
  const { agent } = useAppAgent()
  const { storeOpenIdCredential, removeCredential } = useOpenIDCredentials()

  const [isRemoveModalDisplayed, setIsRemoveModalDisplayed] = useState(false)
  const [buttonsVisible, setButtonsVisible] = useState(true)
  const [acceptModalVisible, setAcceptModalVisible] = useState(false)

  const styles = StyleSheet.create({
    headerTextContainer: {
      paddingHorizontal: 25,
      paddingVertical: 16,
    },
    headerText: {
      ...TextTheme.normal,
      flexShrink: 1,
    },
    footerButton: {
      paddingTop: 10,
    },
  })

  const toggleDeclineModalVisible = () => setIsRemoveModalDisplayed(!isRemoveModalDisplayed)

  const handleRemove = async () => {
    try {
      await removeCredential(agent, credential)
      navigation.pop()
    } catch (err) {
      DeviceEventEmitter.emit(EventTypes.ERROR_ADDED, err)
    }
  }
  const handleDeclineTouched = async () => {
    toggleDeclineModalVisible()
    if (screenMode === OpenIDCredScreenMode.offer)
      navigation.getParent()?.navigate(TabStacks.HomeStack, { screen: Screens.Home })
    else handleRemove()
  }

  const handleAcceptTouched = async () => {
    try {
      if (!agent) {
        return
      }
      await storeOpenIdCredential(agent, credential)
      setAcceptModalVisible(true)
    } catch (err: unknown) {
      setButtonsVisible(true)
      DeviceEventEmitter.emit(EventTypes.ERROR_ADDED, err)
    }
  }

  const footerButton = (
    title: string,
    buttonPress: () => void,
    buttonType: ButtonType,
    testID: string,
    accessibilityLabel: string,
  ) => {
    return (
      <View style={styles.footerButton}>
        <Button
          title={title}
          accessibilityLabel={accessibilityLabel}
          testID={testID}
          buttonType={buttonType}
          onPress={buttonPress}
          disabled={!buttonsVisible}
        />
      </View>
    )
  }

  const header = () => {
    const openId4VcMetadata = getOpenId4VcCredentialMetadata(credential as W3cCredentialRecord)
    const issuerDisplay = getW3cIssuerDisplay(credential, openId4VcMetadata)
    const credentialDisplay = getW3cCredentialDisplay(credential, openId4VcMetadata)
    return (
      <>
        {screenMode === OpenIDCredScreenMode.offer && (
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText} testID={testIdWithKey('HeaderText')}>
              <Text>{display.issuer.name || t('ContactDetails.AContact')}</Text>{' '}
              {t('CredentialOffer.IsOfferingYouACredential')}
            </Text>
          </View>
        )}

        {credential && (
          <View style={{ marginHorizontal: 15, marginBottom: 16, marginTop: 10 }}>
            <OpenIdCredentialCard
              issuerName={issuerDisplay.name}
              name={credentialDisplay.name}
              subtitle={credentialDisplay.description}
              bgColor={ColorPallet.brand.primary}
              issuerImage={issuerDisplay.logo}
              backgroundImage={credentialDisplay.backgroundImage}
            />
          </View>
        )}
      </>
    )
  }

  const footer = () => {
    const paddingHorizontal = 24
    const paddingVertical = 16
    const paddingBottom = 26
    return (
      <View style={{ marginBottom: 50 }}>
        {screenMode === OpenIDCredScreenMode.offer ? (
          <View
            style={{
              paddingHorizontal: paddingHorizontal,
              paddingVertical: paddingVertical,
              paddingBottom: paddingBottom,
              backgroundColor: ColorPallet.brand.secondaryBackground,
            }}>
            {footerButton(
              t('Global.Accept'),
              handleAcceptTouched,
              ButtonType.Primary,
              testIdWithKey('AcceptCredentialOffer'),
              t('Global.Accept'),
            )}
            {footerButton(
              t('Global.Decline'),
              toggleDeclineModalVisible,
              ButtonType.Secondary,
              testIdWithKey('DeclineCredentialOffer'),
              t('Global.Decline'),
            )}
          </View>
        ) : (
          <>
            <View
              style={{
                backgroundColor: ColorPallet.brand.secondaryBackground,
                marginTop: paddingVertical,
                paddingHorizontal,
                paddingVertical,
              }}>
              <Text testID={testIdWithKey('IssuerName')}>
                <Text style={[TextTheme.title]}>{t('CredentialDetails.IssuedBy') + ' '}</Text>
                <Text style={[TextTheme.normal]}>{display.issuer.name || t('ContactDetails.AContact')}</Text>
              </Text>
            </View>
            <RecordRemove onRemove={toggleDeclineModalVisible} />
          </>
        )}
      </View>
    )
  }

  const body = () => {
    return (
      <FlatList
        data={fields}
        keyExtractor={({ name }, index) => name || index.toString()}
        renderItem={({ item: attr, index }) => (
          <RecordField
            field={attr}
            hideFieldValue={false}
            shown={true}
            hideBottomBorder={index === fields.length - 1}
          />
        )}
        ListHeaderComponent={<RecordHeader>{header()}</RecordHeader>}
        ListFooterComponent={footer ? <RecordFooter>{footer()}</RecordFooter> : null}
      />
    )
  }

  const screenEdges: Edge[] =
    screenMode === OpenIDCredScreenMode.offer ? ['bottom', 'left', 'right'] : ['left', 'right']

  return (
    <SafeAreaView style={{ flexGrow: 1 }} edges={screenEdges}>
      {body()}
      {screenMode === OpenIDCredScreenMode.offer && (
        <CredentialOfferAccept visible={acceptModalVisible} credentialId={''} confirmationOnly={true} />
      )}
      <CommonRemoveModal
        usage={
          screenMode === OpenIDCredScreenMode.offer ? ModalUsage.CredentialOfferDecline : ModalUsage.CredentialRemove
        }
        visible={isRemoveModalDisplayed}
        onSubmit={handleDeclineTouched}
        onCancel={toggleDeclineModalVisible}
      />
    </SafeAreaView>
  )
}

export default OpenIDCredentialDetails
