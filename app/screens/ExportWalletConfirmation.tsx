import { useAgent } from '@aries-framework/react-hooks'
import { useNavigation, useRoute } from '@react-navigation/core'
import md5 from 'md5'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text, TouchableOpacity, ScrollView, PermissionsAndroid, Platform, Share } from 'react-native'
import RNFS, { exists, mkdir, unlink, DownloadDirectoryPath } from 'react-native-fs'
import Toast from 'react-native-toast-message'
import { zip } from 'react-native-zip-archive'
import RNFetchBlob from 'rn-fetch-blob'

import styles from '../WalletConfirmationstyle'
import ButtonLoading from '../components/animated/ButtonLoading'
import Button, { ButtonType } from '../components/buttons/Button'
import { ToastType } from '../components/toast/BaseToast'
import { useTheme } from '../contexts/theme'
import { Screens } from '../types/navigators'
import { Encrypt768, keyGen768 } from '../utils/crystals-kyber'

interface PhraseData {
  id: number
  value: string
}

function ExportWalletConfirmation() {
  const { agent } = useAgent()
  const navigation = useNavigation()
  const parms = useRoute()
  const { t } = useTranslation()
  const [phraseData, setPhraseData] = useState<PhraseData[]>([])
  const [arraySetPhraseData, setArraySetPhraseData] = useState<string[]>([])
  const [nextPhraseIndex, setNextPhraseIndex] = useState(0)
  const [matchPhrase, setMatchPhrase] = useState(false)
  const { ColorPallet, TextTheme } = useTheme()

  useEffect(() => {
    const updatedArraySetPhraseData = Array(parms?.params?.phraseData.length).fill('')
    setArraySetPhraseData(updatedArraySetPhraseData)
  }, [])

  const exportWallet = async (seed: string) => {
    setMatchPhrase(true)
    const myKeys = await keyGen768(seed)
    const symetric = await Encrypt768(myKeys[0], seed)
    const encodeHash = md5(symetric[1])
    try {
      const documentDirectory = DownloadDirectoryPath
      const zipDirectory = `${documentDirectory}/Wallet_Backup`
      const destFileExists = await exists(zipDirectory)
      if (destFileExists) {
        await unlink(zipDirectory)
      }
      const date = new Date()
      const dformat = `${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`
      const WALLET_FILE_NAME = `SSI_Wallet_${dformat}`

      await mkdir(zipDirectory)
      const destinationZipPath = `${documentDirectory}/${WALLET_FILE_NAME}.zip`
      const encryptedFileName = `${WALLET_FILE_NAME}.wallet`
      const encryptedFileLocation = `${zipDirectory}/${encryptedFileName}`

      const exportConfig = {
        key: encodeHash,
        path: encryptedFileLocation,
      }

      await agent?.wallet.export(exportConfig)

      await zip(zipDirectory, destinationZipPath)
      Toast.show({
        type: ToastType.Success,
        text1: 'Backup successfully',
      })
      setMatchPhrase(true)
      navigation.navigate(Screens.Success as never)
    } catch (e) {
      Toast.show({
        type: ToastType.Error,
        text1: 'Backup failed',
      })
    }
  }
  const exportWalletIOS = async (seed: string) => {
    const myKeys = await keyGen768(seed)
    const symetric = await Encrypt768(myKeys[0], seed)
    const encodeHash = md5(symetric[1])
    const { fs } = RNFetchBlob
    try {
      const documentDirectory = fs.dirs.DocumentDir

      const zipDirectory = `${documentDirectory}/Wallet_Backup`

      const destFileExists = await fs.exists(zipDirectory)
      if (destFileExists) {
        await fs.unlink(zipDirectory)
      }

      const date = new Date()
      const dformat = `${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`
      const WALLET_FILE_NAME = `SSI_Wallet_${dformat}`

      await fs
        .mkdir(zipDirectory)
        // .then(() => console.log('generated'))
        .catch(err =>
          Toast.show({
            type: ToastType.Error,
            text1: err,
          }),
        )
      const destinationZipPath = `${documentDirectory}/${WALLET_FILE_NAME}.zip`
      const encryptedFileName = `${WALLET_FILE_NAME}.wallet`
      const encryptedFileLocation = `${zipDirectory}/${encryptedFileName}`

      const exportConfig = {
        key: encodeHash,
        path: encryptedFileLocation,
      }

      await agent?.wallet.export(exportConfig)

      await zip(zipDirectory, destinationZipPath)
      if (Platform.OS === 'ios') {
        await Share.share({
          title: 'Share file',
          url: encryptedFileLocation,
        })
      }

      Toast.show({
        type: ToastType.Success,
        text1: 'Backup successfully',
      })
      setMatchPhrase(true)
      navigation.navigate(Screens.Success, { encryptedFileLocation })
    } catch (e) {
      Toast.show({
        type: ToastType.Error,
        text1: 'Backup failed',
      })
    }
  }

  const addPhrase = (item: string, index: number) => {
    const updatedPhraseData = [...phraseData]
    updatedPhraseData[index] = { id: index + 1, value: item }

    const updatedArraySetPhraseData = [...arraySetPhraseData]
    updatedArraySetPhraseData[index] = item
    setPhraseData(updatedPhraseData)
    setArraySetPhraseData(updatedArraySetPhraseData)

    setNextPhraseIndex(index)
  }

  const setPhrase = (item: string, index: number) => {
    const updatedArraySetPhraseData = [...arraySetPhraseData]
    updatedArraySetPhraseData[index] = ''
    setArraySetPhraseData(updatedArraySetPhraseData)
    setNextPhraseIndex(index + 1)
  }

  const askPermission = async (sysPassPhrase: string) => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
          title: 'Permission',
          message: 'PCM needs to write to storage',
          buttonPositive: '',
        })
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          exportWallet(sysPassPhrase)
        }
      } catch (error) {
        Toast.show({
          type: ToastType.Error,
          text1: `${error}`,
        })
      }
    } else {
      exportWalletIOS(sysPassPhrase)
    }
  }

  const verifyPhrase = () => {
    const addedPassPhraseData = arraySetPhraseData.join(',')
    const displayedPassphrase = phraseData.map(item => item.value).join(',')

    if (displayedPassphrase.trim() !== '') {
      const sysPassPhrase = addedPassPhraseData.trim()
      const userPassphrase = displayedPassphrase.trim()

      if (sysPassPhrase === userPassphrase) {
        askPermission(sysPassPhrase)
      } else {
        Toast.show({
          type: ToastType.Error,
          text1: 'Phrase not matched',
        })
      }
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <Text style={[TextTheme.headerTitle, styles.titleText]}>{t('Backup.confirm_seed_phrase')}</Text>
        <Text style={[TextTheme.label, styles.detailText]}>{t('Backup.select_each')}</Text>
      </View>
      <ScrollView>
        <View style={[styles.addPhraseView]}>
          {arraySetPhraseData.map((item, index) => (
            <TouchableOpacity onPress={() => setPhrase(item, index)} key={index} disabled={matchPhrase}>
              <View style={styles.rowItemContainerView}>
                <View
                  style={[
                    styles.rowAItemContainerView,
                    {
                      borderStyle: item !== '' || index === nextPhraseIndex ? 'solid' : 'dashed',
                      borderColor:
                        item !== '' || index === nextPhraseIndex
                          ? ColorPallet.brand.primary
                          : ColorPallet.brand.primary,
                    },
                  ]}>
                  <Text style={[TextTheme.label, styles.rowItemPhraseText]}>{item}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          <View style={styles.setPhraseView} />

          {parms?.params?.phraseData?.map((item: string[], index: number) => (
            <TouchableOpacity
              disabled={matchPhrase}
              onPress={() => addPhrase(item, index)}
              style={[styles.rowAddItemContainerView]}
              key={index}>
              <View>
                <Text style={[styles.rowAddItemText]}>{item}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={{ margin: 20 }}>
        <Button
          title={'COMPLETE BACKUP'}
          accessibilityLabel={'Okay'}
          disabled={matchPhrase}
          buttonType={ButtonType.Primary}
          onPress={verifyPhrase}>
          {matchPhrase && <ButtonLoading />}
        </Button>
      </View>
    </ScrollView>
  )
}

export default ExportWalletConfirmation