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
    titletext: {
      fontSize: 45,
      fontWeight: 'bold',
      alignSelf: 'center',
      color: ColorPallet.brand.primary,
    },
    subcontainer: {},
  })
  return (
    <View style={styles.container}>
      <Text style={(TextTheme.headingTwo, styles.titletext)}>Welcome</Text>
      <View style={{ marginTop: 'auto', margin: 20 }}>
        <Button
          title={'CREATE NEW WALLET'}
          buttonType={ButtonType.Primary}
          accessibilityLabel={'okay'}
          onPress={() => navigation.navigate(Screens.UseBiometry as never)}
        />
        <View style={{ marginTop: 20 }}>
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
