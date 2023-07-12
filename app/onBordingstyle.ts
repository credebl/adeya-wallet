import { StyleSheet } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

export const styles = StyleSheet.create({
  container: {
    height: hp('100%'),
    width: wp('100%'),
    padding: wp('5%'),
    paddingTop: hp('5%'),
  },
  headerText: {
    alignSelf: 'center',
    marginBottom: hp('2.5%'),
    justifyContent: 'center',
    color: '#1F4EAD',
    paddingBottom: hp('2%'),
    fontSize: 28,
  },
  backgroundImage: {
    height: 245,
    width: 343,
    alignSelf: 'center',
  },

  Image: {
    width: 78,
    height: 78,
    flexShrink: 0,
    position: 'absolute',
    right: 100,
    top: 70,
    left: 132,
    bottom: 0,
  },
  qrImage: {
    width: wp('21%'),
    height: wp('21%'),
    flexShrink: 0,
    position: 'absolute',
    right: wp('20%'),
    top: hp('12.5%'),
    left: wp('37.5%'),
  },
  bodyText: {
    marginTop: hp('2.5%'),
    display: 'flex',
    width: wp('80%'),
    flexDirection: 'column',
    flexShrink: 0,
    fontSize: hp('2.5%'),
    textAlign: 'center',
    color: '#2289F7',
    paddingTop: hp('2%'),
  },
  descriptiionText: {
    alignSelf: 'center',
    marginHorizontal: wp('1%'),
  },
  startedButtonconatiner: {
    margin: wp('5%'),
  },
  guideimages: {
    alignItems: 'center',
  },
})
