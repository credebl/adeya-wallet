import { Config } from 'react-native-config'
import Toast from 'react-native-toast-message'

import { ToastType } from '../components/toast/BaseToast'

import { ORG_DETAILS, ORG_PROFILE } from './api-constants'

interface OrganizationParams {
  pageNumber?: number
  pageSize?: number
  searchText?: string
}

export const fetchOrganizationData = async ({ pageNumber, pageSize, searchText }: OrganizationParams) => {
  const controller = new AbortController()
  const signal = controller.signal

  let url = `${Config.PUBLIC_ORG}${ORG_PROFILE}?pageNumber=${pageNumber}&pageSize=${pageSize}`

  // Update url if the user is searching for an organization
  if (searchText) {
    url = `${Config.PUBLIC_ORG}${ORG_PROFILE}?search=${searchText}`
  }

  try {
    const response = await fetch(url, {
      signal,
    })
    const result = await response.json()
    return result
  } catch (error) {
    Toast.show({
      type: ToastType.Error,
      text1: searchText ? 'Searching organizations failed' : 'Fetching organizations failed',
    })
  }
}

export const fetchOrganizationDetail = async (orgName: string) => {
  try {
    const response = await fetch(`${Config.PUBLIC_ORG}${ORG_DETAILS}${orgName}`)
    const data = await response.json()
    return data
  } catch (error) {
    Toast.show({
      type: ToastType.Error,
      text1: 'Error fetching organization data',
    })
  }
}
