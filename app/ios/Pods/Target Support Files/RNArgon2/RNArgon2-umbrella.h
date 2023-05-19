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

#import "RNArgon2-Bridging-Header.h"

FOUNDATION_EXPORT double RNArgon2VersionNumber;
FOUNDATION_EXPORT const unsigned char RNArgon2VersionString[];

