import * as WebBrowser from 'expo-web-browser'
import React from 'react'
import { Alert, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import colors from '../constants/Colors'
import { ApiContext } from '../services/api'
import Accounts from '../components/Accounts'

export default function HomeScreen() {
  return (
    <ApiContext.Consumer>
      {({ session, login, logout, api }) => (
        <View style={styles.container}>
          {!session ? (
            <View style={styles.centerLogin}>
              <TouchableOpacity onPress={login} style={styles.loginButton}>
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Accounts api={api} session={session}></Accounts>
          )}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#262B34'
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
    backgroundColor: colors.danger,
    alignItems: 'center',
    borderRadius: 4,
    flex: 1
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 14
  }
})
