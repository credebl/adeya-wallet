import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { View, StyleSheet, Text } from 'react-native'

import Button, { ButtonType } from '../components/buttons/Button'
import { useTheme } from '../contexts/theme'
import { Screens } from '../types/navigators'

const CreateWallet: React.FC = () => {
  const { TextTheme, ColorPallet } = useTheme()
  const navigation = useNavigation()
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      height: '100%',
    },
    titleText: {
      fontSize: 32,
      fontWeight: '500',
      alignSelf: 'center',
      color: ColorPallet.brand.primary,
      marginTop: 20,
    },
    walletButtonview: {
      marginTop: 'auto',
      margin: 20,
    },
    restoreWalletview: {
      marginTop: 20,
    },
  })
  return (
    <View style={styles.container}>
      <Text style={(TextTheme.headingTwo, styles.titleText)}>Welcome</Text>
      <View style={styles.walletButtonview}>
        <Button
          title={'CREATE NEW WALLET'}
          buttonType={ButtonType.Primary}
          accessibilityLabel={'okay'}
          onPress={() => navigation.navigate(Screens.UseBiometry as never)}
        />
        <View style={styles.restoreWalletview}>
          <Button
            title={'RESTORE WALLET'}
            buttonType={ButtonType.Primary}
            onPress={() => navigation.navigate(Screens.ImportWalletVerify as never)}
            accessibilityLabel={'okay'}
          />
        </View>
      </View>
    </View>
  )
}

export default CreateWallet
