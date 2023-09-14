import { useAgent } from '@aries-framework/react-hooks'
import React, { useEffect, useState } from 'react'
import PushNotificationsModal from '../components/modals/PushNotificationsModal'
import { isMediatorCapable, isRegistered, setup, isUserDenied } from '../utils/PushNotificationHelper'

const PushNotifications = () => {
  const { agent } = useAgent()
  const [infoModalVisible, setInfoModalVisible] = useState(false)

  const setupPushNotifications = async () => {
    setInfoModalVisible(false)
    if (!agent || (await isUserDenied())) return
    setup(agent, true)
  }

  const initializeCapabilityRequest = async () => {
    if (!agent || !(await isMediatorCapable(agent)) || (await isRegistered())) return
    setInfoModalVisible(true)
  }

  useEffect(() => {
    initializeCapabilityRequest()
  }, [agent]) // Reload if agent becomes defined

  return <PushNotificationsModal title="hiii" visible={infoModalVisible} onDone={setupPushNotifications} />
}

export default PushNotifications
