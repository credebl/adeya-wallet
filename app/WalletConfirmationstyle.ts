import { Dimensions, PixelRatio, StyleSheet } from 'react-native'

import { ColorPallet } from './theme'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')
const { width } = Dimensions.get('window')
const widthBaseScale = SCREEN_WIDTH / 414
const heightBaseScale = SCREEN_HEIGHT / 896

const normalize = (size: number, based: 'width' | 'height' = 'width') => {
  const newSize = based === 'height' ? size * heightBaseScale : size * widthBaseScale
  return Math.round(PixelRatio.roundToNearestPixel(newSize))
}
const widthPixel = (size: number) => normalize(size, 'width')
const heightPixel = (size: number) => normalize(size, 'height')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    height: '100%',
  },
  scrollview: {
    flex: 1,
  },
  titleText: {
    fontSize: 26,
    marginTop: 15,
    textAlign: 'center',
    color: '#7C7C7C',
  },
  detailText: {
    fontSize: 18,
    marginHorizontal: 30,
    marginTop: 20,
    lineHeight: 20,
    textAlign: 'center',
  },
  successText: {
    fontSize: 14,
  },
  successView: { justifyContent: 'center', alignItems: 'center' },
  setPhraseView: {
    width: width - 60,
  },
  addPhraseView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: heightPixel(50),
  },
  rowAddItemContainerView: {
    width: widthPixel(150),
    marginVertical: 10,
    padding: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowAddItemText: {
    fontSize: 20,
    color: '#000',
  },
  rowItemIndexText: {
    width: 20,
    textAlign: 'center',
  },
  rowItemPhraseText: {
    fontSize: 20,
  },
  rowItemContainerView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  rowAItemContainerView: {
    flexDirection: 'row',
    width: widthPixel(150),
    margin: 10,
    padding: 7,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1.3,
    backgroundColor: ColorPallet.brand.primaryBackground,
  },
})

export default styles
