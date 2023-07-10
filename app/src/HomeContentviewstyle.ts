import { StyleSheet } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

const offset = 25

export const styles = StyleSheet.create({
  container: {
    height: hp('100%'),
    width: wp('100%'),
    paddingHorizontal: offset,
    paddingBottom: 25 * 3,
  },
  messageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 35,
    marginHorizontal: offset,
  },
  feedbackContainer: {
    paddingTop: 15,
    marginHorizontal: offset,
  },
  feedbackIcon: {
    paddingRight: 10,
  },
  homebadage: { width: 29, height: 28, flexShrink: 0, justifyContent: 'space-between' },
  homebadageview: {
    flexDirection: 'row',
    marginTop: 30,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  badageview: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  badagecontainer: {
    height: hp('30%'),
    width: wp('30%'),
    alignSelf: 'center',
  },
  badageText: {
    fontSize: 14,
    color: '#1F4EAD',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 5,
  },
  badageCount: {
    fontSize: 15,
    color: '#1F4EAD',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 5,
  },
  homeImage: {
    width: 300.236,
    height: 300.303,
    flexShrink: 0,
  },
  button: {
    paddingHorizontal: 16,
  },
  countext: {
    color: '#2052A8',
    fontSize: 10,
    fontWeight: '500',
    fontStyle: 'normal',
    textAlign: 'center',
    marginTop: 3,
  },
  countbackgroundImage: {
    position: 'absolute',
    bottom: 40,
    right: 0,
    left: 20,
    top: 0,
    height: 19,
    width: 19,
  },
  line: {
    alignSelf: 'center',
    marginBottom: 5,
    marginTop: 5,
  },
})
