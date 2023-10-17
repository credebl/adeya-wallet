import {
  Agent,
  AutoAcceptCredential,
  ConsoleLogger,
  HttpOutboundTransport,
  LogLevel,
  MediatorPickupStrategy,
  WsOutboundTransport,
} from '@aries-framework/core'
import { useAgent } from '@aries-framework/react-hooks'
import { agentDependencies } from '@aries-framework/react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/core'
import { CommonActions } from '@react-navigation/native'
import {
  LocalStorageKeys,
  DispatchAction,
  Screens,
  Stacks,
  OnboardingState,
  LoginAttemptState,
  PreferencesState,
  ToursState,
  useAuth,
  useTheme,
  useStore,
  useConfiguration,
  InfoBox,
  InfoBoxType,
  testIdWithKey,
} from 'aries-bifold'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, Text, View, useWindowDimensions, Image } from 'react-native'
import { Config } from 'react-native-config'
import { SafeAreaView } from 'react-native-safe-area-context'

import indyLedgers from '../../configs/ledgers/indy'
import InfoBox, { InfoBoxType } from '../components/misc/InfoBox'
import ProgressBar from '../components/tour/ProgressBar'
import TipCarousel from '../components/tour/TipCarousel'
import { LocalStorageKeys } from '../constants'
import { useAuth } from '../contexts/auth'
import { useConfiguration } from '../contexts/configuration'
import { DispatchAction } from '../contexts/reducers/store'
import { useStore } from '../contexts/store'
import { useTheme } from '../contexts/theme'
import { Screens, Stacks } from '../types/navigators'
import {
  LoginAttempt as LoginAttemptState,
  Preferences as PreferencesState,
  Onboarding as StoreOnboardingState,
  Tours as ToursState,
} from '../types/state'
import { AdeyaAgent, useAppAgent } from '../utils/agent'
import { testIdWithKey } from '../utils/testable'

enum InitErrorTypes {
  Onboarding,
  Agent,
}
const onboardingComplete = (state: StoreOnboardingState): boolean => {
  return state.didCompleteTutorial && state.didAgreeToTerms && state.didCreatePIN && state.didConsiderBiometry
}

