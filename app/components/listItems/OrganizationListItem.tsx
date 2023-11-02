import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native'
import { widthPercentageToDP } from 'react-native-responsive-screen'

import { useTheme } from '../../contexts/theme'
import { OrganizationStackParams, Screens } from '../../types/navigators'
import { testIdWithKey } from '../../utils/testable'

interface Props {
  organization: any
  navigation: StackNavigationProp<OrganizationStackParams, Screens.Organizations>
}

const OrganizationListItem: React.FC<Props> = ({ organization, navigation }) => {
  const { t } = useTranslation()
  const { TextTheme, ColorPallet, ListItems } = useTheme()

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      padding: widthPercentageToDP('5%'),
    },
    avatarContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 50,
      height: 50,
      borderRadius: 25,
      borderColor: ListItems.avatarCircle.borderColor,
      borderWidth: 1,
      marginRight: 16,
    },
    avatarOrgPlaceholder: {
      ...TextTheme.headingFour,
      textAlign: 'center',
    },
    avatarOrgImage: {
      width: 50,
      height: 50,
    },
    labelOrgText: {
      fontSize: 16,
      fontWeight: '600',
      color: ColorPallet.brand.primary,
    },
    borderView: {
      borderWidth: 0.8,
      borderColor: '#A3C1EE',
      marginHorizontal: 20,
    },
    labelContainer: {
      flex: 1,
      marginTop: 15,
    },
  })

  // const organaizationLabel = useMemo(() => organization.name || organization.name, [organization])
  // const organaizationLabelAbbr = useMemo(() => organaizationLabel?.charAt(0).toUpperCase(), [organization])
  const navigateToConnection = () => {
    navigation.navigate(Screens.OrganizationsConnection as never)
  }
  return (
    <TouchableOpacity
      onPress={navigateToConnection}
      testID={testIdWithKey('Contact')}
      accessibilityLabel={t('ContactDetails.AContact')}>
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          {/* {organization.logoUrl ? ( */}
          <View>
            {/* <Image style={styles.avatarImage} source={{ uri: organization.logoUrl }} /> */}
            <Image style={styles.avatarOrgImage} source={require('../../assets/img/image.png')} />
          </View>
          {/* ) : (
            <Text style={styles.avatarOrgPlaceholder}>{organaizationLabelAbbr}</Text> */}
          {/* )} */}
        </View>
        <View style={styles.labelContainer}>
          <View>
            <Text style={styles.labelOrgText} numberOfLines={1} ellipsizeMode={'tail'}>
              {organization.name}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.borderView} />
    </TouchableOpacity>
  )
}

export default OrganizationListItem
