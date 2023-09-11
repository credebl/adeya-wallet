import {
  Agent,
  ConsoleLogger,
  LogLevel,
  WalletExportImportConfig,
  HttpOutboundTransport,
  WsOutboundTransport,
} from '@aries-framework/core'
import { useAgent } from '@aries-framework/react-hooks'
import { agentDependencies } from '@aries-framework/react-native'
import { StackScreenProps } from '@react-navigation/stack'
import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  Platform,
  BackHandler,
  Keyboard,
  ScrollView,
} from 'react-native'
import { Config } from 'react-native-config'
import { DocumentPickerResponse, pickSingle, types } from 'react-native-document-picker'
import * as RNFS from 'react-native-fs'
import { heightPercentageToDP } from 'react-native-responsive-screen'
import { Toast } from 'react-native-toast-message/lib/src/Toast'

import indyLedgers from '../../configs/ledgers/indy'
import ButtonLoading from '../components/animated/ButtonLoading'
import Button, { ButtonType } from '../components/buttons/Button'
import { ToastType } from '../components/toast/BaseToast'
import { useAuth } from '../contexts/auth'
import { useStore } from '../contexts/store'
import { useTheme } from '../contexts/theme'
import { AuthenticateStackParams, Screens } from '../types/navigators'
import { getAgentModules } from '../utils/agent'

type ImportWalletVerifyProps = StackScreenProps<AuthenticateStackParams, Screens.ImportWalletVerify>

const ImportWalletVerify: React.FC<ImportWalletVerifyProps> = ({ navigation }) => {
  const { ColorPallet } = useTheme()
  const [store] = useStore()
  const [PassPhrase, setPassPhrase] = useState('')
  const { getWalletCredentials, checkImportWallet } = useAuth()
  const [verify, setVerify] = useState(false)
  const [selectedFilePath, setSelectedFilePath] = useState('')
  const { setAgent } = useAgent()
  const { height } = Dimensions.get('window')
  const { width } = Dimensions.get('window')

  const styles = StyleSheet.create({
    container: {
      height: '100%',
    },
    dottedBox: {
      marginTop: height / 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    textInputStyle: {
      borderRadius: 10,
      borderWidth: 2,
      borderColor: ColorPallet.brand.primary,
      width: width - 40,
      paddingLeft: width / 20,
      textAlignVertical: 'top',
      alignItems: 'center',
      fontSize: Platform.OS === 'ios' ? height / 50 : height / 45,
      justifyContent: 'flex-start',
      height: Platform.OS === 'ios' ? height / 9 : height / 8,
    },
    textInputView: {
      width,
      margin: 20,
    },
    textView: {
      width,
      margin: 20,
    },
    detailText: {
      justifyContent: 'flex-start',
      fontSize: 25,
      color: ColorPallet.brand.primary,
    },
    verifyButton: {
      marginTop: heightPercentageToDP('50%'),
      margin: 20,
      flex: 2,
    },
  })
  useEffect(() => {
    const handleBackButtonClick = () => {
      navigation.goBack()
      return true
    }
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick)
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick)
    }
  }, [navigation])

  const deleteTempImportedWallet = async (walletPath: string) => {
    await RNFS.unlink(walletPath)
  }

  const initAgent = async (seed: string): Promise<void> => {
    setVerify(true)
    Keyboard.dismiss()
    const credentials = await getWalletCredentials()
    if (!credentials?.id || !credentials.key) {
      // Cannot find wallet id/secret
      return
    }
    try {
      if (!seed) {
        setVerify(false)
        Toast.show({
          type: ToastType.Error,
          text1: `Please enter passphrase`,
        })
      }
      const encodeHash = seed

      const walletConfig = {
        id: credentials.id,
        key: credentials.key,
      }

      const importConfig: WalletExportImportConfig = {
        key: encodeHash,
        path: selectedFilePath,
      }

      const tempImportPath = RNFS.DocumentDirectoryPath + '/importTemp'

      const response = await checkImportWallet(
        {
          ...walletConfig,
          storage: {
            type: 'sqlite',
            path: tempImportPath,
          },
        },
        importConfig,
      )
      if (!response) {
        await deleteTempImportedWallet(tempImportPath)
        Toast.show({
          type: ToastType.Error,
          text1: `You've entered an invalid passphrase.`,
          visibilityTime: 5000,
          position: 'bottom',
        })
        setVerify(false)
        return
      }

      await deleteTempImportedWallet(tempImportPath)

      const newAgent = new Agent({
        config: {
          label: store.preferences.walletName,
          walletConfig: {
            id: credentials.id,
            key: credentials.key,
          },
          logger: new ConsoleLogger(LogLevel.trace),
          autoUpdateStorageOnStartup: true,
        },
        dependencies: agentDependencies,
        modules: getAgentModules({
          indyNetworks: indyLedgers,
          mediatorInvitationUrl: Config.MEDIATOR_URL,
        }),
      })
      const wsTransport = new WsOutboundTransport()
      const httpTransport = new HttpOutboundTransport()

      newAgent.registerOutboundTransport(wsTransport)
      newAgent.registerOutboundTransport(httpTransport)

      await newAgent.wallet.import(walletConfig, importConfig)

      await newAgent.wallet.initialize(walletConfig)

      await newAgent.initialize()

      setAgent(newAgent)
      setVerify(true)
      Toast.show({
        type: ToastType.Success,
        text1: `Wallet imported successfully`,
        visibilityTime: 2000,
        position: 'bottom',
      })
      navigation.navigate(Screens.UseBiometry)
    } catch (e: unknown) {
      Toast.show({
        type: ToastType.Error,
        text1: `You've entered an invalid passphrase.`,
        visibilityTime: 5000,
        position: 'bottom',
      })
      setVerify(false)
    }
  }
  const VerifyPharase = async (seed: string) => {
    const result = seed.replaceAll(',', ' ')
    if (result) {
      initAgent(result)
    } else {
      Toast.show({
        type: ToastType.Error,
        text1: `Please enter passphrase`,
        visibilityTime: 2000,
        position: 'bottom',
      })
    }
  }
  const handleSelect = async () => {
    try {
      const res: DocumentPickerResponse = await pickSingle({
        type: [types.allFiles],
        copyTo: 'documentDirectory',
      })

      if (!res.fileCopyUri) {
        Toast.show({
          type: ToastType.Error,
        })
        return
      }

      RNFS.stat(res.fileCopyUri)
        .then(stats => {
          setSelectedFilePath(stats.path)
        })
        .catch(err => {
          Toast.show({
            type: ToastType.Error,
            text1: err,
          })
        })
    } catch (error) {
      navigation.goBack()
      Toast.show({
        type: ToastType.Error,
        text1: (error as Error).message || 'Unknown error',
      })
    }
  }

  useEffect(() => {
    handleSelect()
  }, [])

  const handleUserPhrase = (text: string) => {
    setPassPhrase(text)
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.textView}>
        <Text style={styles.detailText}>Enter your secret phrase here</Text>
      </View>
      <View style={styles.textInputView}>
        <TextInput
          style={styles.textInputStyle}
          multiline
          autoCapitalize="none"
          autoFocus
          onChangeText={handleUserPhrase}
        />
      </View>
      <View style={styles.verifyButton}>
        <Button
          title={'Verify'}
          buttonType={ButtonType.Primary}
          accessibilityLabel={'okay'}
          disabled={verify}
          onPress={() => VerifyPharase(PassPhrase)}>
          {verify && <ButtonLoading />}
        </Button>
      </View>
    </ScrollView>
  )
}

export default ImportWalletVerify
