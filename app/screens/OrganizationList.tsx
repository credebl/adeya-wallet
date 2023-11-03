import { StackNavigationProp } from '@react-navigation/stack'
import React, { Fragment, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text, TextInput, Platform, Image, ActivityIndicator, StyleSheet } from 'react-native'

import useOrganizationData from '../api/organizationHelper'
import AlphabetFlatList from '../components/common'
import ScanButton from '../components/common/ScanButton'
import OrganizationListItem from '../components/listItems/OrganizationListItem'
import { useTheme } from '../contexts/theme'
import { OrganizationStackParams, Screens } from '../types/navigators'

import { IContact } from './ContactItem'
interface ListOrganizationProps {
  navigation: StackNavigationProp<OrganizationStackParams, Screens.Explore>
}

interface IOrganization {
  logoUrl: string
  name: string
  description: string
  orgSlug: string
}

const OrganizationList: React.FC<ListOrganizationProps> = ({ navigation }) => {
  const { t } = useTranslation()
  const { ColorPallet } = useTheme()
  const [searchInput, setSearchInput] = useState('')

  const [filteredOrganizations, setFilteredOrganizations] = useState<IOrganization[]>([])
  const PAGE_SIZE = 20
  const { loading, organizationData, loadMore } = useOrganizationData(PAGE_SIZE)
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      height: '100%',
      margin: '2.5%',
    },
    headerTextView: {
      justifyContent: 'center',
      alignSelf: 'center',
    },
    titleText: {
      fontSize: 20,
      fontWeight: '400',
      alignSelf: 'center',
      color: ColorPallet.brand.primary,
      marginTop: '1.5625%',
    },
    headerText: {
      justifyContent: 'center',
      color: ColorPallet.brand.primary,
      fontSize: 18,
      fontWeight: '600',
      marginTop: 20,
    },
    inputText: {
      width: '100%',
    },
    Separator: {
      backgroundColor: ColorPallet.brand.primaryBackground,
      height: 1,
      marginHorizontal: '4%',
    },
    searchBarView: {
      alignSelf: 'center',
      borderWidth: 1,
      width: '95%',
      flexDirection: 'row',
      height: Platform.OS === 'ios' ? 30 : 40,
      borderRadius: 5,
      marginTop: 40,
      borderColor: ColorPallet.brand.primary,
      backgroundColor: ColorPallet.brand.tabsearchBackground,
    },
    listView: {
      marginTop: 0,
      width: '100%',
      height: 'auto',
    },
    selectedLetter: {
      borderWidth: 1,
      width: 20,
      borderRadius: 10,
      backgroundColor: ColorPallet.brand.highlightedEclipse,
      color: ColorPallet.grayscale.white,
    },
    orgLabelTextactive: {
      alignSelf: 'center',
      paddingBottom: 2,
      color: ColorPallet.grayscale.white,
    },
    orgLabelText: {
      color: ColorPallet.brand.primary,
    },
    alphabetView: {
      marginLeft: 20,
      borderWidth: 1,
      height: '100%',
      borderRadius: 5,
      borderColor: ColorPallet.brand.modalOrgBackground,
      backgroundColor: ColorPallet.brand.modalOrgBackground,
      position: 'relative',
    },
    alphabetLetter: {
      position: 'relative',
    },
    highlightedLetter: {
      position: 'absolute',
      backgroundColor: ColorPallet.brand.highlightedEclipse,
      borderRadius: Platform.OS === 'ios' ? 15 : 10,
      alignItems: 'center',
      justifyContent: 'center',
      width: 20,
      height: 20,
    },
    highlightedText: {
      color: 'white',
    },
    inputView: {
      marginHorizontal: 4,
      marginTop: Platform.OS === 'ios' ? 5 : 0,
    },
    searchIcon: { marginTop: 5 },
  })

  useEffect(() => {
    return setFilteredOrganizations(
      organizationData?.organizations.filter(org => {
        if (searchInput) {
          const orgName = org?.name.toLowerCase()
          return orgName.includes(searchInput.toLowerCase())
        }
        return true
      }),
    )
  }, [searchInput, organizationData])
  const handleSearchInputChange = (text: string) => {
    setSearchInput(text)
  }

  const items: IContact[] = filteredOrganizations?.map((item, index) => ({
    id: index,
    logoUrl: item.logoUrl,
    name: item.name,
    description: item.description,
    OrgSlug: item.orgSlug,
  }))

  const data: { [key: string]: IContact[] } = {}

  for (let letter = 'A'.charCodeAt(0); letter <= 'Z'.charCodeAt(0); letter++) {
    const initialLetter = String.fromCharCode(letter)
    data[initialLetter] = items?.filter(item => item?.name.charAt(0) === initialLetter)
  }
  const HEADER_HEIGHT = 50

  return (
    <View style={styles.container}>
      <View style={styles.headerTextView}>
        <Text style={styles.titleText}>{t('Organizations.Title')}</Text>
      </View>

      <View style={styles.searchBarView}>
        <Image source={require('../assets/img/search.png')} style={styles.searchIcon} />
        <TextInput
          scrollEnabled={false}
          style={styles.inputView}
          placeholder="Search..."
          value={searchInput}
          onChangeText={text => handleSearchInputChange(text)}
        />
      </View>
      {loading ? (
        <View style={{ justifyContent: 'center', flex: 1 }}>
          <ActivityIndicator style={{ width: 'auto' }} />
        </View>
      ) : (
        <Fragment>
          <AlphabetFlatList
            data={data}
            itemHeight={70}
            onEndReached={loadMore}
            onEndReachedThreshold={0.1}
            headerHeight={HEADER_HEIGHT}
            renderItem={({ item: organizations }) => (
              <OrganizationListItem organization={organizations} navigation={navigation} />
            )}
            ListFooterComponent={() => {
              return loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <ActivityIndicator size="large" />
                </View>
              ) : null
            }}
          />
        </Fragment>
      )}
      <View />
      <ScanButton />
    </View>
  )
}

export default OrganizationList
