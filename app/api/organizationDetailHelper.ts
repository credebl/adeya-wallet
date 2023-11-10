import { useState, useEffect } from 'react'
import Toast from 'react-native-toast-message'

import { ToastType } from '../components/toast/BaseToast'

import { fetchOrganizationDetail } from './Organization'

export interface OrgnizationDetailsProps {
  name: string
  description: string
  logoUrl: string
  orgSlug: string
}

export interface CredentialDetail {
  tag: string
  credentialDefinitionId: string
  schemaLedgerId: string
  revocable: boolean
  createDateTime: string
}

const useOrganizationDetailData = (orgSlug: string) => {
  const [organizationDetailData, setOrganizationDetailData] = useState([])
  const [credentialDetailData, setCredentialDetailData] = useState<CredentialDetail[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchOrganizationDetail(orgSlug)
        setOrganizationDetailData(response?.data.org_agents)
        setCredentialDetailData(response?.data.credential_definitions || [])
      } catch (error) {
        Toast.show({
          type: ToastType.Error,
          text1: 'Error fetching organization data',
        })
      }
    }

    fetchData()
  }, [orgSlug])

  return {
    organizationDetailData,
    credentialDetailData,
  }
}

export default useOrganizationDetailData
