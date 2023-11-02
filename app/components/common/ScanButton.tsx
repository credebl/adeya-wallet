import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native'

import { useNetwork } from '../../contexts/network'
import { Screens } from '../../types/navigators'

const ScanButton: React.FC = () => {
  const navigation = useNavigation()
  const { assertConnectedNetwork } = useNetwork()
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 'auto',
      alignItems: 'baseline',
    },
    imageContainer: {
      width: 81,
      height: 81,
    },
  })
  const navigateToconnect = () => {
    if (!assertConnectedNetwork()) {
      return
    }
    navigation.navigate(Screens.Scan as never)
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={navigateToconnect}>
        <Image style={styles.imageContainer} source={require('../../assets/img/Scanbutton.png')} />
      </TouchableOpacity>
    </View>
  )
}

export default ScanButton
