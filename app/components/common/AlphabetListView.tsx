import { useEffect, useMemo, useState } from 'react'
import { GestureResponderEvent, PanResponder, PanResponderInstance, View } from 'react-native'

import { ColorPallet } from '../../theme'

import SectionListItem from './SectionListItem'

const AlphabetListView: React.FC<IProps> = props => {
  const [selectAlphabet, setSelectAlphabet] = useState<string>('')
  const [itemHeight, setItemHeight] = useState<number>(0)

  const { contentHeight, titles, topPosition, pageY, onSelect } = props

  const initData = ({ titles, contentHeight }: IProps) => {
    setSelectAlphabet(titles[0])
    setItemHeight(contentHeight / titles.length)
  }
  useEffect(() => {
    initData(props)
  }, [props])

  const onTouchChange = (e: GestureResponderEvent) => {
    const itemHeight = contentHeight / titles.length

    const event: any = e.nativeEvent || {}
    const index = Math.floor((event.pageY - pageY) / itemHeight)

    if (index >= 0 && index <= titles.length - 1) {
      onSelect && onSelect(index)
      setSelectAlphabet(titles[index])
    }
  }

  const responder: PanResponderInstance = useMemo(() => {
    return PanResponder.create({
      onStartShouldSetPanResponderCapture: () => true,
      onStartShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => true,
      onPanResponderGrant: onTouchChange,
      onPanResponderMove: onTouchChange,
    })
  }, [onTouchChange])

  if (itemHeight < 13) {
    return null
  }

  return (
    <View
      style={{
        position: 'absolute',
        top: topPosition,
        right: 5,
        zIndex: 10,
        height: contentHeight,
        backgroundColor: ColorPallet.brand.modalOrgBackground,
        borderRadius: 30,
        flexShrink: 0,
      }}
      {...responder.panHandlers}>
      {titles.map((title: string) => (
        <SectionListItem key={title} height={itemHeight} title={title} active={selectAlphabet === title} />
      ))}
    </View>
  )
}

export default AlphabetListView
