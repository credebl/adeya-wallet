import { useNavigation } from '@react-navigation/core'
import React, { useRef, useState } from 'react'
import { View, Text, TextInput, FlatList, Animated, PanResponder, Platform } from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'

import ScanButton from '../components/common/ScanButton'
import OrganizationListItem from '../components/listItems/OrganizationListItem'
import EmptyListOrganizations from '../components/misc/EmptyListOrganizations'
import { useTheme } from '../contexts/theme'

const OrganizationList: React.FC = () => {
  const [selectedLetter, setSelectedLetter] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [draggedLetter, setDraggedLetter] = useState('')

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
    {
      id: 7,
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
    {
      id: 8,
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
    {
      id: 9,
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
    {
      id: 10,
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
    {
      id: 11,
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
    {
      id: 12,
      createDateTime: '2023-10-06T06:07:46.443Z',
      createdBy: 1,
      lastChangedDateTime: '2023-10-06T06:07:46.443Z',
      lastChangedBy: 1,
      name: 'Corporation',
      description: 'Globex Tech',
      orgSlug: 'globex-tech-pvt-ltd',
      logoUrl: '',
      website: '',
      publicProfile: true,
    },
    {
      id: 13,
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
    {
      id: 14,
      createDateTime: '2023-10-06T06:07:46.443Z',
      createdBy: 1,
      lastChangedDateTime: '2023-10-06T06:07:46.443Z',
      lastChangedBy: 1,
      name: 'loco Corporation',
      description: 'Globex Tech',
      orgSlug: 'globex-tech-pvt-ltd',
      logoUrl: '',
      website: '',
      publicProfile: true,
    },
    {
      id: 15,
      createDateTime: '2023-10-06T06:07:46.443Z',
      createdBy: 1,
      lastChangedDateTime: '2023-10-06T06:07:46.443Z',
      lastChangedBy: 1,
      name: 'Umbrella technology',
      description: 'Globex Tech',
      orgSlug: 'globex-tech-pvt-ltd',
      logoUrl: '',
      website: '',
      publicProfile: true,
    },
    {
      id: 16,
      createDateTime: '2023-10-06T06:07:46.443Z',
      createdBy: 1,
      lastChangedDateTime: '2023-10-06T06:07:46.443Z',
      lastChangedBy: 1,
      name: 'Iconic Solutions',
      description: 'Globex Tech',
      orgSlug: 'globex-tech-pvt-ltd',
      logoUrl: '',
      website: '',
      publicProfile: true,
    },
    {
      id: 17,
      createDateTime: '2023-10-06T06:07:46.443Z',
      createdBy: 1,
      lastChangedDateTime: '2023-10-06T06:07:46.443Z',
      lastChangedBy: 1,
      name: 'Iconic Corporation',
      description: 'Globex Tech',
      orgSlug: 'globex-tech-pvt-ltd',
      logoUrl: '',
      website: '',
      publicProfile: true,
    },
  ]
  const { ColorPallet } = useTheme()
  const navigation = useNavigation()

  const styles = ScaledSheet.create({
    container: {
      flex: 1,
      height: '100%',
      margin: '2.5%',
    },
    headerTextView: {
      justifyContent: 'center',
      marginHorizontal: '10%',
      alignSelf: 'center',
    },
    titleText: {
      fontSize: 18,
      fontWeight: '400',
      alignSelf: 'center',
      color: ColorPallet.brand.primary,
      marginTop: '1.5625%',
    },
    headerText: {
      justifyContent: 'center',
      color: ColorPallet.brand.primary,
      fontSize: 20,
      fontWeight: '700',
      marginTop: '1.953125%',
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
      height: Platform.OS === 'ios' ? 30 : 40,
      borderRadius: 5,
      marginTop: 5,
      borderColor: ColorPallet.brand.primary,
      backgroundColor: ColorPallet.grayscale.lightGrey,
    },
    listView: {
      marginTop: 0,
      width: '100%',
      height: 'auto',
    },
    selectedLetter: {
      borderWidth: 1,
      width: 20,
      borderRadius: Platform.OS === 'ios' ? 10 : 10,
      backgroundColor: '#012048',
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
      borderColor: '#E1EAFF',
      backgroundColor: '#E1EAFF',
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
  const alphabet: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
  organizations.sort((a, b) => a.name.localeCompare(b.name))
  const handleSearchInputChange = (text: string) => {
    setSearchInput(text)
  }

  const handleSelected = (letter: string) => {
    setDraggedLetter(letter)
    setSelectedLetter(letter)
  }
  const panResponder = (letter: string) =>
    useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,

        onPanResponderGrant: () => {},
        onPanResponderMove: (evt, gestureState) => {
          if (gestureState.moveX > 0 && gestureState.moveY > 0) {
            handleSelected(letter)
          }
        },
        onPanResponderTerminationRequest: () => true,

        onPanResponderRelease: () => {
          setDraggedLetter('')
        },
      }),
    ).current
  return (
    <View style={styles.container}>
      <View style={styles.headerTextView}>
        <Text style={styles.titleText}>Select an organization to discover what credentials you can obtain.</Text>
      </View>
      <Text style={styles.headerText}>Organizations list</Text>

      <View style={styles.searchBarView}>
        <TextInput
          scrollEnabled={false}
          style={{ marginHorizontal: 4, marginTop: Platform.OS === 'ios' ? 5 : 0 }}
          placeholder="Search..."
          value={searchInput}
          onChangeText={text => handleSearchInputChange(text)}
        />
      </View>
      <View style={[styles.listView, { flexDirection: 'row', paddingRight: 'auto' }]}>
        <FlatList
          data={filteredOrganizations}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          SeparatorComponent={() => <View style={styles.Separator} />}
          keyExtractor={organizations => organizations.id}
          renderItem={({ item: organizations }) => (
            <OrganizationListItem organization={organizations} navigation={navigation} />
          )}
          ListEmptyComponent={() => <EmptyListOrganizations navigation={navigation} />}
        />
        <Animated.View style={styles.alphabetView}>
          {alphabet.map(item => (
            <Text
              {...panResponder(item).panHandlers}
              style={[
                {
                  ...(selectedLetter === item
                    ? { ...styles.selectedLetter, backgroundColor: draggedLetter === item ? 'red' : '#012048' }
                    : {}),
                },
              ]}>
              {item}
            </Text>
          ))}
        </Animated.View>
      </View>
      <View />
      <ScanButton />
    </View>
  )
}

export default OrganizationList
