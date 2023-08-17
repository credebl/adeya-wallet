import { useNavigation } from '@react-navigation/core'
import { generateMnemonic } from 'bip39'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, PixelRatio, Dimensions } from 'react-native'

import Button, { ButtonType } from '../components/buttons/Button'
import { useTheme } from '../contexts/theme'
import { Screens } from '../types/navigators'

const ExportWallet: React.FC = () => {
  const { ColorPallet, TextTheme } = useTheme()
  const navigation = useNavigation()
  const { t } = useTranslation()
  const [phraseData, setPhraseData] = useState<string[]>([])

  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

  const widthBaseScale = SCREEN_WIDTH / 414
  const heightBaseScale = SCREEN_HEIGHT / 896

  const normalize = (size: number, based: 'width' | 'height' = 'width') => {
    const newSize = based === 'height' ? size * heightBaseScale : size * widthBaseScale
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  }
  const widthPixel = (size: number) => normalize(size, 'width')

  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      height: '100%',
      flex: 1,
    },
    subcontainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignSelf: 'center',
      marginTop: 30,
    },
    rowContainerInternalView: {
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
    rowContainerView: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 20,
    },
    mediumTextStyle: {
      fontSize: 18,
      backgroundColor: ColorPallet.brand.primaryBackground,
    },
    textStyle: {
      width: 20,
      textAlign: 'center',
    },
    scrollView: {
      flex: 1,
    },
    containerView: {
      flex: 1,
      alignItems: 'center',
      paddingTop: 10,
    },
    titleText: {
      fontSize: 26,
      marginTop: 15,
      textAlign: 'center',
      color: '#7C7C7C',
    },
    detailText: {
      fontSize: 18,
      marginHorizontal: 30,
      marginTop: 20,
      lineHeight: 20,
      textAlign: 'center',
    },
  })

  useEffect(() => {
    const mnemonic = generateMnemonic(128)
    const mnemonicArray = mnemonic.split(' ')

    const mnemonicIndividualWordsArray: string[] = []
    mnemonicArray.forEach(word => {
      mnemonicIndividualWordsArray.push(word)
    })

    setPhraseData(mnemonicIndividualWordsArray.splice(1, 8))
  }, [])

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <View>
          <Text style={[TextTheme.title, styles.titleText]}>{t('Backup.write_down')}</Text>
          <Text style={[TextTheme.label, styles.detailText]}>{t('Backup.this_is_your_seed')}</Text>
        </View>
      </View>
      <View style={styles.subcontainer}>
        {phraseData.map((item, index) => (
          <TouchableOpacity key={index}>
            <View style={styles.rowContainerView}>
              <View
                style={[
                  styles.rowContainerInternalView,
                  {
                    borderStyle: 'dashed',
                    borderColor: ColorPallet.brand.primary,
                  },
                ]}>
                <Text style={[TextTheme.labelSubtitle, styles.mediumTextStyle]}>{item}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ marginTop: 'auto', margin: 20, alignItems: 'stretch' }}>
        <Button
          title={'Continue'}
          accessibilityLabel={'Okay'}
          buttonType={ButtonType.Primary}
          onPress={() => navigation.navigate(Screens.ExportWalletConfirmation as never)}
        />
      </View>
    </ScrollView>
  )
}

export default ExportWallet
