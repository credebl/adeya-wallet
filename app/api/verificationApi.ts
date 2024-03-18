import Toast from 'react-native-toast-message'

import { ToastType } from '../components/toast/BaseToast'

import { setZeroConfDevice } from './Organization'

const useZeroConfSwitch = () => {
  const setDeviceData = async (switchValue: 'off' | 'on') => {
    try {
      await setZeroConfDevice({ deviceid: '10018a988a', data: { switch: switchValue } })
    } catch (error) {
      Toast.show({
        type: ToastType.Error,
        text1: 'Error fetching organization data',
      })
    }
  }

  return {
    setDeviceData,
  }
}

export default useZeroConfSwitch
