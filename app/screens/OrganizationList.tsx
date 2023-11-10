import { StackNavigationProp } from '@react-navigation/stack'
import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text, TextInput, Image, ActivityIndicator, StyleSheet, Pressable, FlatList } from 'react-native'

import useOrganizationData from '../api/organizationHelper'
import ScanButton from '../components/common/ScanButton'
import OrganizationListItem from '../components/listItems/OrganizationListItem'
import EmptyListOrganizations from '../components/misc/EmptyListOrganizations'
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

const OrganizationList: React.FC<ListOrganizationProps> = ({ navigation }) => {
  const { t } = useTranslation()
  const { ColorPallet } = useTheme()
  const [searchInput, setSearchInput] = useState('')

  const { loading, organizationData, loadMore } = useOrganizationData(searchInput)
  const inputRef = useRef<TextInput>(null)

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      height: '100%',
      padding: '2.5%',
      backgroundColor: ColorPallet.brand.secondaryBackground,
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
      alignItems: 'center',
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
    itemSeparator: {
      backgroundColor: ColorPallet.brand.primaryBackground,
      height: 1,
      marginHorizontal: 16,
    },
  })

  const handleSearchInputChange = (text: string) => {
    setSearchInput(text)
  }

  const items = organizationData.organizations?.map((item, index) => ({
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
      <FlatList
        data={items}
        keyboardShouldPersistTaps="handled"
        onEndReached={loadMore}
        renderItem={({ item: organization }) => (
          <OrganizationListItem key={organization?.id} organization={organization} navigation={navigation} />
        )}
        keyExtractor={item => item.id.toString()}
        ListFooterComponent={
          loading ? (
            <View style={styles.loader}>
              <ActivityIndicator size="large" />
            </View>
          ) : null
        }
        onEndReachedThreshold={0.2}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        ListEmptyComponent={!loading ? () => <EmptyListOrganizations /> : null}
      />
      <View style={styles.scanContainer}>
        <ScanButton />
      </View>
    </View>
  )
}

export default OrganizationList
