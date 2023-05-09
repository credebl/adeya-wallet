import React from 'react'
import { Image, ImageResizeMode, ImageSourcePropType, ImageStyle } from 'react-native'

export interface AdeyaLogoProps {
  style: ImageStyle
  resizeMode: ImageResizeMode
  source: ImageSourcePropType
}

export const AdeyaLogoSecondary: React.FC<AdeyaLogoProps> = ({ style, resizeMode, source }) => {
  return <Image source={source} style={style} resizeMode={resizeMode} />
}
