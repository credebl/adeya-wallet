import { IndyVdrPoolConfig } from '@aries-framework/indy-vdr'

import _ledgers from './ledgers.json'

// type-check the json
const ledgers = _ledgers as [IndyVdrPoolConfig, ...IndyVdrPoolConfig[]]

export default ledgers
