import { GenericFn } from './fn'

export interface Setting {
  title: string
  value?: string | JSX.Element
  onPress?: GenericFn
  accessibilityLabel?: string
  testID?: string
}

export interface SettingSection {
  header: {
    title: string
    icon: string
  }
  data: Setting[]
}
