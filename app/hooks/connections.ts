import {
  useConnectionById,
  useConnections,
  ConnectionRecord,
  OutOfBandRecord,
  findOutOfBandRecordById,
} from '@adeya/ssi'
import { useMemo, useState } from 'react'

export const useConnectionByOutOfBandId = (outOfBandId: string): ConnectionRecord | undefined => {
  const { records: connections } = useConnections()
  return useMemo(
    () => connections.find((connection: ConnectionRecord) => connection.outOfBandId === outOfBandId),
    [connections, outOfBandId],
  )
}

export const useOutOfBandById = (oobId: string): OutOfBandRecord | undefined => {
  const [oob, setOob] = useState<OutOfBandRecord | undefined>(undefined)
  if (!oob) {
    findOutOfBandRecordById(oobId).then(res => {
      if (res) {
        setOob(res)
      }
    })
  }
  return oob
}

export const useOutOfBandByConnectionId = (connectionId: string): OutOfBandRecord | undefined => {
  const connection = useConnectionById(connectionId)
  return useOutOfBandById(connection?.outOfBandId ?? '')
}
