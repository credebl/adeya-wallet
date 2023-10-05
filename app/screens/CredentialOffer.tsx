import { useCredentialById, AnonCredsCredentialOffer, AnonCredsCredentialMetadataKey, useAdeyaAgent } from '@adeya/ssi'
import { CredentialPreviewAttribute, JsonLdFormatDataCredentialDetail } from '@aries-framework/core'
import { StackScreenProps } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DeviceEventEmitter, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import Button, { ButtonType } from '../components/buttons/Button'
import ConnectionImage from '../components/misc/ConnectionImage'
import CredentialCard from '../components/misc/CredentialCard'
import CommonRemoveModal from '../components/modals/CommonRemoveModal'
import Record from '../components/record/Record'
import W3CCredentialRecord from '../components/record/W3CCredentialRecord'
import { EventTypes } from '../constants'
import { useAnimatedComponents } from '../contexts/animated-components'
import { useConfiguration } from '../contexts/configuration'
import { useNetwork } from '../contexts/network'
import { useTheme } from '../contexts/theme'
import { BifoldError } from '../types/error'
import { TabStacks, NotificationStackParams, Screens } from '../types/navigators'
import { CardLayoutOverlay11, CredentialOverlay } from '../types/oca'
import { W3CCredentialAttributeField } from '../types/record'
import { ModalUsage } from '../types/remove'
import {
  buildFieldsFromJSONLDCredential,
  formatCredentialSubject,
  getCredentialIdentifiers,
  isValidAnonCredsCredential,
} from '../utils/credential'
import { getCredentialConnectionLabel } from '../utils/helpers'
import { buildFieldsFromAnonCredsCredential } from '../utils/oca'
import { testIdWithKey } from '../utils/testable'

import CredentialOfferAccept from './CredentialOfferAccept'

type CredentialOfferProps = StackScreenProps<NotificationStackParams, Screens.CredentialOffer>

