import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native'

import { Screens } from '../../types/navigators'

const ScanButton: React.FC<Props> = () => {
  const navigation = useNavigation()
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

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate(Screens.Scan as never)}>
        <Image style={styles.imageContainer} source={require('../../assets/img/Scanbutton.png')} />
      </TouchableOpacity>
    </View>
  )
}

export default ScanButton
