import {
  CredentialState,
  ProofState,
  deleteConnectionRecordById,
  deleteOobRecordById,
  useConnectionById,
  useCredentialByState,
  useProofByState,
} from '@adeya/ssi'
import { useNavigation } from '@react-navigation/core'
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack'
import React, { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DeviceEventEmitter, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

import Button, { ButtonType } from '../components/buttons/Button'
import CommonRemoveModal from '../components/modals/CommonRemoveModal'
import { ToastType } from '../components/toast/BaseToast'
import { EventTypes } from '../constants'
import { useTheme } from '../contexts/theme'
import { BifoldError } from '../types/error'
import { ContactStackParams, Screens, TabStacks } from '../types/navigators'
import { ModalUsage } from '../types/remove'
import { useAppAgent } from '../utils/agent'
import { formatTime, getConnectionName } from '../utils/helpers'
import { testIdWithKey } from '../utils/testable'

type ContactDetailsProps = StackScreenProps<ContactStackParams, Screens.ContactDetails>

const ContactDetails: React.FC<ContactDetailsProps> = ({ route }) => {
  const { connectionId } = route?.params
  const { agent } = useAppAgent()
  const { t } = useTranslation()
  const navigation = useNavigation<StackNavigationProp<ContactStackParams>>()
  const [isRemoveModalDisplayed, setIsRemoveModalDisplayed] = useState<boolean>(false)
  const [isCredentialsRemoveModalDisplayed, setIsCredentialsRemoveModalDisplayed] = useState<boolean>(false)
  const [isCredentialsOfferRemoveModalDisplayed, setIsCredentialsOfferRemoveModalDisplayed] = useState<boolean>(false)
  const [isProofRequestRemoveModalDisplayed, setIsProofRequestRemoveModalDisplayed] = useState<boolean>(false)
  const connection = useConnectionById(connectionId)
  // FIXME: This should be exposed via a react hook that allows to filter credentials by connection id
  const connectionCredentials = [
    ...useCredentialByState(CredentialState.CredentialReceived),
    ...useCredentialByState(CredentialState.Done),
  ].filter(credential => credential.connectionId === connection?.id)
  const { ColorPallet, TextTheme } = useTheme()

  const connectionCredentialsOffer = [...useCredentialByState(CredentialState.OfferReceived)].filter(
    credential => credential.connectionId === connection?.id,
  )
  const connectionProofRequest = [...useProofByState(ProofState.RequestReceived)].filter(
    credential => credential.connectionId === connection?.id,
  )
  const styles = StyleSheet.create({
    contentContainer: {
      padding: 20,
      backgroundColor: ColorPallet.brand.secondaryBackground,
    },
    controlsContainer: {
      marginTop: 'auto',
      margin: 20,
      justifyContent: 'center',
    },
  })

  const handleOnRemove = () => {
    switch (true) {
      case Boolean(connectionCredentialsOffer?.length):
        setIsCredentialsOfferRemoveModalDisplayed(true)
        break
      case Boolean(connectionCredentials?.length):
        setIsCredentialsRemoveModalDisplayed(true)
        break
      case Boolean(connectionProofRequest?.length):
        setIsProofRequestRemoveModalDisplayed(true)
        break
      default:
        setIsRemoveModalDisplayed(true)
        break
    }
  }

  const handleSubmitRemove = async () => {
    try {
      if (!(agent && connection)) {
        return
      }

      // deleting connection record
      await deleteConnectionRecordById(agent, connection.id)

      // deleting oob record
      if (connection?.outOfBandId) {
        await deleteOobRecordById(agent, connection.outOfBandId)
      }

      setIsRemoveModalDisplayed(false)
      navigation.navigate(Screens.Contacts)

      // FIXME: This delay is a hack so that the toast doesn't appear until the modal is dismissed
      await new Promise(resolve => setTimeout(resolve, 1000))
      Toast.show({
        type: ToastType.Success,
        text1: t('ContactDetails.ContactRemoved'),
      })
    } catch (err: unknown) {
      const error = new BifoldError(t('Error.Title1037'), t('Error.Message1037'), (err as Error)?.message ?? err, 1037)
      DeviceEventEmitter.emit(EventTypes.ERROR_ADDED, error)
    }
  }
  const handleCancelRemove = () => {
    setIsRemoveModalDisplayed(false)
  }

  const handleGoToCredentials = () => {
    navigation.getParent()?.navigate(TabStacks.CredentialStack, { screen: Screens.Credentials })
  }
  const handleGoToCredentialsOffer = () => {
    navigation.getParent()?.navigate(TabStacks.HomeStack, { screen: Screens.Home })
  }
  const handleCancelUnableRemove = () => {
    setIsCredentialsRemoveModalDisplayed(false)
  }

  const handleOfferCancelUnableRemove = () => {
    setIsCredentialsOfferRemoveModalDisplayed(false)
  }
  const handleProofRequestCancelUnableRemove = () => {
    setIsProofRequestRemoveModalDisplayed(false)
  }

  const callOnRemove = useCallback(() => handleOnRemove(), [])
  const callSubmitRemove = useCallback(() => handleSubmitRemove(), [connection])
  const callCancelRemove = useCallback(() => handleCancelRemove(), [])
  const callGoToCredentials = useCallback(() => handleGoToCredentials(), [])
  const callGoToCredentialsOffer = useCallback(() => handleGoToCredentialsOffer(), [])
  const callCancelUnableToRemove = useCallback(() => handleCancelUnableRemove(), [])
  const callCancelUnableToRemoveOffer = useCallback(() => handleOfferCancelUnableRemove(), [])
  const callCancelUnableToRemoveProofRequest = useCallback(() => handleProofRequestCancelUnableRemove(), [])

  const contactLabel = useMemo(() => getConnectionName(connection) ?? '', [connection])
  const onDismissModalTouched = () => {
    navigation.getParent()?.navigate(TabStacks.HomeStack, { screen: Screens.Home })
  }
  return (
    <SafeAreaView style={{ flexGrow: 1 }} edges={['bottom', 'left', 'right']}>
      {connection && (
        <View>
          <View style={styles.contentContainer}>
            <Text style={{ ...TextTheme.headingThree }}>{contactLabel}</Text>
            <Text style={{ ...TextTheme.normal, marginTop: 20 }}>
              {t('ContactDetails.DateOfConnection', {
                date: connection?.createdAt ? formatTime(connection.createdAt, { includeHour: true }) : '',
              })}
            </Text>
          </View>
          <TouchableOpacity
            onPress={callOnRemove}
            accessibilityLabel={t('ContactDetails.RemoveContact')}
            accessibilityRole={'button'}
            testID={testIdWithKey('RemoveFromWallet')}
            style={[styles.contentContainer, { marginTop: 10 }]}>
            <Text style={{ ...TextTheme.normal, color: ColorPallet.semantic.error }}>
              {t('ContactDetails.RemoveContact')}
            </Text>
          </TouchableOpacity>
          <CommonRemoveModal
            usage={ModalUsage.ContactRemove}
            visible={isRemoveModalDisplayed}
            onSubmit={callSubmitRemove}
            onCancel={callCancelRemove}
          />
          <CommonRemoveModal
            usage={ModalUsage.ContactRemoveWithCredentials}
            visible={isCredentialsRemoveModalDisplayed}
            onSubmit={callGoToCredentials}
            onCancel={callCancelUnableToRemove}
          />
          <CommonRemoveModal
            usage={ModalUsage.ContactRemoveWithCredentialsOffer}
            visible={isCredentialsOfferRemoveModalDisplayed}
            onSubmit={callGoToCredentialsOffer}
            onCancel={callCancelUnableToRemoveOffer}
          />
          <CommonRemoveModal
            usage={ModalUsage.ContactRemoveWithProofRequest}
            visible={isProofRequestRemoveModalDisplayed}
            onSubmit={callGoToCredentialsOffer}
            onCancel={callCancelUnableToRemoveProofRequest}
          />
        </View>
      )}
      <View style={[styles.controlsContainer]}>
        <Button
          title={t('Loading.BackToHome')}
          accessibilityLabel={t('Loading.BackToHome')}
          testID={testIdWithKey('BackToHome')}
          onPress={onDismissModalTouched}
          buttonType={ButtonType.ModalSecondary}
        />
      </View>
    </SafeAreaView>
  )
}

export default ContactDetails
