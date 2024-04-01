import {
  initializeAgent,
  ConsoleLogger,
  LogLevel,
  InitConfig,
  getAgentModules,
  CacheModule,
  SingleContextStorageLruCache,
} from '@adeya/ssi'
import { useNavigation } from '@react-navigation/core'
import { CommonActions } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, Text, View, useWindowDimensions, Image } from 'react-native'
import { Config } from 'react-native-config'
import { SafeAreaView } from 'react-native-safe-area-context'

import indyLedgers from '../../configs/ledgers/indy'
import InfoBox, { InfoBoxType } from '../components/misc/InfoBox'
import ProgressBar from '../components/tour/ProgressBar'
import TipCarousel from '../components/tour/TipCarousel'
import { useAuth } from '../contexts/auth'
import { DispatchAction } from '../contexts/reducers/store'
import { useStore } from '../contexts/store'
import { useTheme } from '../contexts/theme'
import { Stacks } from '../types/navigators'
import { AdeyaAgent, useAppAgent } from '../utils/agent'
import { testIdWithKey } from '../utils/testable'

enum InitErrorTypes {
  Onboarding,
  Agent,
}

/**
 * To customize this splash screen set the background color of the
 * iOS and Android launch screen to match the background color of
 * of this view.
 */
const Splash: React.FC = () => {
  const { width } = useWindowDimensions()
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
  const { getWalletCredentials, setPIN, commitPIN, checkPIN } = useAuth()
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

  useEffect(() => {
    const initWallet = async () => {
      try {
        const credentials = await getWalletCredentials()
        if (typeof credentials === 'object' && Object.keys(credentials).length === 0) {
          await setPIN('111111')
          await commitPIN(false)
        } else {
          await checkPIN('111111')
          dispatch({
            type: DispatchAction.DID_AUTHENTICATE,
          })
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('Error in initWallet: ', e)
        // todo (WK)
      }
    }

    initWallet()
  }, [])

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

  useEffect(() => {
    const initAgent = async (): Promise<void> => {
      try {
        if (!store.authentication.didAuthenticate) {
          return
        }

        setStep(4)
        const credentials = await getWalletCredentials()

        if (!credentials?.id || !credentials.key) {
          // Cannot find wallet id/secret
          return
        }

        setStep(5)
        if (!Config.MEDIATOR_URL) {
          throw new Error('Missing mediator URL')
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
          modules: {
            ...getAgentModules(Config.MEDIATOR_URL, indyLedgers),
            cache: new CacheModule({
              cache: new SingleContextStorageLruCache({
                limit: 50,
              }),
            }),
          },
        })) as unknown as AdeyaAgent

        setStep(6)
        setAgent(newAgent)

        setStep(7)

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: Stacks.ProofRequestsStack }],
          }),
        )
      } catch (e: unknown) {
        setInitErrorType(InitErrorTypes.Agent)
        setInitError(e as Error)
      }
    }

    initAgent()
  }, [store.authentication.didAuthenticate, initAgentCount])

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
