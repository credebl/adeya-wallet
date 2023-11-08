import React, { useState, useEffect, useRef, ComponentType, ReactElement, JSXElementConstructor } from 'react'
import {
  Dimensions,
  FlatList,
  InteractionManager,
  LayoutChangeEvent,
  ListRenderItemInfo,
  View,
  ViewToken,
} from 'react-native'

import AlphabetListView from './AlphabetListView'
import SectionHeader, { IProps as SectionHeaderIProps, sectionHeaderHeight } from './SectionHeader'
import styles from './styles'

export interface IItemProps<I> {
  item: I
  index: number
  last: boolean
}

export type ListRenderItem<ItemT> = (props: IItemProps<ItemT>) => React.ReactElement | null
export type ListRenderSectionHeader<T> = (props: T) => React.ReactElement | null

export interface IProps<ItemT> {
  ListFooterComponent: ComponentType<any> | ReactElement<any, string | JSXElementConstructor<any>> | null | undefined
  onEndReached: ((info: { distanceFromEnd: number }) => void) | null | undefined
  data: {
    [key: string]: ItemT[]
  }
  itemHeight: number
  renderItem: ListRenderItem<ItemT>
  headerHeight?: number
  sectionHeaderHeight?: number
  renderSectionHeader?: ListRenderSectionHeader<SectionHeaderIProps>
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null
  alphabetToast?: boolean
}

const defaultProps = {
  headerHeight: 0,
  sectionHeaderHeight: sectionHeaderHeight,
  renderSectionHeader: SectionHeader,
  alphabetToast: true,
}

export interface IState {
  containerHeight: number
  itemLayout: {
    title: string
    itemLength: number
    beforeItemLength: number
    length: number
    offset: number
  }[]
  titles: string[]
  selectAlphabet: string
  initialNumToRender: number
  pageY: number
}

const windowHeight = Dimensions.get('window').height
function AlphabetFlatList<ItemT>(props: IProps<ItemT>) {
  const [containerHeight, setContainerHeight] = useState(windowHeight)
  const [itemLayout, setItemLayout] = useState([])
  const [titles, setTitles] = useState([])
  const [initialNumToRender, setInitialNumToRender] = useState(0)
  const [pageY, setPageY] = useState(0)

  const touchedTimeRef = useRef(0)
  const containerRef = useRef<View>(null)
  const listRef = useRef<FlatList<ItemT>>(null)
  const alphabetListRef = useRef<typeof AlphabetListView>(null)

  const refreshBaseData = (data: any) => {
    const titles = Object.keys(data)

    const offset = (index: number, itemLength: number) =>
      index * (props.sectionHeaderHeight || 0) + itemLength * props.itemHeight

    const itemLayout = titles.map((title, index) => {
      const beforeItemLength = titles.slice(0, index).reduce((length, item) => length + data[item].length, 0)
      const itemLength = data[title].length
      return {
        title,
        itemLength,
        beforeItemLength,
        length: (props.sectionHeaderHeight || 0) + props.itemHeight * itemLength,
        offset: offset(index, beforeItemLength) + (props.headerHeight || 0),
      }
    })

    let initialNumToRender = itemLayout.findIndex(item => item.offset >= containerHeight)
    if (initialNumToRender < 0) {
      initialNumToRender = titles.length
    }

    setItemLayout(itemLayout)
    setTitles(titles)
    setInitialNumToRender(initialNumToRender)
  }
  useEffect(() => {
    refreshBaseData(props.data)
  }, [props.data])
  const onLayout = (e: LayoutChangeEvent) => {
    InteractionManager.runAfterInteractions(() => {
      if (containerRef.current) {
        containerRef.current.measure((x, y, w, h, px, py) => {
          setPageY(py)
        })
      }
    })
    setContainerHeight(e.nativeEvent.layout.height - (props.headerHeight || 0))
  }

  const onSelect = (index: number) => {
    if (listRef.current) {
      listRef.current.scrollToIndex({ index, animated: true })
    }
    touchedTimeRef.current = new Date().getTime()
  }

  const onViewableItemsChanged = (info: { viewableItems: Array<ViewToken>; changed: Array<ViewToken> }) => {
    if (info.viewableItems.length) {
      if (new Date().getTime() - touchedTimeRef.current < 500) {
        return
      }
      if (alphabetListRef.current) {
        alphabetListRef.current.updateSelectAlphabet(info.viewableItems[0].item)
      }
    }
  }
  const viewabilityConfigCallbackPairs = useRef([{ onViewableItemsChanged }])

  const getItemLayout = (data: any, index: number) => ({
    length: itemLayout[index]?.length,
    offset: itemLayout[index]?.offset,
    index,
  })

  const renderItem = (info: ListRenderItemInfo<string>) => (
    <View key={info.index}>
      {props.data[info.item].map((itemValue, itemIndex, items) =>
        props.renderItem({
          item: itemValue,
          index: itemIndex,
          last: itemIndex === items.length - 1,
        }),
      )}
    </View>
  )

  return (
    <View style={styles.container} ref={containerRef} onLayout={onLayout}>
      <FlatList<any>
        ref={listRef}
        {...props}
        data={titles}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${index}`}
        getItemLayout={getItemLayout}
        onEndReached={props.onEndReached}
        initialNumToRender={initialNumToRender}
        onEndReachedThreshold={0.1}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        ListFooterComponent={props.ListFooterComponent}
      />
      <AlphabetListView
        ref={alphabetListRef}
        topPosition={props.headerHeight || 0}
        pageY={pageY + (props.headerHeight || 0)}
        contentHeight={containerHeight - (props.headerHeight || 0)}
        titles={titles}
        onSelect={onSelect}
      />
    </View>
  )
}

AlphabetFlatList.defaultProps = defaultProps

export default AlphabetFlatList
