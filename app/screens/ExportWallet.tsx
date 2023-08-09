import { useNavigation } from '@react-navigation/core'
import { generateMnemonic } from 'bip39'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'

import styles from '../WalletExportstyle'
import Button, { ButtonType } from '../components/buttons/Button'
import { useTheme } from '../contexts/theme'
import { Screens } from '../types/navigators'

const ExportWallet: React.FC = () => {
  const { ColorPallet, TextTheme } = useTheme()
  const navigation = useNavigation()
  const { t } = useTranslation()
  const [phraseData, setPhraseData] = useState([])
  useEffect(() => {
    const mnemonic = generateMnemonic(128)
    const mnemonicArray = mnemonic.split(' ')

    const mnemonicIndividualWordsArray: any = []
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
          onPress={() => navigation.navigate(Screens.ExportWalletConfirmation, { phraseData })}
        />
      </View>
    </ScrollView>
  )
}

export default ExportWallet
