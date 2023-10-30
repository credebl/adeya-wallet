import * as React from 'react'
import { PureComponent } from 'react'
import { GestureResponderEvent, PanResponder, PanResponderInstance, View } from 'react-native'

import SectionListItem from './SectionListItem'

interface IProps {
  contentHeight: number
  topPosition: number
  pageY: number
  titles: string[]
  onSelect: (index: number) => void
  alphabetToast: boolean
}

const initState = {
  selectAlphabet: '',
  itemHeight: 0,
}

type State = Readonly<typeof initState>

class AlphabetListView extends PureComponent<IProps, State> {
  public constructor(props: IProps) {
    super(props)
    this.state = initState
  }

  public componentDidMount() {
    this.initData(this.props)
  }

  public componentWillReceiveProps(props: IProps) {
    this.initData(props)
  }

  public updateSelectAlphabet(selectAlphabet: string) {
    this.setState({
      selectAlphabet: selectAlphabet,
    })
  }

  public initData({ titles, contentHeight }: IProps) {
    this.setState({
      selectAlphabet: titles[0],
      itemHeight: contentHeight / titles.length,
    })
  }

  public onTouchChange = (e: GestureResponderEvent) => {
    const itemHeight = this.props.contentHeight / this.props.titles.length

    const event: any = e.nativeEvent || {}
    const index = Math.floor((event.pageY - this.props.pageY) / itemHeight)

    if (index >= 0 && index <= this.props.titles.length - 1) {
      this.props.onSelect && this.props.onSelect(index)
      this.updateSelectAlphabet(this.props.titles[index])
    }
  }

  public responder: PanResponderInstance = PanResponder.create({
    onStartShouldSetPanResponderCapture: () => true,
    onStartShouldSetPanResponder: () => true,
    onPanResponderTerminationRequest: () => true,
    onPanResponderGrant: this.onTouchChange,
    onPanResponderMove: this.onTouchChange,
  })

  public render() {
    const { selectAlphabet, itemHeight } = this.state
    if (itemHeight < 13) {
      return null
    }

    const { topPosition, contentHeight, titles } = this.props

    return (
      <View
        style={{
          position: 'absolute',
          top: topPosition,
          right: 5,
          zIndex: 10,
          height: contentHeight,
          backgroundColor: '#E1EAFF',
          borderRadius: 30,
          flexShrink: 0,
        }}
        {...this.responder.panHandlers}>
        {titles.map((title: string) => (
          <SectionListItem key={title} height={itemHeight} title={title} active={selectAlphabet === title} />
        ))}
      </View>
    )
  }
}

export default AlphabetListView
