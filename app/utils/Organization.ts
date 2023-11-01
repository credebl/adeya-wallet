import { Config } from 'react-native-config'
import Toast from 'react-native-toast-message'

import { ToastType } from '../components/toast/BaseToast'

export const fetchOrganizationData = async () => {
  try {
    const response = await fetch(Config.PUBLIC_ORG)
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
    const response = await fetch(`${Config.PUBLIC_ORG}${orgName}`)
    const data = await response.json()
    return data
  } catch (error) {
    Toast.show({
      type: ToastType.Error,
      text1: 'Error fetching organization data',
    })
  }
}
