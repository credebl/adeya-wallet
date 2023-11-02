import { StyleSheet } from 'react-native'

import { ColorPallet } from '../../theme'

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeaderContainer: {
    justifyContent: 'center',
    backgroundColor: ColorPallet.brand.tabsearchBackground,
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
  },
})
