import * as React from 'react'
import { FC } from 'react'
import { View, Text } from 'react-native'

import styles from './styles'

interface IProps {
  title: string
  height: number
  active: boolean
}

const SectionListItem: FC<IProps> = function (props) {
  return (
    <View style={[styles.sectionListItemContainer, { height: props.height }]}>
      <View
        style={[
          styles.sectionListItemWrapper,
          {
            backgroundColor: props.active ? '#1F4EAD' : 'transparent',
          },
        ]}>
        <Text
          style={[
            styles.sectionListItemText,
            {
              color: props.active ? 'white' : '#333',
            },
          ]}>
          {props.title}
        </Text>
      </View>
    </View>
  )
}

export default SectionListItem
