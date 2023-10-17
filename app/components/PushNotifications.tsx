import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import PushNotificationsModal from '../components/modals/PushNotificationsModal'
import { isMediatorCapable, isRegistered, setup, isUserDenied } from '../utils/PushNotificationHelper'
import { useAppAgent } from '../utils/agent'

const PushNotifications = () => {
  const { agent } = useAppAgent()
  const { t } = useTranslation()
  const [infoModalVisible, setInfoModalVisible] = useState(false)

  const setupPushNotifications = async () => {
    setInfoModalVisible(false)
    if (!agent || (await isUserDenied())) return
    setup(agent, false)
  }

  const initializeCapabilityRequest = async () => {
    if (!agent || !(await isMediatorCapable(agent)) || (await isRegistered())) return
    setInfoModalVisible(true)
  }

  useEffect(() => {
    initializeCapabilityRequest()
  }, [agent]) // Reload if agent becomes defined

  return (
    <PushNotificationsModal
      title={t('PushNotifications.Title')}
      visible={infoModalVisible}
      onDone={setupPushNotifications}
    />
  )
}

export default PushNotifications
