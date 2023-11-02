import React, { PropsWithChildren } from 'react'
import { View, Image } from 'react-native'

import { styles } from '../../HomeContentviewstyle'
import ScanButton from '../common/ScanButton'

const HomeContentView: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <View style={[styles.feedbackContainer]}>
      <View style={[styles.messageContainer]}>
        <Image source={require('../../assets/img/homeimage.png')} style={styles.homeImage} />
      </View>
      {children}
      <View style={{ justifyContent: 'flex-end', marginTop: '50%' }}>
        <ScanButton />
      </View>
    </View>
  )
}

export default HomeContentView
