import { useProofs, ProofExchangeRecord } from '@adeya/ssi'
import { useMemo } from 'react'

export const useProofsByConnectionId = (connectionId: string): ProofExchangeRecord[] => {
  const { records: proofs } = useProofs()
  return useMemo(
    () => proofs.filter((proof: ProofExchangeRecord) => proof.connectionId === connectionId),
    [proofs, connectionId],
  )
}