const resumeOnboardingAt = (state: OnboardingState): Screens => {
  if (state.didCompleteTutorial && state.didAgreeToTerms && state.didCreatePIN && !state.didConsiderBiometry) {
    return Screens.UseBiometry
  }

  if (state.didCompleteTutorial && state.didAgreeToTerms && !state.didCreatePIN) {
    return Screens.CreatePIN
  }

  if (state.didCompleteTutorial && !state.didAgreeToTerms) {
    return Screens.Terms
  }

  return Screens.Onboarding
}
/*
  To customize this splash screen set the background color of the
  iOS and Android launch screen to match the background color of
  of this view.
*/
const Splash: React.FC = () => {
  const { width } = useWindowDimensions()
  const { setAgent } = useAgent()
  const { t } = useTranslation()
  const [store, dispatch] = useStore()
  const navigation = useNavigation()
  const { getWalletCredentials } = useAuth()
  const { ColorPallet, Assets } = useTheme()
  const { indyLedgers } = useConfiguration()
  const [stepText, setStepText] = useState<string>(t('Init.Starting'))
  const [progressPercent, setProgressPercent] = useState(0)
  const [initOnboardingCount, setInitOnboardingCount] = useState(0)
  const [initAgentCount, setInitAgentCount] = useState(0)
  const { setAgent } = useAppAgent()
  const { t } = useTranslation()
  const [stepText, setStepText] = useState<string>(t('Init.Starting'))
  const [initError, setInitError] = useState<Error | null>(null)
  const [initErrorType, setInitErrorType] = useState<InitErrorTypes>(InitErrorTypes.Onboarding)

  const { Assets } = useTheme()
  const [store, dispatch] = useStore()
  const navigation = useNavigation()
  const { getWalletCredentials } = useAuth()
  const { ColorPallet } = useTheme()
  const steps: string[] = [
    t('Init.Starting'),
    t('Init.CheckingAuth'),
    t('Init.FetchingPreferences'),
    t('Init.VerifyingOnboarding'),
    t('Init.GettingCredentials'),
    t('Init.InitializingAgent'),
    t('Init.SettingAgent'),
    t('Init.Finishing'),
  ]

  const setStep = (stepIdx: number) => {
    setStepText(steps[stepIdx])
    const percent = Math.floor(((stepIdx + 1) / steps.length) * 100)
    setProgressPercent(percent)
  }

  const styles = StyleSheet.create({
    screenContainer: {
      backgroundColor: ColorPallet.brand.primaryBackground,
      flex: 1,
    },
    scrollContentContainer: {
      flexGrow: 1,
      justifyContent: 'space-between',
    },
    progressContainer: {
      alignItems: 'center',
      width: '100%',
    },
    stepTextContainer: {
      marginTop: 10,
    },
    stepText: {
      fontSize: 16,
      color: '#a8abae',
    },
    carouselContainer: {
      width,
      marginVertical: 30,
      flex: 1,
    },
    errorBoxContainer: {
      paddingHorizontal: 20,
    },
    logoContainer: {
      alignSelf: 'center',
      marginBottom: 30,
    },
  })

  const loadAuthAttempts = async (): Promise<LoginAttemptState | undefined> => {
    try {
      const attemptsData = await AsyncStorage.getItem(LocalStorageKeys.LoginAttempts)
      if (attemptsData) {
        const attempts = JSON.parse(attemptsData) as LoginAttemptState
        dispatch({
          type: DispatchAction.ATTEMPT_UPDATED,
          payload: [attempts],
        })
        return attempts
      }
    } catch (error) {
      // todo (WK)
    }
    return undefined
  }

  useEffect(() => {
    const initOnboarding = async (): Promise<void> => {
      try {
        setStep(0)
        if (store.authentication.didAuthenticate) {
          return
        }

        setStep(1)
        // load authentication attempts from storage
        const attemptData = await loadAuthAttempts()

        setStep(2)
        const preferencesData = await AsyncStorage.getItem(LocalStorageKeys.Preferences)

        if (preferencesData) {
          const dataAsJSON = JSON.parse(preferencesData) as PreferencesState

          dispatch({
            type: DispatchAction.PREFERENCES_UPDATED,
            payload: [dataAsJSON],
          })
        }

        const toursData = await AsyncStorage.getItem(LocalStorageKeys.Tours)
        if (toursData) {
          const dataAsJSON = JSON.parse(toursData) as ToursState

          dispatch({
            type: DispatchAction.TOUR_DATA_UPDATED,
            payload: [dataAsJSON],
          })
        }

        setStep(3)
        const data = await AsyncStorage.getItem(LocalStorageKeys.Onboarding)
        if (data) {
          const dataAsJSON = JSON.parse(data) as StoreOnboardingState
          dispatch({
            type: DispatchAction.ONBOARDING_UPDATED,
            payload: [dataAsJSON],
          })

          if (onboardingComplete(dataAsJSON) && !attemptData?.lockoutDate) {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: Screens.EnterPIN }],
              }),
            )
            return
          }
          if (onboardingComplete(dataAsJSON) && attemptData?.lockoutDate) {
            // return to lockout screen if lockout date is set
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: Screens.AttemptLockout }],
              }),
            )
            return
          }

          // If onboarding was interrupted we need to pickup from where we left off.
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: resumeOnboardingAt(dataAsJSON) }],
            })
          )

          return
        }

        // We have no onboarding state, starting from step zero.
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: Screens.Onboarding }],
          }),
        )
      } catch (e: unknown) {
        setInitErrorType(InitErrorTypes.Onboarding)
        setInitError(e as Error)
      }
    }
    initOnboarding()
  }, [store.authentication.didAuthenticate, initOnboardingCount])

  useEffect(() => {
    const initAgent = async (): Promise<void> => {
      try {
        if (!store.authentication.didAuthenticate || !store.onboarding.didConsiderBiometry) {
          return
        }

        setStep(4)
        const credentials = await getWalletCredentials()

        if (!credentials?.id || !credentials.key) {
          // Cannot find wallet id/secret
          return
        }

        setStep(5)
        const options = {
          config: {
            label: 'ADEYA Wallet',
            mediatorConnectionsInvite: Config.MEDIATOR_URL,
            mediatorPickupStrategy: MediatorPickupStrategy.Implicit,
            walletConfig: { id: credentials.id, key: credentials.key },
            autoAcceptConnections: true,
            autoAcceptCredentials: AutoAcceptCredential.ContentApproved,
            logger: new ConsoleLogger(LogLevel.trace),
            indyLedgers,
            connectToIndyLedgersOnStartup: false,
            autoUpdateStorageOnStartup: true,
          },
          dependencies: agentDependencies,
        }

        const agentConfig: InitConfig = {
          label: store.preferences.walletName || 'ADEYA Wallet',
          walletConfig: {
            id: credentials.id,
            key: credentials.key,
          },
          logger: new ConsoleLogger(LogLevel.debug),
          autoUpdateStorageOnStartup: true,
        }

        const newAgent = (await initializeAgent({
          agentConfig,
          modules: getAgentModules(Config.MEDIATOR_URL, indyLedgers),
        })) as unknown as AdeyaAgent

        setStep(6)
        await newAgent.initialize()

        setStep(7)
        await newAgent.ledger.connectToPools()

        setStep(8)
        setAgent(newAgent)

        setStep(7)
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: Stacks.TabStack }],
          }),
        )
      } catch (e: unknown) {
        setInitErrorType(InitErrorTypes.Agent)
        setInitError(e as Error)
      }
    }

    initAgent()
  }, [store.authentication.didAuthenticate, store.onboarding.didConsiderBiometry, initAgentCount])

  const handleErrorCallToActionPressed = () => {
    setInitError(null)
    if (initErrorType === InitErrorTypes.Agent) {
      setInitAgentCount(initAgentCount + 1)
    } else {
      setInitOnboardingCount(initOnboardingCount + 1)
    }
  }
  return (
    <SafeAreaView style={styles.screenContainer}>
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.progressContainer} testID={testIdWithKey('LoadingActivityIndicator')}>
          <ProgressBar progressPercent={progressPercent} />
          <View style={styles.stepTextContainer}>
            <Text style={styles.stepText}>{stepText}</Text>
          </View>
        </View>
        <View style={styles.carouselContainer}>
          {initError ? (
            <View style={styles.errorBoxContainer}>
              <InfoBox
                notificationType={InfoBoxType.Error}
                title={t('Error.Title2026')}
                description={t('Error.Message2026')}
                message={initError?.message || t('Error.Unknown')}
                onCallToActionLabel={t('Init.Retry')}
                onCallToActionPressed={handleErrorCallToActionPressed}
              />
            </View>
          ) : (
            <TipCarousel />
          )}
        </View>
        <View style={styles.logoContainer}>
          <Image
            source={Assets.img.logoPrimary.src}
            resizeMode={Assets.img.logoPrimary.resizeMode}
            style={{ width: Assets.img.logoPrimary.width, height: Assets.img.logoPrimary.height }}
            testID={testIdWithKey('LoadingActivityIndicatorImage')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Splash
