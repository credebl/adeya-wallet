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
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    height: CONTACT_ITEM_HEIGHT,
    padding: 15,
    borderColor: '#E5E5E5',
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  body: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    color: '#333',
  },
})

const ContactItem: FC<IItemProps<IContact>> = function ({ item, last }) {
  return (
    <View key={item.id} style={[styles.container, { borderBottomWidth: last ? 0 : StyleSheet.hairlineWidth }]}>
      <Image style={styles.avatar} source={{ uri: item.logoUrl }} />
      <View style={styles.body}>
        <Text style={styles.name}>{`${item.name}`}</Text>
      </View>
    </View>
  )
}

export default ContactItem
