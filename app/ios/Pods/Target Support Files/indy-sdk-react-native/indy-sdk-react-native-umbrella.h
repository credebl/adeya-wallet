#ifdef __OBJC__
#import <UIKit/UIKit.h>
#else
#ifndef FOUNDATION_EXPORT
#if defined(__cplusplus)
#define FOUNDATION_EXPORT extern "C"
#else
#define FOUNDATION_EXPORT extern
#endif
#endif
#endif

#import "IndySdk-Bridging-Header.h"

FOUNDATION_EXPORT double indy_sdk_react_nativeVersionNumber;
FOUNDATION_EXPORT const unsigned char indy_sdk_react_nativeVersionString[];

