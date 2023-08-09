import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import { useTheme } from '../contexts/theme'
import { Assets } from '../theme'

const Success: React.FC = () => {
  const { TextTheme } = useTheme()
  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      height: '100%',
      flex: 1,
      alignSelf: 'center',
    },
    labeltext: {
      alignSelf: 'center',
      padding: 20,
      fontSize: 20,
      color: '#ffff',
    },
  })
  return (
    <View style={styles.container}>
      <Assets.svg.BackupSuccess height={225} width={230} />
      <Text style={(TextTheme.labelText, styles.labeltext)}>Exported successfully</Text>
    </View>
  )
}

export default Success
