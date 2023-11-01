import { useEffect, useState } from 'react'
import Toast from 'react-native-toast-message'

import { ToastType } from '../components/toast/BaseToast'

import { fetchOrganizationData } from './Organization'

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
const useOrganizationData = () => {
  const [organizationData, setOrganizationData] = useState<OrganizationData>({ organizations: [] })
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState('')
  const [filteredOrganizations, setFilteredOrganizations] = useState([])

  const fetchData = async () => {
    try {
      const response = await fetchOrganizationData()
      setOrganizationData(response?.data)
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

  return {
    organizationData,
    loading,
    searchInput,
    setSearchInput,
    filteredOrganizations,
  }
}

export default useOrganizationData
