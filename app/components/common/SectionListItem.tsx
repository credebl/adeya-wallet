import * as React from 'react'
import { View, Text } from 'react-native'

import { ColorPallet } from '../../theme'

import styles from './styles'

interface IProps {
  title: string
  height: number
  active: boolean
}

const SectionListItem: React.FC<IProps> = props => {
  return (
    <View style={[styles.sectionListItemContainer]}>
      <View
        style={[
          styles.sectionListItemWrapper,
          {
            backgroundColor: props.active ? ColorPallet.brand.primary : 'transparent',
          },
        ]}>
        <Text
          style={[
            styles.sectionListItemText,
            {
              color: props.active ? ColorPallet.grayscale.white : ColorPallet.grayscale.black,
            },
          ]}>
          {props.title}
        </Text>
      </View>
    </View>
  )
}

export default SectionListItem
