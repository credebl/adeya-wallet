import { useEffect, useState } from 'react'
import Toast from 'react-native-toast-message'

import { ToastType } from '../components/toast/BaseToast'

import { fetchOrganizationData } from './Organization'

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

const useOrganizationData = (pageSize: number) => {
  const [organizationData, setOrganizationData] = useState<OrganizationData>({ organizations: [] })
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchData = async () => {
    try {
      const response = await fetchOrganizationData(currentPage, pageSize)
      const newData = response?.data.organizations || []
      setOrganizationData(prevData => ({
        organizations: [...prevData.organizations, ...newData],
      }))
      setTotalPages(response?.data.totalPages)
    } catch (error) {
      Toast.show({
        type: ToastType.Error,
        text1: 'Error fetching organization data',
      })
    } finally {
      setLoading(false)
    }
  }

  const loadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  useEffect(() => {
    fetchData()
  }, [currentPage, pageSize])

  return {
    organizationData,
    loading,
    loadMore,
    currentPage,
    totalPages,
  }
}

export default useOrganizationData
