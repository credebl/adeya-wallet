import { StackNavigationProp } from '@react-navigation/stack'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text, TextInput, Platform, Image, ActivityIndicator, StyleSheet, Pressable } from 'react-native'

import useOrganizationData from '../api/organizationHelper'
import AlphabetFlatList from '../components/common'
import ScanButton from '../components/common/ScanButton'
import OrganizationListItem from '../components/listItems/OrganizationListItem'
import { useTheme } from '../contexts/theme'
import { OrganizationStackParams, Screens } from '../types/navigators'

interface ListOrganizationProps {
  navigation: StackNavigationProp<OrganizationStackParams, Screens.Explore>
}

interface Organization {
  logoUrl: string
  name: string
  description: string
  orgSlug: string
}

const HEADER_HEIGHT = 20

const OrganizationList: React.FC<ListOrganizationProps> = ({ navigation }) => {
  const { t } = useTranslation()
  const { ColorPallet } = useTheme()
  const [searchInput, setSearchInput] = useState('')

  const [filteredOrganizations, setFilteredOrganizations] = useState<Organization[]>([])

  const { loading, organizationData, loadMore } = useOrganizationData()
  const inputRef = useRef<TextInput>(null)

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
      height: 40,
      borderRadius: 5,
      marginTop: 20,
      marginBottom: 10,
      borderColor: ColorPallet.brand.primary,
      backgroundColor: ColorPallet.brand.tabsearchBackground,
      alignItems: 'center',
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
    },
    searchIcon: {
      marginLeft: 5,
    },
    loader: {
      justifyContent: 'center',
      flex: 1,
    },
    scanContainer: {
      position: 'absolute',
      bottom: 10,
      right: 10,
    },
  })

  useMemo(() => {
    if (searchInput) return
    setFilteredOrganizations(organizationData?.organizations)
  }, [organizationData])

  useEffect(() => {
    setFilteredOrganizations(organizationData?.organizations)
  }, [organizationData])

  const handleSearchInputChange = (text: string) => {
    setSearchInput(text)

    if (!text) {
      setFilteredOrganizations(organizationData?.organizations)
      return
    }

    const filterList = organizationData?.organizations.filter(org => {
      const orgName = org?.name.toLowerCase()
      return orgName.includes(searchInput.toLowerCase())
    })
    setFilteredOrganizations(filterList)
  }

  const items = filteredOrganizations?.map((item, index) => ({
    id: index,
    logoUrl: item.logoUrl,
    name: item.name,
    description: item.description,
    orgSlug: item.orgSlug,
  }))

  const data: { [key: string]: Organization[] } = {}

  for (let letter = 'A'.charCodeAt(0); letter <= 'Z'.charCodeAt(0); letter++) {
    const initialLetter = String.fromCharCode(letter)
    data[initialLetter] = items?.filter(item => item?.name.charAt(0) === initialLetter)
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerTextView}>
        <Text style={styles.titleText}>{t('Organizations.Title')}</Text>
      </View>

      <Pressable style={styles.searchBarView} onPress={() => inputRef?.current?.focus()}>
        <Image source={require('../assets/img/search.png')} style={styles.searchIcon} />
        <TextInput
          ref={inputRef}
          scrollEnabled={false}
          style={styles.inputView}
          placeholder="Search"
          value={searchInput}
          onChangeText={handleSearchInputChange}
        />
      </Pressable>
      <AlphabetFlatList
        data={data}
        itemHeight={70}
        onEndReached={loadMore}
        headerHeight={HEADER_HEIGHT}
        renderItem={({ item: organization }) => (
          <OrganizationListItem key={organization?.id} organization={organization} navigation={navigation} />
        )}
        ListFooterComponent={
          loading ? (
            <View style={styles.loader}>
              <ActivityIndicator size="large" />
            </View>
          ) : null
        }
      />
      <View style={styles.scanContainer}>
        <ScanButton />
      </View>
    </View>
  )
}

export default OrganizationList
