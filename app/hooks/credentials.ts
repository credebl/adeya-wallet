import { useCredentials } from '@adeya/ssi'
import { CredentialExchangeRecord } from '@aries-framework/core'
import { useMemo } from 'react'

export const useCredentialsByConnectionId = (connectionId: string): CredentialExchangeRecord[] => {
  const { records: credentials } = useCredentials()
  return useMemo(
    () => credentials.filter((credential: CredentialExchangeRecord) => credential.connectionId === connectionId),
    [credentials, connectionId],
  )
}
