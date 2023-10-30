import Toast from 'react-native-toast-message'

import { ToastType } from '../components/toast/BaseToast'

export const fetchOrganizationData = async () => {
  try {
    const response = await fetch('https://devapi.credebl.id/orgs/public-profile')
    const result = await response.json()
    return result
  } catch (error) {
    Toast.show({
      type: ToastType.Error,
      text1: 'Error fetching organization data',
    })
  }
}
export const fetchOrganizationDetail = async (orgName: string) => {
  try {
    const url = `https://devapi.credebl.id/orgs/public-profiles/${orgName}`
    const response = await fetch(url)
    const data = await response.json()
    return data
  } catch (error) {
    Toast.show({
      type: ToastType.Error,
      text1: 'Error fetching organization data',
    })
  }
}

// export default { fetchOrganizationData, fetcexhOrganizationDetail }
