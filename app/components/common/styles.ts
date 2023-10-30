import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeaderContainer: {
    justifyContent: 'center',
    backgroundColor: '#F4F4F4',
    paddingLeft: 15,
  },
  sectionHeaderTitle: {
    color: 'red',
    fontSize: 16,
  },
  sectionListItemContainer: {
    width: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
  },
  sectionListItemWrapper: {
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionListItemText: {
    fontSize: 10,
    textAlign: 'center',
    fontFamily: 'PingFangSC-Regular',
  },
})
