import React from 'react'
import { Text, View } from 'react-native'

import { useTheme } from '../../contexts/theme'

type UnorderedListProps = {
  UnorderedListItems: string[]
}

const UnorderedList: React.FC<UnorderedListProps> = ({ UnorderedListItems }) => {
  const { TextTheme, ColorPallet } = useTheme()

  return (
    <>
      {UnorderedListItems.map((item: string, i: number) => {
        return (
          <View key={i} style={[{ display: 'flex', flexDirection: 'row', marginBottom: 5 }]}>
            <Text
              style={[
                TextTheme.normal,
                { color: ColorPallet.brand.unorderedListModal, paddingLeft: 5 },
              ]}>{`\u2022`}</Text>
            <Text style={[TextTheme.normal, { color: ColorPallet.brand.unorderedListModal, paddingLeft: 5, flex: 1 }]}>
              {item}
            </Text>
          </View>
        )
      })}
    </>
  )
}

export default UnorderedList
