import { useNavigation } from '@react-navigation/core'
import React, { useState } from 'react'
import { View, StyleSheet, Text, TextInput, FlatList, TouchableOpacity } from 'react-native'

import OrganizationListItem from '../components/listItems/OrganizationListItem'
import EmptyListOrganizations from '../components/misc/EmptyListOrganizations'
import { useTheme } from '../contexts/theme'
const OrganizationList: React.FC = () => {
  const [selectedLetter, setSelectedLetter] = useState('')
  const [active, setactive] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const organizations = [
    {
      id: 2,
      createDateTime: '2023-10-06T06:07:46.443Z',
      createdBy: 1,
      lastChangedDateTime: '2023-10-06T06:07:46.443Z',
      lastChangedBy: 1,
      name: 'Globex Tech pvt ltd',
      description: 'Globex Tech',
      orgSlug: 'globex-tech-pvt-ltd',
      logoUrl: '',
      website: '',
      publicProfile: true,
    },
    {
      id: 3,
      createDateTime: '2023-10-06T06:07:46.443Z',
      createdBy: 1,
      lastChangedDateTime: '2023-10-06T06:07:46.443Z',
      lastChangedBy: 1,
      name: 'Globex Tech pvt ltd',
      description: 'Globex Corporation',
      orgSlug: 'globex-tech-pvt-ltd',
      logoUrl: '',
      website: '',
      publicProfile: true,
    },
    {
      id: 4,
      createDateTime: '2023-10-06T06:07:46.443Z',
      createdBy: 1,
      lastChangedDateTime: '2023-10-06T06:07:46.443Z',
      lastChangedBy: 1,
      name: 'Genco Pura Olive Oil Company',
      description: 'Globex Tech',
      orgSlug: 'globex-tech-pvt-ltd',
      logoUrl: '',
      website: '',
      publicProfile: true,
    },
    {
      id: 5,
      createDateTime: '2023-10-06T06:07:46.443Z',
      createdBy: 1,
      lastChangedDateTime: '2023-10-06T06:07:46.443Z',
      lastChangedBy: 1,
      name: 'Initech (Office Space)',
      description: 'Veridian Dynamics',
      orgSlug: 'globex-tech-pvt-ltd',
      logoUrl: '',
      website: '',
      publicProfile: true,
    },
    {
      id: 6,
      createDateTime: '2023-10-06T06:07:46.443Z',
      createdBy: 1,
      lastChangedDateTime: '2023-10-06T06:07:46.443Z',
      lastChangedBy: 1,
      name: 'Umbrella Corporation',
      description: 'Globex Tech',
      orgSlug: 'globex-tech-pvt-ltd',
      logoUrl: '',
      website: '',
      publicProfile: true,
    },
  ]
  const { ColorPallet } = useTheme()
  const navigation = useNavigation()

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      height: '100%',
      margin: 20,
    },
    headerTextView: {
      justifyContent: 'center',
      marginHorizontal: 40,
      alignSelf: 'center',
    },
    titleText: {
      fontSize: 20,
      fontWeight: '400',
      alignSelf: 'center',
      color: ColorPallet.brand.primary,
      marginTop: 5,
    },
    headerText: {
      justifyContent: 'center',
      color: ColorPallet.brand.primary,
      fontSize: 22,
      fontWeight: '700',
      marginTop: 10,
    },
    inputText: {
      width: '100%',
    },
    Separator: {
      backgroundColor: ColorPallet.brand.primaryBackground,
      height: 1,
      marginHorizontal: 16,
    },
    searchBarView: {
      alignSelf: 'center',
      borderWidth: 1,
      width: '95%',
      borderRadius: 10,
      marginTop: 5,
      borderColor: ColorPallet.brand.primary,
      backgroundColor: ColorPallet.brand.primaryBackground,
    },
    listView: {
      marginTop: 0,
      width: '170%',
      height: 'auto',
    },
    selectedLetter: {
      marginTop: 20,
      borderWidth: 1,
      width: 20,
      borderRadius: 10,
      backgroundColor: '#012048',
    },
    orgConatiner: {
      marginTop: 20,
    },
    orgLabelTextactive: {
      alignSelf: 'center',
      paddingBottom: 2,
      color: ColorPallet.grayscale.white,
    },
    orgLabelText: {
      color: ColorPallet.brand.primary,
    },
  })
  const filteredOrganizations = organizations.filter(org => {
    const firstLetter = org.name.charAt(0).toUpperCase()
    if (selectedLetter && firstLetter !== selectedLetter) {
      return false
    }
    if (searchInput) {
      const orgName = org.name.toLowerCase()
      return orgName.includes(searchInput.toLowerCase())
    }
    return true
  })
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
  organizations.sort((a, b) => a.name.localeCompare(b.name))
  const handleSelected = item => {
    setSelectedLetter(item)
    setactive(true)
  }
  const handleSearchInputChange = text => {
    setSearchInput(text)
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerTextView}>
        <Text style={styles.titleText}>Select an organization to discover what credentials you can obtain.</Text>
      </View>
      <Text style={styles.headerText}>Organizations list</Text>

      <View style={styles.searchBarView}>
        <TextInput
          style={{ marginHorizontal: 4 }}
          placeholder="Search..."
          value={searchInput}
          onChangeText={text => handleSearchInputChange(text)}
        />
      </View>
      <View style={[styles.listView, { flexDirection: 'row' }]}>
        <FlatList
          data={filteredOrganizations}
          SeparatorComponent={() => <View style={styles.Separator} />}
          keyExtractor={organizations => organizations.id}
          renderItem={({ item: organizations }) => (
            <OrganizationListItem organization={organizations} navigation={navigation} />
          )}
          ListEmptyComponent={() => <EmptyListOrganizations navigation={navigation} />}
        />
        <FlatList
          data={active ? selectedLetter : alphabet}
          keyExtractor={item => item}
          horizontal={false}
          style={{ width: 1 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSelected(item)}
              style={active ? styles.selectedLetter : styles.orgConatiner}>
              <Text style={active ? styles.orgLabelTextactive : styles.orgLabelText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  )
}

export default OrganizationList
