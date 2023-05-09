/* eslint-disable */
const path = require('path')
const escape = require('escape-string-regexp')
const { getDefaultConfig } = require('metro-config')
const exclusionList = require('metro-config/src/defaults/exclusionList')
module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig()
  const metroConfig = {
    projectRoot: path.resolve(__dirname, './'),
    /*resetCache: true,*/
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
    resolver: {
      assetExts: assetExts.filter((ext) => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg', 'cjs'],
    },
  }
  // eslint-disable-next-line no-console
  //console.dir(metroConfig)
  return metroConfig
})()
