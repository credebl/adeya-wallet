import { StyleSheet } from 'react-native'

const offset = 25

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
  homebadage: { width: 28, height: 28, flexShrink: 0, justifyContent: 'space-between' },
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
    height: 100,
    width: 100,
    alignSelf: 'center',
  },
  badageText: {
    fontSize: 12,
    color: '##1F4EAD',
    textAlign: 'center',
    marginTop: 5,
  },
  homeImage: {
    width: 325.236,
    height: 328.303,
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
})
