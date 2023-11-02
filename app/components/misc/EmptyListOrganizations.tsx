import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'

import { useTheme } from '../../contexts/theme'

const EmptyListOrganizations: React.FC = () => {
  const { t } = useTranslation()
  const { ColorPallet, TextTheme } = useTheme()
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      height: '100%',
      alignItems: 'center',
      paddingTop: 100,
      alignSelf: 'center',
      backgroundColor: ColorPallet.brand.primaryBackground,
    },
    text: {
      textAlign: 'center',
      paddingTop: 10,
    },
  })

  return (
    <View style={styles.container}>
      {/* <Assets.svg.contactBook fill={ListItems.emptyList.color} height={120} /> */}
      <Text style={[TextTheme.headingThree, styles.text, { paddingTop: 30 }]}>{t('Organizations.EmptyList')}</Text>
      {/* <Text style={[ListItems.emptyList, styles.text]}>{t('Organizations.PeopleAndOrganizations')}</Text> */}
    </View>
  )
}

export default EmptyListOrganizations
