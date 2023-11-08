import { useEffect, useState } from 'react'
import Toast from 'react-native-toast-message'

import { ToastType } from '../components/toast/BaseToast'

import { fetchOrganizationData } from './Organization'
import { PAGE_SIZE } from './api-constants'

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
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetchOrganizationData(currentPage, PAGE_SIZE)
      const newData = response?.data.organizations || []
      setOrganizationData(prevData => ({
        organizations: [...prevData.organizations, ...newData],
      }))
      if (response?.data?.totalPages) {
        setTotalPages(response?.data.totalPages)
      }
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
    if (currentPage < totalPages && !loading) {
      setCurrentPage(currentPage + 1)
    }
  }

  useEffect(() => {
    fetchData()
  }, [currentPage])

  return {
    organizationData,
    loading,
    loadMore,
    currentPage,
    totalPages,
  }
}

export default useOrganizationData
