import React from 'react'
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { DisplayImage } from '../../utils/helpers'

type OpenIdCredentialCardProps = {
  onPress?(): void
  name: string
  issuerName: string
  subtitle?: string
  bgColor?: string
  textColor?: string
  issuerImage?: DisplayImage
  backgroundImage?: DisplayImage
  shadow?: boolean
}

export function getTextColorBasedOnBg(bgColor: string) {
  return Number.parseInt(bgColor.replace('#', ''), 16) > 0xffffff / 2 ? '#212529' : '#f6f9fc'
}

const OpenIdCredentialCard: React.FC<OpenIdCredentialCardProps> = ({
  issuerName,
  name,
  backgroundImage,
  issuerImage,
  bgColor,
  textColor,
  onPress,
  subtitle,
}) => {
  const styles = StyleSheet.create({
    container: {
      borderRadius: 8,
      position: 'relative',
    },
    card: {
      width: '100%',
      borderRadius: 8,
      height: 164,
      overflow: 'hidden',
    },
    backgroundView: {
      width: '100%',
      borderRadius: 8,
      height: '100%',
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: 8,
    },
    iconContainer: {
      paddingRight: 16,
    },
    textContainer: {
      flex: 1,
      alignItems: 'flex-end',
    },
    heading: {
      fontSize: 16,
      textAlign: 'right',
    },
    subtitle: {
      fontSize: 12,
      textAlign: 'right',
      opacity: 0.8,
    },
    cardFooter: {
      paddingTop: 8,
    },
    footerTextContainer: {
      alignItems: 'flex-start',
    },
    issuerLabel: {
      fontSize: 10,
      opacity: 0.8,
    },
    issuerName: {
      fontSize: 12,
    },
    cardBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
    },
    backgroundImage: {
      width: '100%',
      height: '100%',
    },
    backgroundFallback: {
      width: '100%',
      height: '100%',
    },
    cardContainer: {
      flex: 1,
      padding: 16,
      justifyContent: 'space-between',
    },
  })

  textColor = textColor ? textColor : getTextColorBasedOnBg(bgColor ?? '#000')

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <TouchableOpacity style={[styles.card, { backgroundColor: bgColor }]} onPress={onPress} activeOpacity={0.7}>
        <ImageBackground
          source={{ uri: backgroundImage?.url }}
          style={styles.backgroundView}
          imageStyle={styles.backgroundImage}
          resizeMode="cover">
          <View style={styles.cardContainer}>
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                {issuerImage?.url ? (
                  <Image
                    source={{
                      uri: issuerImage?.url,
                    }}
                    resizeMode="contain"
                    alt={issuerImage?.altText}
                    width={64}
                    height={48}
                  />
                ) : null}
              </View>
              <View style={styles.textContainer}>
                <Text style={[styles.heading, { color: textColor }]} numberOfLines={2}>
                  {name}
                </Text>
                <Text style={[styles.subtitle, { color: textColor }]} numberOfLines={1}>
                  {subtitle}
                </Text>
              </View>
            </View>
            <View style={styles.cardFooter}>
              <View style={styles.footerTextContainer}>
                <Text style={[styles.issuerLabel, { color: textColor }]}>Issuer</Text>
                <Text style={[styles.issuerName, { color: textColor }]} numberOfLines={2}>
                  {issuerName}
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  )
}

export default OpenIdCredentialCard
