import { useState } from 'react'
import Toast from 'react-native-toast-message'

import { ToastType } from '../components/toast/BaseToast'
import { fetchOrganizationData } from '../utils/Organization'

export interface Organization {
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

export interface OrganizationData {
  organizations: Organization[]
}
const useOrganizationData = () => {
  const [organizationData, setOrganizationData] = useState<OrganizationData>({ organizations: [] })
  const [loading, setLoading] = useState(true)

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

  return {
    organizationData,
    loading,
    fetchData,
  }
}

export default useOrganizationData
