import { Agent, CredentialExchangeRecord } from '@aries-framework/core'
import { useCredentials } from '@aries-framework/react-hooks'
import { useMemo } from 'react'

export const useCredentialsByConnectionId = (connectionId: string): CredentialExchangeRecord[] => {
  const { records: credentials } = useCredentials()
  return useMemo(
    () => credentials.filter((credential: CredentialExchangeRecord) => credential.connectionId === connectionId),
    [credentials, connectionId],
  )
}

export const useW3CCredentialsById = async (agent: Agent, id: string) => {
  return await agent.w3cCredentials.getCredentialRecordById(id)
}
