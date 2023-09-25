import React, { PropsWithChildren } from 'react'
import { View, Image } from 'react-native'

import { styles } from '../../HomeContentviewstyle'

const HomeContentView: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <View style={[styles.feedbackContainer]}>
      <View style={[styles.messageContainer]}>
        <Image source={require('../../assets/img/homeimage.png')} style={styles.homeImage} />
      </View>
      {children}
    </View>
  )
}

export default HomeContentView
