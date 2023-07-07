import { Dimensions, StyleSheet } from 'react-native'

const offset = 25
const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

export const styles = StyleSheet.create({
  container: {
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
    marginLeft: 20,
  },
  badageview: {
    flexDirection: 'row',
    marginLeft: 40,
  },
  badagecontainer: {
    height: windowHeight / 4,
    width: windowWidth / 4,
    alignSelf: 'center',
    marginRight: 20,
  },
  badageText: {
    fontSize: 14,
    color: '#1F4EAD',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 5,
    marginLeft: 5,
  },
  badageCount: {
    fontSize: 17,
    color: '#1F4EAD',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 5,
    marginLeft: 10,
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
