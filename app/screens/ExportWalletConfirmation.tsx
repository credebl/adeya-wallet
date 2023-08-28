import { useAgent } from '@aries-framework/react-hooks'
import { useNavigation, useRoute } from '@react-navigation/core'
import { shuffle } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  PermissionsAndroid,
  Platform,
  Share,
  Dimensions,
  PixelRatio,
  StyleSheet,
} from 'react-native'
import { exists, mkdir, unlink } from 'react-native-fs'
import Toast from 'react-native-toast-message'
import { zip } from 'react-native-zip-archive'
import RNFetchBlob from 'rn-fetch-blob'

import ButtonLoading from '../components/animated/ButtonLoading'
import Button, { ButtonType } from '../components/buttons/Button'
import { ToastType } from '../components/toast/BaseToast'
import { useTheme } from '../contexts/theme'
import { Screens } from '../types/navigators'

function ExportWalletConfirmation() {
  const { agent } = useAgent()
  const navigation = useNavigation()
  const parms = useRoute()
  const { t } = useTranslation()
  const [phraseData, setPhraseData] = useState<string[]>([])
  const [arraySetPhraseData, setArraySetPhraseData] = useState<string[]>([])
  const [nextPhraseIndex, setNextPhraseIndex] = useState(0)
  const [matchPhrase, setMatchPhrase] = useState(false)
  const { ColorPallet, TextTheme } = useTheme()
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')
  const { width } = Dimensions.get('window')
  const widthBaseScale = SCREEN_WIDTH / 414
  const heightBaseScale = SCREEN_HEIGHT / 896

  const normalize = (size: number, based: 'width' | 'height' = 'width') => {
    const newSize = based === 'height' ? size * heightBaseScale : size * widthBaseScale
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  }
  const widthPixel = (size: number) => normalize(size, 'width')
  const heightPixel = (size: number) => normalize(size, 'height')

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'space-around',
      height: '100%',
    },
    scrollview: {
      flex: 1,
    },
    titleText: {
      fontSize: 26,
      marginTop: 15,
      textAlign: 'center',
      color: ColorPallet.brand.labelText,
    },
    detailText: {
      fontSize: 18,
      marginHorizontal: 30,
      marginTop: 20,
      lineHeight: 20,
      textAlign: 'center',
      color: ColorPallet.brand.primary,
    },
    successText: {
      fontSize: 14,
    },
    successView: { justifyContent: 'center', alignItems: 'center' },
    setPhraseView: {
      width: width - 60,
    },
    addPhraseView: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
      marginTop: heightPixel(50),
    },
    rowAddItemContainerView: {
      width: widthPixel(150),
      marginVertical: 10,
      padding: 7,
      justifyContent: 'center',
      alignItems: 'center',
    },
    rowAddItemText: {
      fontSize: 20,
      color: ColorPallet.grayscale.black,
    },
    rowItemIndexText: {
      width: 20,
      textAlign: 'center',
    },
    rowItemPhraseText: {
      fontSize: 20,
    },
    rowItemContainerView: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 20,
    },
    rowAItemContainerView: {
      flexDirection: 'row',
      width: widthPixel(150),
      margin: 10,
      padding: 7,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5,
      borderWidth: 1.3,
      backgroundColor: ColorPallet.brand.primaryBackground,
    },
    backupButton: {
      margin: 20,
    },
  })

  // useEffect(() => {
  //   const updatedArraySetPhraseData = Array(parms?.params?.phraseData.length).fill('')
  //   setArraySetPhraseData(updatedArraySetPhraseData)
  // }, [])

  useEffect(() => {
    const shuffledPhraseData: string[] = shuffle(parms?.params?.phraseData)
    setPhraseData(shuffledPhraseData)
    setArraySetPhraseData(Array(shuffledPhraseData.length).fill(''))
  }, [])
  const exportWallet = async (seed: string) => {
    setMatchPhrase(true)
    const encodeHash = seed.replaceAll(',', ' ')

    try {
      const { fs } = RNFetchBlob
      const documentDirectory: string = fs.dirs.DownloadDir
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
      navigation.navigate(Screens.Success, { encryptedFileLocation })
    } catch (e) {
      Toast.show({
        type: ToastType.Error,
        text1: 'Backup failed',
      })
    }
  }
  const exportWalletIOS = async (seed: string) => {
    setMatchPhrase(true)
    const encodeHash = seed.replaceAll(',', ' ')
    const { fs } = RNFetchBlob
    try {
      const documentDirectory: string = fs.dirs.DocumentDir

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

  const addPhrase = (item: string) => {
    const updatedPhraseData = [...phraseData]
    updatedPhraseData[nextPhraseIndex] = item
    const updatedArraySetPhraseData = [...arraySetPhraseData]
    updatedArraySetPhraseData[nextPhraseIndex] = item

    setArraySetPhraseData(updatedArraySetPhraseData)

    setNextPhraseIndex(nextPhraseIndex + 1) // Increment nextPhraseIndex
  }

  const setPhrase = (item: string, index: number) => {
    const updatedArraySetPhraseData = [...arraySetPhraseData]
    updatedArraySetPhraseData[index] = ''
    setArraySetPhraseData(updatedArraySetPhraseData)
    setNextPhraseIndex(index)
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
    const displayedPassphrase = parms?.params?.phraseData.map(item => item).join(',')
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
          {arraySetPhraseData?.map((item, index) => (
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
          {phraseData.map((item, index) => (
            <TouchableOpacity
              disabled={matchPhrase}
              onPress={() => addPhrase(item)}
              style={[styles.rowAddItemContainerView]}
              key={index}>
              <View>
                <Text style={[styles.rowAddItemText]}>{item}</Text>
              </View>
            </TouchableOpacity>
          ))}

          {/* {phraseData?.map((item, index) => (
            <TouchableOpacity
              disabled={matchPhrase}
              onPress={() => addPhrase(item, index)}
              style={[styles.rowAddItemContainerView]}
              key={index}>
              <View>
                <Text style={[styles.rowAddItemText]}>{item}</Text>
              </View>
            </TouchableOpacity>
          ))} */}
        </View>
      </ScrollView>

      <View style={styles.backupButton}>
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
