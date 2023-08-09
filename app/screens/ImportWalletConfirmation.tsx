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
import { CommonActions, useNavigation } from '@react-navigation/core'
import md5 from 'md5'
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Dimensions, TextInput, Platform } from 'react-native'
import { Config } from 'react-native-config'
import DocumentPicker, { DocumentPickerResponse, pickSingle, types } from 'react-native-document-picker'
import RNFS, { stat } from 'react-native-fs'
import { Toast } from 'react-native-toast-message/lib/src/Toast'

import indyLedgers from '../../configs/ledgers/indy'
import Button, { ButtonType } from '../components/buttons/Button'
import { ToastType } from '../components/toast/BaseToast'
import { useAuth } from '../contexts/auth'
import { useStore } from '../contexts/store'
import { useTheme } from '../contexts/theme'
import { Stacks } from '../types/navigators'
import { createLinkSecretIfRequired, getAgentModules } from '../utils/agent'
import { Encrypt768, keyGen768 } from '../utils/crystals-kyber'

const ImportWalletVerify: React.FC = () => {
  const { ColorPallet } = useTheme()
  const [store] = useStore()
  const navigation = useNavigation()
  const { getWalletCredentials } = useAuth()
  const [PassPhrase, setPassPharse] = useState('')
  const [encodeHash, setencodeHash] = useState('')
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
      borderColor: ColorPallet.grayscale.darkGrey,
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
      color: '#ffff',
    },
  })
  const initAgent = async (): Promise<void> => {
    try {
      const credentials = await getWalletCredentials()

      if (!credentials?.id || !credentials.key) {
        // Cannot find wallet id/secret
        return
      }

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
      Toast.show({
        type: ToastType.Success,
        text1: `Import successfully`,
        visibilityTime: 2000,
        position: 'bottom',
      })
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: Stacks.TabStack }],
        }),
      )

      // navigation.navigate(Stacks.TabStack)
    } catch (e: unknown) {
      Toast.show({
        type: ToastType.Error,
        text1: `${e}incorrect phrase entered`,
        visibilityTime: 2000,
        position: 'bottom',
      })
    }
  }

  const VerifyPharase = async (seed: string) => {
    const myKeys = await keyGen768(seed)
    const symetric = await Encrypt768(myKeys[0], seed)

    setencodeHash(md5(symetric[1]))

    if (encodeHash !== '') {
      initAgent()
    } else {
      Toast.show({
        type: ToastType.Error,
        text1: `Please enter pharse`,
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

      // RNFetchBlob.fs
      //   .stat(res.fileCopyUri)
      //   .then((stats) => {
      //     setselectedfilepath(stats.path)
      //   })
      //   .catch((err: string) => {
      //     Toast.show({
      //       type: ToastType.Error,
      //       text1: err,
      //     })
      //   })
    } catch (error) {
      Toast.show({
        type: ToastType.Error,
        text1: (error as Error).message || 'Unknown error',
      })
    }
  }

  useEffect(() => {
    handleSelect()
  }, [])

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
          onChangeText={text => setPassPharse(text)}
        />
      </View>
      <View style={{ marginTop: 'auto', margin: 20 }}>
        <Button
          title={'Verify'}
          buttonType={ButtonType.Primary}
          accessibilityLabel={'okay'}
          onPress={() => VerifyPharase(PassPhrase)}
        />
      </View>
    </View>
  )
}
export default ImportWalletVerify
