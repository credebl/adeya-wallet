import React from 'react'
import { Actions, ActionsProps } from 'react-native-gifted-chat'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export const renderActions = (
  props: ActionsProps,
  theme: any,
  actions?: { text: string; icon: React.FC; onPress: () => void }[],
) => {
  return actions ? (
    <Actions
      {...props}
      containerStyle={{
        width: 40,
        height: 40,
        marginBottom: 6,
        marginLeft: 20,
      }}
      icon={() => <Icon name={'plus-box-outline'} size={40} color={theme.options} />}
      optionTintColor={theme.optionsText}
    />
  ) : null
}
