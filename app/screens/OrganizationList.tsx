import { StackNavigationProp } from '@react-navigation/stack'
import React, { Fragment, useEffect, useState } from 'react'
import { View, Text, TextInput, Platform, Image, ActivityIndicator } from 'react-native'
import { ScaledSheet } from 'react-native-size-matters'
import Toast from 'react-native-toast-message'

import AlphabetFlatList from '../components/common'
import ScanButton from '../components/common/ScanButton'
import OrganizationListItem from '../components/listItems/OrganizationListItem'
import { ToastType } from '../components/toast/BaseToast'
import { useTheme } from '../contexts/theme'
import { OrganizationStackParams, Screens } from '../types/navigators'
import { fetchOrganizationData } from '../utils/Organization'

import { IContact } from './ContactItem'

interface Organization {
  id: number
  createDateTime: string
  createdBy: number
  lastChangedDateTime: string
  lastChangedBy: number
  name: string
  description: string
  orgSlug: string
  logoUrl: string
  website: string
  publicProfile: boolean
}

interface OrganizationData {
  organizations: Organization[]
}

interface ListOrganizationProps {
  navigation: StackNavigationProp<OrganizationStackParams, Screens.Organizations>
}

const OrganizationList: React.FC<ListOrganizationProps> = ({ navigation }) => {
  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [orgnizationdata, setorgnizationdata] = useState<OrganizationData>({ organizations: [] })
  const { ColorPallet } = useTheme()

  const styles = ScaledSheet.create({
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
      marginTop: 5,
      borderColor: ColorPallet.brand.primary,
      backgroundColor: '#B1B1B1',
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
      position: 'relative',
    },
    alphabetLetter: {
      position: 'relative',
    },
    highlightedLetter: {
      position: 'absolute',
      backgroundColor: '#012048',
      borderRadius: Platform.OS === 'ios' ? 15 : 10,
      alignItems: 'center',
      justifyContent: 'center',
      width: 20,
      height: 20,
    },
    highlightedText: {
      color: 'white',
    },
  })
  const fetchData = async () => {
    try {
      const response = await fetchOrganizationData()
      setorgnizationdata(response?.data)
    } catch (error) {
      Toast.show({
        type: ToastType.Error,
        text1: 'Error fetching organization data',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredOrganizations = orgnizationdata.organizations.filter(org => {
    if (searchInput) {
      const orgName = org.name.toLowerCase()
      return orgName.includes(searchInput.toLowerCase())
    }
    return true
  })
  const handleSearchInputChange = (text: string) => {
    setSearchInput(text)
  }
  const items: IContact[] = filteredOrganizations.map((item, index) => ({
    id: index,
    logoUrl: item.logoUrl,
    name: item.name,
    description: item.description,
    OrgSlug: item.orgSlug,
  }))

  const data: { [key: string]: IContact[] } = {}

  for (let letter = 'A'.charCodeAt(0); letter <= 'Z'.charCodeAt(0); letter++) {
    const initialLetter = String.fromCharCode(letter)
    data[initialLetter] = items.filter(item => item.name.charAt(0) === initialLetter)
  }
  const HEADER_HEIGHT = 50

  return (
    <View style={styles.container}>
      <View style={styles.headerTextView}>
        <Text style={styles.titleText}>Select an organization to get credentials</Text>
      </View>
      <Text style={styles.headerText}>Organizations list</Text>

      <View style={styles.searchBarView}>
        <Image source={require('../assets/img/search.png')} style={{ margin: 2 }} />
        <TextInput
          scrollEnabled={false}
          style={{ marginHorizontal: 4, marginTop: Platform.OS === 'ios' ? 5 : 0 }}
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
            headerHeight={HEADER_HEIGHT}
            renderItem={({ item: organizations }) => (
              <OrganizationListItem organization={organizations} navigation={navigation} />
            )}
          />
        </Fragment>
      )}
      <View />
      <ScanButton />
    </View>
  )
}

export default OrganizationList
