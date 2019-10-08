import * as WebBrowser from 'expo-web-browser'
import React from 'react'
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import colors from '../constants/Colors'
import { ApiContext } from '../services/api'
import Accounts from '../components/Accounts'

export default function HomeScreen() {
  return (
    <ApiContext.Consumer>
      {({ session, login, logout, api }) => (
        <View style={styles.container}>
          <View style={styles.contentContainer}>
            <View style={styles.welcomeContainer}>
              <Image
                source={
                  __DEV__
                    ? require('../assets/images/robot-dev.png')
                    : require('../assets/images/robot-prod.png')
                }
                style={styles.welcomeImage}
              />
              {!session ? (
                <View style={styles.centerLogin}>
                  <TouchableOpacity onPress={login} style={styles.loginButton}>
                    <Text style={styles.loginButtonText}>Login</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <Accounts api={api} session={session}></Accounts>
                </View>
              )}
            </View>
          </View>
          {!!session && (
            <View style={styles.footerTab}>
              <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </ApiContext.Consumer>
  )
}

HomeScreen.navigationOptions = {
  header: null
}

function DevelopmentModeNotice() {
  if (__DEV__) {
    const learnMoreButton = (
      <Text onPress={handleLearnMorePress} style={styles.helpLinkText}>
        Learn more
      </Text>
    )

    return (
      <Text style={styles.developmentModeText}>
        Development mode is enabled: your app will be slower but you can use useful development
        tools. {learnMoreButton}
      </Text>
    )
  } else {
    return (
      <Text style={styles.developmentModeText}>
        You are not in development mode: your app will run at full speed.
      </Text>
    )
  }
}

function handleLearnMorePress() {
  WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/workflow/development-mode/')
}

function handleHelpPress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/versions/latest/workflow/up-and-running/#cant-see-your-changes'
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center'
  },
  contentContainer: {
    paddingTop: 30,
    flex: 1
  },
  welcomeContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    flex: 1
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50
  },
  homeScreenFilename: {
    marginVertical: 7
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)'
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center'
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      android: {
        elevation: 20
      }
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center'
  },
  navigationFilename: {
    marginTop: 5
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center'
  },
  helpLink: {
    paddingVertical: 15
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7'
  },
  centerLogin: {
    width: '100%',
    flex: 1,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  footerTab: {
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loginButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: colors.tintColor,
    alignItems: 'center',
    borderRadius: 4,
    flex: 1
  },
  loginButtonText: {
    color: 'white',
    fontSize: 14
  },
  logoutButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: colors.errorBackground,
    alignItems: 'center',
    borderRadius: 4,
    flex: 1
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 14
  }
})
