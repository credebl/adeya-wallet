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
import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Dimensions, TextInput, Platform, BackHandler } from 'react-native'
import { Config } from 'react-native-config'
import { DocumentPickerResponse, pickSingle, types } from 'react-native-document-picker'
import { stat } from 'react-native-fs'
import { Toast } from 'react-native-toast-message/lib/src/Toast'

import indyLedgers from '../../configs/ledgers/indy'
import ButtonLoading from '../components/animated/ButtonLoading'
import Button, { ButtonType } from '../components/buttons/Button'
import { ToastType } from '../components/toast/BaseToast'
import { useAuth } from '../contexts/auth'
import { DispatchAction } from '../contexts/reducers/store'
import { useStore } from '../contexts/store'
import { useTheme } from '../contexts/theme'
import { Screens } from '../types/navigators'
import { createLinkSecretIfRequired, getAgentModules } from '../utils/agent'

const ImportWalletVerify: React.FC = () => {
  const { ColorPallet } = useTheme()
  const [store, dispatch] = useStore()
  const navigation = useNavigation()
  const [PassPhrase, setPassPharse] = useState('')
  const { getWalletCredentials } = useAuth()
  const [verify, setverify] = useState(false)
  const [selectedfilepath, setselectedfilepath] = useState('')
  const { setAgent } = useAgent()
  const { height } = Dimensions.get('window')
  const { width } = Dimensions.get('window')

  const styles = StyleSheet.create({
    container: {
      flex: 1,
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
      marginTop: 'auto',
      margin: 20,
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

  const initAgent = async (seed: string): Promise<void> => {
    setverify(true)
    const credentials = await getWalletCredentials()
    if (!credentials?.id || !credentials.key) {
      // Cannot find wallet id/secret
      return
    }
    try {
      if (seed !== '') {
        const encodeHash = seed
        const newAgent = new Agent({
          config: {
            label: store.preferences.walletName || 'Aries Bifold',
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

        const walletConfig = {
          id: credentials.id,
          key: credentials.key,
        }

        const importConfig: WalletExportImportConfig = {
          key: encodeHash,
          path: selectedfilepath,
        }

        await newAgent.wallet.import(walletConfig, importConfig)

        await newAgent.initialize()

        await createLinkSecretIfRequired(newAgent)

        setAgent(newAgent)
        setverify(true)
        Toast.show({
          type: ToastType.Success,
          text1: `Walllet imported successfully `,
          visibilityTime: 2000,
          position: 'bottom',
        })
        dispatch({ type: DispatchAction.DID_COMPLETE_TUTORIAL })
        dispatch({ type: DispatchAction.DID_AUTHENTICATE })
        dispatch({ type: DispatchAction.DID_AGREE_TO_TERMS })
        dispatch({ type: DispatchAction.DID_CREATE_PIN })
        dispatch({ type: DispatchAction.DID_NAME_WALLET })
        navigation.navigate(Screens.UseBiometry as never)
      } else {
        setverify(false)
        Toast.show({
          type: ToastType.Error,
          text1: `Please enter pharse`,
        })
      }
    } catch (e: unknown) {
      Toast.show({
        type: ToastType.Error,
        text1: `You've entered an invalid formatted phrase.`,
        visibilityTime: 5000,
        position: 'bottom',
      })
      setverify(false)
    }
  }
  const VerifyPharase = async (seed: string) => {
    const result = seed.replaceAll(',', ' ')
    if (result) {
      initAgent(result)
    } else {
      Toast.show({
        type: ToastType.Error,
        text1: `Please enter phrase `,
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

      stat(res.fileCopyUri)
        .then(stats => {
          setselectedfilepath(stats.path)
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

  const handleUserphrase = (text: string) => {
    setPassPharse(text)
  }

  return (
    <View style={styles.container}>
      <View style={styles.textView}>
        <Text style={styles.detailText}>Enter your secret phrase here</Text>
      </View>
      <View style={styles.textInputView}>
        <TextInput
          style={styles.textInputStyle}
          multiline
          autoCapitalize="none"
          autoFocus
          onChangeText={text => handleUserphrase(text)}
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
    </View>
  )
}

export default ImportWalletVerify
