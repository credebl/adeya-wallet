import {
  Agent,
  CacheModule,
  DidsModule,
  IndyVdrIndyDidResolver,
  JwkDidRegistrar,
  JwkDidResolver,
  MediatorPickupStrategy,
  SingleContextStorageLruCache,
  WebDidResolver,
  getAgentModules,
  useAdeyaAgent,
} from '@adeya/ssi'
import { PolygonDidResolver, PolygonModule } from '@ayanworks/credo-polygon-w3c-module'
// eslint-disable-next-line import/no-extraneous-dependencies
import { KeyDidRegistrar, KeyDidResolver } from '@credo-ts/core'
import { OpenId4VcHolderModule } from '@credo-ts/openid4vc'
import Config from 'react-native-config'

import indyLedgers from '../../configs/ledgers/indy'

export const adeyaAgentModules = () => {
  return {
    ...getAgentModules({
      indyNetworks: indyLedgers,
      mediatorInvitationUrl: Config.MEDIATOR_URL!,
      mediatorPickupStrategy: MediatorPickupStrategy.PickUpV2LiveMode,
    }),
    polygon: new PolygonModule({}),
    dids: new DidsModule({
      resolvers: [
        new WebDidResolver(),
        new KeyDidResolver(),
        new PolygonDidResolver(),
        new IndyVdrIndyDidResolver(),
        new JwkDidResolver(),
      ],
      registrars: [new KeyDidRegistrar(), new JwkDidRegistrar()],
    }),
    cache: new CacheModule({
      cache: new SingleContextStorageLruCache({
        limit: 50,
      }),
    }),
    openId4VcHolder: new OpenId4VcHolderModule(),
  }
}

export type AdeyaAgent = Agent<ReturnType<typeof adeyaAgentModules>>
export type AdeyaAgentModules = ReturnType<typeof adeyaAgentModules>

interface MyAgentContextInterface {
  loading: boolean
  agent: AdeyaAgent
  setAgent: (agent: AdeyaAgent) => void
}

export const useAppAgent = useAdeyaAgent as () => MyAgentContextInterface
