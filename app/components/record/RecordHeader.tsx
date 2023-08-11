import React, { PropsWithChildren } from 'react'
import { StyleSheet, View } from 'react-native'

import { useTheme } from '../../contexts/theme'

const RecordHeader: React.FC<PropsWithChildren> = ({ children }) => {
  const { ColorPallet } = useTheme()
  const styles = StyleSheet.create({
    container: {
      backgroundColor: ColorPallet.brand.primaryBackground,
    },
  })

  return <View style={styles.container}>{children}</View>
}

export default RecordHeader
