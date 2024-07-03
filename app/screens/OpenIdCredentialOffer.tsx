import { W3cCredentialRecord, JsonTransformer, ClaimFormat } from '@adeya/ssi'
// eslint-disable-next-line import/no-extraneous-dependencies
import { SdJwtVcRecord } from '@credo-ts/core'
import { BrandingOverlay } from '@hyperledger/aries-oca'
import { CredentialOverlay } from '@hyperledger/aries-oca/build/legacy'
import { StackScreenProps } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, DeviceEventEmitter, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import RecordLoading from '../components/animated/RecordLoading'
import Button, { ButtonType } from '../components/buttons/Button'
import OpenIdCredentialCard from '../components/misc/OpenIdCredentialCard'
import CommonRemoveModal from '../components/modals/CommonRemoveModal'
import W3CCredentialRecord from '../components/record/W3CCredentialRecord'
import { EventTypes } from '../constants'
import { useNetwork } from '../contexts/network'
import { useTheme } from '../contexts/theme'
import { BifoldError } from '../types/error'
import { TabStacks, NotificationStackParams, Screens } from '../types/navigators'
import { W3CCredentialAttributeField } from '../types/record'
import { ModalUsage } from '../types/remove'
import { useAppAgent } from '../utils/agent'
import { buildFieldsFromJSONLDCredential, formatCredentialSubject } from '../utils/credential'
import {
  W3cCredentialJson,
  getOpenId4VcCredentialMetadata,
  getW3cCredentialDisplay,
  getW3cIssuerDisplay,
  receiveCredentialFromOpenId4VciOffer,
  storeCredential,
} from '../utils/helpers'
import { testIdWithKey } from '../utils/testable'

type OpenIdCredentialOfferProps = StackScreenProps<NotificationStackParams, Screens.OpenIdCredentialOffer>

type Query = { uri?: string; data?: string }

