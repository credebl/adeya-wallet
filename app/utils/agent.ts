import { Agent, getAgentModules, useAdeyaAgent } from '@adeya/ssi'

export type AdeyaAgent = Agent<ReturnType<typeof getAgentModules>>
export type AdeyaAgentModules = ReturnType<typeof getAgentModules>

interface MyAgentContextInterface {
  loading: boolean
  agent: AdeyaAgent
  setAgent: (agent: AdeyaAgent) => void
}

export const useAppAgent = useAdeyaAgent as () => MyAgentContextInterface
