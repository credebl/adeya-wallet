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
  navigation: StackNavigationProp<OrganizationStackParams, Screens.Explore>
}

const OrganizationListItem: React.FC<Props> = ({ organization, navigation }) => {
  const { t } = useTranslation()
  const { TextTheme, ColorPallet, ListItems } = useTheme()

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      width: '100%',
      marginTop: widthPercentageToDP('2%'),
      padding: 5,
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
      width: 30,
      height: 30,
    },
    contactNameContainer: {
      flex: 1,
      paddingVertical: 4,
    },
    labelOrgText: {
      fontSize: 16,
      fontWeight: '600',
      color: ColorPallet.brand.primary,
    },

    labelContainer: {
      flex: 1,
      marginTop: 15,
      marginBottom: 10,
    },
  })
  const navigateToConnection = (name: string, description: string, logoUrl: string, orgSlug: string) => {
    navigation.navigate(Screens.OrganizationDetails, { name, description, logoUrl, orgSlug })
  }
  const organizationLabel = organization?.name
  const organaizationLabelAbbr = organizationLabel?.charAt(0).toUpperCase()

  return (
    <TouchableOpacity
      onPress={() =>
        navigateToConnection(organization.name, organization.description, organization.logoUrl, organization.OrgSlug)
      }
      testID={testIdWithKey('Contact')}
      accessibilityLabel={t('ContactDetails.AContact')}>
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          {organization?.logoUrl ? (
            <View>
              <Image style={styles.avatarOrgImage} source={{ uri: organization?.logoUrl }} />
            </View>
          ) : (
            <Text style={styles.avatarOrgPlaceholder}>{organaizationLabelAbbr}</Text>
          )}
        </View>
        <View style={styles.labelContainer}>
          <View>
            <Text style={styles.labelOrgText} numberOfLines={4} ellipsizeMode={'tail'}>
              {organization?.name}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default OrganizationListItem