const CredentialOffer: React.FC<CredentialOfferProps> = ({ navigation, route }) => {
  if (!route?.params) {
    throw new Error('CredentialOffer route prams were not set properly')
  }

  const { credentialId } = route.params

  const { agent } = useAdeyaAgent()
  const { t, i18n } = useTranslation()
  const { ListItems, ColorPallet } = useTheme()
  const { RecordLoading } = useAnimatedComponents()
  const { assertConnectedNetwork } = useNetwork()
  const { OCABundleResolver } = useConfiguration()
  const [loading, setLoading] = useState<boolean>(true)
  const [buttonsVisible, setButtonsVisible] = useState(true)
  const [acceptModalVisible, setAcceptModalVisible] = useState(false)
  const [declineModalVisible, setDeclineModalVisible] = useState(false)
  const [overlay, setOverlay] = useState<CredentialOverlay<CardLayoutOverlay11>>({ presentationFields: [] })
  const credential = useCredentialById(credentialId)
  const [jsonLdOffer, setJsonLdOffer] = useState<JsonLdFormatDataCredentialDetail>()
  const [tables, setTables] = useState<W3CCredentialAttributeField[]>([])
  const credentialConnectionLabel = getCredentialConnectionLabel(credential)

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
    if (!agent) {
      DeviceEventEmitter.emit(
        EventTypes.ERROR_ADDED,
        new BifoldError(t('Error.Title1035'), t('Error.Message1035'), t('CredentialOffer.CredentialNotFound'), 1035),
      )
    }
  }, [])

  useEffect(() => {
    if (!credential) {
      DeviceEventEmitter.emit(
        EventTypes.ERROR_ADDED,
        new BifoldError(t('Error.Title1035'), t('Error.Message1035'), t('CredentialOffer.CredentialNotFound'), 1035),
      )
    }
  }, [])

  useEffect(() => {
    if (!(credential && isValidAnonCredsCredential(credential))) {
      return
    }

    const updateCredentialPreview = async () => {
      const { ...formatData } = await agent?.credentials.getFormatData(credential.id)
      const { offer, offerAttributes } = formatData
      let offerData

      if (offer?.anoncreds || offer?.indy) {
        offerData = (offer?.anoncreds || offer?.indy) as AnonCredsCredentialOffer
        credential.metadata.add(AnonCredsCredentialMetadataKey, {
          schemaId: offerData.schema_id,
          credentialDefinitionId: offerData.cred_def_id,
        })
      }

      if (offer?.jsonld) {
        setJsonLdOffer(offer?.jsonld)
        const jsonLdValues = formatCredentialSubject(offer?.jsonld.credential.credentialSubject)
        setTables(jsonLdValues)
      }

      if (offerAttributes) {
        credential.credentialAttributes = [...offerAttributes.map(item => new CredentialPreviewAttribute(item))]
      }
    }

    const resolvePresentationFields = async () => {
      const identifiers = getCredentialIdentifiers(credential)
      const attributes = jsonLdOffer
        ? buildFieldsFromJSONLDCredential(jsonLdOffer.credential.credentialSubject)
        : buildFieldsFromAnonCredsCredential(credential)
      const fields = await OCABundleResolver.presentationFields({ identifiers, attributes, language: i18n.language })
      return { fields }
    }

    /**
     * FIXME: Formatted data needs to be added to the record in AFJ extensions
     * For now the order here matters. The credential preview must be updated to
     * add attributes (since these are not available in the offer).
     * Once the credential is updated the presentation fields can be correctly resolved
     */
    setLoading(true)
    updateCredentialPreview()
      .then(() => resolvePresentationFields())
      .then(({ fields }) => {
        setOverlay({ ...overlay, presentationFields: fields })
        setLoading(false)
      })
  }, [credential])

  const toggleDeclineModalVisible = () => setDeclineModalVisible(!declineModalVisible)

  const handleAcceptTouched = async () => {
    try {
      if (!(agent && credential && assertConnectedNetwork())) {
        return
      }
      setAcceptModalVisible(true)
      await agent.credentials.acceptOffer({ credentialRecordId: credential.id })
    } catch (err: unknown) {
      setButtonsVisible(true)
      const error = new BifoldError(t('Error.Title1024'), t('Error.Message1024'), (err as Error).message, 1024)
      DeviceEventEmitter.emit(EventTypes.ERROR_ADDED, error)
    }
  }

  const handleDeclineTouched = async () => {
    try {
      if (agent && credential) {
        await agent.credentials.declineOffer(credential.id)
        await agent.credentials.sendProblemReport({
          credentialRecordId: credential.id,
          description: t('CredentialOffer.Declined'),
        })
      }

      toggleDeclineModalVisible()
      navigation.getParent()?.navigate(TabStacks.HomeStack, { screen: Screens.Home })
    } catch (err: unknown) {
      const error = new BifoldError(t('Error.Title1025'), t('Error.Message1025'), (err as Error).message, 1025)

      DeviceEventEmitter.emit(EventTypes.ERROR_ADDED, error)
    }
  }

  const header = () => {
    return (
      <>
        <ConnectionImage connectionId={credential?.connectionId} />
        <View style={styles.headerTextContainer}>
          <Text style={[styles.headerText]} testID={testIdWithKey('HeaderText')}>
            <Text style={styles.connectionLabel}>{credentialConnectionLabel || t('ContactDetails.AContact')}</Text>{' '}
            {t('CredentialOffer.IsOfferingYouACredential')}
          </Text>
        </View>
        {!loading && credential && (
          <View style={{ marginHorizontal: 15, marginBottom: 16 }}>
            <CredentialCard credential={credential} />
          </View>
        )}
      </>
    )
  }

  const jsonLdHeader = () => {
    return (
      <>
        <ConnectionImage connectionId={credential?.connectionId} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText} testID={testIdWithKey('HeaderText')}>
            <Text>{credentialConnectionLabel || t('ContactDetails.AContact')}</Text>{' '}
            {t('CredentialOffer.IsOfferingYouACredential')}
          </Text>
        </View>
        {!loading && credential && (
          <View style={{ marginHorizontal: 15, marginBottom: 16 }}>
            <CredentialCard
              credential={credential}
              connectionLabel={credentialConnectionLabel}
              schemaId={jsonLdOffer?.credential.type[1]}
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
      {jsonLdOffer ? (
        <W3CCredentialRecord
          tables={tables}
          fields={overlay.presentationFields || []}
          hideFieldValues={false}
          header={jsonLdHeader}
          footer={footer}
        />
      ) : (
        <Record fields={overlay.presentationFields || []} header={header} footer={footer} />
      )}
      <CredentialOfferAccept visible={acceptModalVisible} credentialId={credentialId} />
      <CommonRemoveModal
        usage={ModalUsage.CredentialOfferDecline}
        visible={declineModalVisible}
        onSubmit={handleDeclineTouched}
        onCancel={toggleDeclineModalVisible}
      />
    </SafeAreaView>
  )
}

export default CredentialOffer
