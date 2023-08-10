import { Dimensions, PixelRatio, StyleSheet } from 'react-native'

import { ColorPallet } from './theme'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

const widthBaseScale = SCREEN_WIDTH / 414
const heightBaseScale = SCREEN_HEIGHT / 896

const normalize = (size: number, based: 'width' | 'height' = 'width') => {
  const newSize = based === 'height' ? size * heightBaseScale : size * widthBaseScale
  return Math.round(PixelRatio.roundToNearestPixel(newSize))
}
const widthPixel = (size: number) => normalize(size, 'width')

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    height: '100%',
    flex: 1,
  },
  subcontainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 30,
  },
  rowContainerInternalView: {
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
  rowContainerView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  mediumTextStyle: {
    fontSize: 18,
    backgroundColor: ColorPallet.brand.primaryBackground,
  },
  textStyle: {
    width: 20,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  containerView: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
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
})
export default styles
