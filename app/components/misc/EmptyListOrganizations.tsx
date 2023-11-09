import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'

import { useTheme } from '../../contexts/theme'

const EmptyListOrganizations: React.FC = () => {
  const { t } = useTranslation()
  const { TextTheme } = useTheme()
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      height: '100%',
      alignItems: 'center',
      paddingTop: 50,
      alignSelf: 'center',
    },
    text: {
      textAlign: 'center',
      paddingTop: 10,
    },
  })

  return (
    <View style={styles.container}>
      <Text style={[TextTheme.headingThree, styles.text]}>{t('Organizations.EmptyList')}</Text>
    </View>
  )
}

export default EmptyListOrganizations
