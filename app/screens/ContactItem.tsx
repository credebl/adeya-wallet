import React, { FC } from 'react'
import { StyleSheet, View, Text, Image } from 'react-native'

import { IItemProps } from '../components/common/AlphabetFlatList'

export interface IContact {
  id: number
  logoUrl: string
  name: string
  description: string
  orgSlug: string
}
export const CONTACT_ITEM_HEIGHT = 70

const ContactItem: FC<IItemProps<IContact>> = function ({ item, last }) {
  return (
    <View key={item.id} style={[{ borderBottomWidth: last ? 0 : StyleSheet.hairlineWidth }]}>
      <Image source={{ uri: item.logoUrl }} />
      <View>
        <Text>{`${item.name}`}</Text>
      </View>
    </View>
  )
}

export default ContactItem
