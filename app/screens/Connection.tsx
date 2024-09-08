import { useConnectionById } from '@adeya/ssi'
import { useFocusEffect } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { useCallback, useEffect, useMemo, useReducer, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { AccessibilityInfo, Modal, ScrollView, StyleSheet, Text, View } from 'react-native'
import { heightPercentageToDP } from 'react-native-responsive-screen'
import { SafeAreaView } from 'react-native-safe-area-context'

import Button, { ButtonType } from '../components/buttons/Button'
import { useAnimatedComponents } from '../contexts/animated-components'
import { useConfiguration } from '../contexts/configuration'
import { useTheme } from '../contexts/theme'
import { useOutOfBandById } from '../hooks/connections'
import { useNotifications } from '../hooks/notifications'
import { Screens, TabStacks, DeliveryStackParams, Stacks } from '../types/navigators'
import { useAppAgent } from '../utils/agent'
import { testIdWithKey } from '../utils/testable'

type ConnectionProps = StackScreenProps<DeliveryStackParams, Screens.Connection>

type MergeFunction = (current: LocalState, next: Partial<LocalState>) => LocalState

type LocalState = {
  isVisible: boolean
  isInitialized: boolean
  notificationRecord?: any
  shouldShowDelayMessage: boolean
  connectionIsActive: boolean
}

const Connection: React.FC<ConnectionProps> = ({ navigation, route }) => {
  // TODO(jl): When implementing goal codes the `autoRedirectConnectionToHome`
  // logic should be: if this property is set, rather than showing the
  // delay message, the user should be redirected to the home screen.
  const { connectionTimerDelay, autoRedirectConnectionToHome } = useConfiguration()
  const connTimerDelay = connectionTimerDelay ?? 10000 // in ms
  const { connectionId, outOfBandId, threadId } = route.params
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const connection = connectionId ? useConnectionById(connectionId) : undefined
  const { t } = useTranslation()
  const { notifications } = useNotifications()
  const { ColorPallet, TextTheme } = useTheme()
  const { ConnectionLoading } = useAnimatedComponents()
  const { agent } = useAppAgent()
  const oobRecord = useOutOfBandById(agent, outOfBandId ?? '')
  const goalCode = oobRecord?.outOfBandInvitation.goalCode
  const merge: MergeFunction = (current, next) => ({ ...current, ...next })
  const [state, dispatch] = useReducer(merge, {
    isVisible: true,
    isInitialized: false,
    shouldShowDelayMessage: false,
    connectionIsActive: false,
  })

  const styles = StyleSheet.create({
    container: {
      height: '100%',
      backgroundColor: ColorPallet.brand.modalPrimaryBackground,
      padding: 20,
    },
    image: {
      marginTop: 20,
    },
    messageContainer: {
      alignItems: 'center',
    },
    messageText: {
      fontWeight: 'normal',
      textAlign: 'center',
      marginTop: 30,
    },
    controlsContainer: {
      marginTop: 'auto',
      margin: 20,
    },
    controlsContainerHome: {
      justifyContent: 'center',
      alignSelf: 'center',
      marginTop: heightPercentageToDP('50%'),
    },
    delayMessageText: {
      textAlign: 'center',
      marginTop: 20,
    },
  })

  const goalCodeAction = (goalCode: string): (() => void) => {
    const codes: { [key: string]: undefined | (() => void) } = {
      'aries.vc.verify': () => navigation.navigate(Screens.ProofRequest, { proofId: state.notificationRecord.id }),
      'aries.vc.issue': () =>
        navigation.navigate(Screens.CredentialOffer, { credentialId: state.notificationRecord.id }),
    }
    let action = codes[goalCode]

    if (action === undefined) {
      const matchCode = Object.keys(codes).find(code => goalCode.startsWith(code))
      action = codes[matchCode ?? '']

      if (action === undefined) {
        throw new Error('Unhandled goal code type')
      }
    }

    return action
  }

  const startTimer = () => {
    if (!state.isInitialized) {
      timerRef.current = setTimeout(() => {
        dispatch({ shouldShowDelayMessage: true })
        timerRef.current = null
      }, connTimerDelay)

      dispatch({ isInitialized: true })
    }
  }

  const abortTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const onDismissModalTouched = () => {
    dispatch({ shouldShowDelayMessage: false, isVisible: false })
    navigation.getParent()?.navigate(TabStacks.HomeStack, { screen: Screens.Home })
  }

  useEffect(() => {
    if (state.shouldShowDelayMessage && !state.notificationRecord) {
      if (autoRedirectConnectionToHome) {
        dispatch({ shouldShowDelayMessage: false, isVisible: false })
        navigation.getParent()?.navigate(TabStacks.HomeStack, { screen: Screens.Home })
      } else {
        AccessibilityInfo.announceForAccessibility(t('Connection.TakingTooLong'))
      }
    }
  }, [state.shouldShowDelayMessage])

  useEffect(() => {
    if (
      !connectionId &&
      !oobRecord &&
      !goalCode &&
      state.notificationRecord &&
      state.notificationRecord.state === 'request-received'
    ) {
      navigation.navigate(Screens.ProofRequest, { proofId: state.notificationRecord.id })
      dispatch({ isVisible: false })

      return
    }

    if (
      connectionId &&
      oobRecord &&
      (!goalCode || (!goalCode.startsWith('aries.vc.verify') && !goalCode.startsWith('aries.vc.issue')))
    ) {
      navigation.navigate(Stacks.ContactStack, {
        screen: Screens.ContactDetails,
        params: { connectionId: connectionId },
      })
      dispatch({ isVisible: false })
      return
    }

    if (state.notificationRecord && goalCode) {
      goalCodeAction(goalCode)()
    }
  }, [connection, oobRecord, goalCode, state.notificationRecord])

  useMemo(() => {
    startTimer()
    return () => abortTimer
  }, [])

  useFocusEffect(
    useCallback(() => {
      startTimer()
      return () => abortTimer
    }, []),
  )

  useEffect(() => {
    if (state.isVisible) {
      for (const notification of notifications) {
        if (
          !state.notificationRecord &&
          ((connectionId && notification.connectionId === connectionId) ||
            (threadId && notification.threadId == threadId))
        ) {
          dispatch({ notificationRecord: notification, isVisible: false })
          break
        }
        if (!connection && notification.state === 'request-received') {
          dispatch({ notificationRecord: notification, isVisible: false })
          break
        }
      }
    }
  }, [notifications])

  return (
    <View>
      <Modal
        visible={state.isVisible}
        transparent={true}
        animationType={'slide'}
        onRequestClose={() => {
          dispatch({ isVisible: false })
        }}>
        <SafeAreaView style={{ backgroundColor: ColorPallet.brand.modalPrimaryBackground }}>
          <ScrollView style={[styles.container]}>
            <View style={[styles.messageContainer]}>
              <Text
                style={[TextTheme.modalHeadingThree, styles.messageText]}
                testID={testIdWithKey('CredentialOnTheWay')}>
                {t('Connection.JustAMoment')}
              </Text>
            </View>

            <View style={[styles.image]}>
              <ConnectionLoading />
            </View>

            {state.shouldShowDelayMessage && (
              <Text style={[TextTheme.modalNormal, styles.delayMessageText]} testID={testIdWithKey('TakingTooLong')}>
                {t('Connection.TakingTooLong')}
              </Text>
            )}
          </ScrollView>
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
      </Modal>
      <View style={[styles.controlsContainerHome]}>
        <Button
          title={t('Loading.BackToHome')}
          accessibilityLabel={t('Loading.BackToHome')}
          testID={testIdWithKey('BackToHome')}
          onPress={onDismissModalTouched}
          buttonType={ButtonType.ModalSecondary}
        />
      </View>
    </View>
  )
}

export default Connection