const OpenIdCredentialOffer: React.FC<OpenIdCredentialOfferProps> = ({ navigation, route }) => {
  if (!route?.params) {
    throw new Error('OpenIdCredentialOffer route params were not set properly')
  }

  const { agent } = useAppAgent()
  const { t } = useTranslation()
  const { ListItems, ColorPallet } = useTheme()
  const { assertConnectedNetwork } = useNetwork()
  const [loading, setLoading] = useState<boolean>(true)
  const [buttonsVisible, setButtonsVisible] = useState(true)
  const [declineModalVisible, setDeclineModalVisible] = useState(false)
  const [overlay, setOverlay] = useState<CredentialOverlay<BrandingOverlay>>({ presentationFields: [] })
  const [tables, setTables] = useState<W3CCredentialAttributeField[]>([])

  const [credentialRecord, setCredentialRecord] = useState<W3cCredentialRecord | SdJwtVcRecord>()

  const styles = StyleSheet.create({
    headerTextContainer: {
      paddingHorizontal: 25,
      paddingVertical: 16,
    },
    headerText: {
      ...ListItems.recordAttributeLabel,
      flexShrink: 1,
    },
    footerButton: {
      paddingTop: 10,
    },
    connectionLabel: {
      fontWeight: 'bold',
    },
  })

  useEffect(() => {
    const requestCredential = async (params: Query) => {
      try {
        setLoading(true)
        const credentialRecord = await receiveCredentialFromOpenId4VciOffer({
          agent,
          data: params.data,
          uri: params.uri,
        })

        setCredentialRecord(credentialRecord)
      } catch (e: unknown) {
        agent.config.logger.error(`Couldn't receive credential from OpenID4VCI offer`, {
          error: e,
        })
      } finally {
        setLoading(false)
      }
    }
    void requestCredential(route.params)
  }, [route.params, agent])

  useEffect(() => {
    if (!credentialRecord) {
      return
    }

    const updateCredentialPreview = () => {
      credentialRecord
      const jsonLdValues = formatCredentialSubject(
        (credentialRecord as W3cCredentialRecord).credential.credentialSubject,
      )
      const fields = buildFieldsFromJSONLDCredential(
        (credentialRecord as W3cCredentialRecord).credential.credentialSubject,
      )

      setOverlay({ presentationFields: fields })

      setTables(jsonLdValues)
    }

    updateCredentialPreview()
  }, [credentialRecord])

  const toggleDeclineModalVisible = () => setDeclineModalVisible(!declineModalVisible)

  const handleAcceptTouched = async () => {
    try {
      if (!(agent && credentialRecord && assertConnectedNetwork())) {
        return
      }
      await storeCredential(agent, credentialRecord)
      navigation.getParent()?.navigate(TabStacks.HomeStack, { screen: Screens.Home })
    } catch (err: unknown) {
      setButtonsVisible(true)
      const error = new BifoldError(t('Error.Title1024'), t('Error.Message1024'), (err as Error).message, 1024)
      DeviceEventEmitter.emit(EventTypes.ERROR_ADDED, error)
    }
  }

  const handleDeclineTouched = async () => {
    try {
      toggleDeclineModalVisible()
      navigation.getParent()?.navigate(TabStacks.HomeStack, { screen: Screens.Home })
    } catch (err: unknown) {
      const error = new BifoldError(t('Error.Title1025'), t('Error.Message1025'), (err as Error).message, 1025)

      DeviceEventEmitter.emit(EventTypes.ERROR_ADDED, error)
    }
  }

  const header = () => {
    const credential = JsonTransformer.toJSON(
      (credentialRecord as W3cCredentialRecord).credential.claimFormat === ClaimFormat.JwtVc
        ? credentialRecord.credential.credential
        : credentialRecord.credential,
    ) as W3cCredentialJson

    const openId4VcMetadata = getOpenId4VcCredentialMetadata(credentialRecord as W3cCredentialRecord)

    const issuerDisplay = getW3cIssuerDisplay(credential, openId4VcMetadata)
    const credentialDisplay = getW3cCredentialDisplay(credential, openId4VcMetadata)

    return (
      <>
        <View style={styles.headerTextContainer}>
          <Text style={[styles.headerText]} testID={testIdWithKey('HeaderText')}>
            <Text style={styles.connectionLabel}>{issuerDisplay.name || t('ContactDetails.AContact')}</Text>{' '}
            {t('CredentialOffer.IsOfferingYouACredential')}
          </Text>
        </View>
        {!loading && credentialRecord && (
          <View style={{ marginHorizontal: 15, marginBottom: 16 }}>
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
    return (
      <View
        style={{
          paddingHorizontal: 25,
          paddingVertical: 16,
          paddingBottom: 26,
          backgroundColor: ColorPallet.brand.secondaryBackground,
        }}>
        {loading ? <RecordLoading /> : null}
        <View style={styles.footerButton}>
          <Button
            title={t('Global.Accept')}
            accessibilityLabel={t('Global.Accept')}
            testID={testIdWithKey('AcceptCredentialOffer')}
            buttonType={ButtonType.Primary}
            onPress={handleAcceptTouched}
            disabled={!buttonsVisible}
          />
        </View>
        <View style={styles.footerButton}>
          <Button
            title={t('Global.Decline')}
            accessibilityLabel={t('Global.Decline')}
            testID={testIdWithKey('DeclineCredentialOffer')}
            buttonType={ButtonType.Secondary}
            onPress={toggleDeclineModalVisible}
            disabled={!buttonsVisible}
          />
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flexGrow: 1 }} edges={['bottom', 'left', 'right']}>
      {loading ? <ActivityIndicator size={'large'} /> : null}
      {credentialRecord ? (
        <W3CCredentialRecord
          tables={tables}
          fields={overlay.presentationFields || []}
          hideFieldValues={false}
          header={header}
          footer={footer}
        />
      ) : null}
      <CommonRemoveModal
        usage={ModalUsage.CredentialOfferDecline}
        visible={declineModalVisible}
        onSubmit={handleDeclineTouched}
        onCancel={toggleDeclineModalVisible}
      />
    </SafeAreaView>
  )
}

export default OpenIdCredentialOffer
