import * as WebBrowser from 'expo-web-browser'
import React, { useState } from 'react'
import { TextInput, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import colors from '../constants/Colors'
import { ApiContext } from '../services/api'
import Accounts from '../components/Accounts'
import Colors from '../constants/Colors'

export default function HomeScreen() {
  const [auth, setAuth] = useState({
    username: '',
    password: ''
  })

  const handleSetAuth = (text, type) => {
    setAuth({ ...auth, [type]: text })
  }

  return (
    <ApiContext.Consumer>
      {({ session, sessionError, login, logout, api, loading }) => (
        <View style={styles.container}>
          {!session ? (
            <View style={styles.centerLogin}>
              <TextInput
                style={styles.input}
                autoCompleteType="username"
                placeholder="MyFxbook Username"
                onChangeText={text => handleSetAuth(text, 'username')}
                autoCapitalize="none"
                value={auth.username}
              />
              <TextInput
                style={styles.input}
                autoCompleteType="password"
                placeholder="MyFxbook Password"
                onChangeText={text => handleSetAuth(text, 'password')}
                value={auth.password}
                autoCapitalize="none"
                secureTextEntry
              />
              <TouchableOpacity onPress={() => login(auth)} style={styles.loginButton}>
                <Text style={styles.loginButtonText}>{loading ? 'Loading...' : 'Login'}</Text>
              </TouchableOpacity>
              {!!sessionError && (
                <Text style={styles.errorText}>Unable to login. {sessionError}</Text>
              )}
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
          <Text style={styles.version}>v.0.0.1</Text>
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
    flex: 1,
    paddingHorizontal: 24,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  input: {
    width: Platform.isPad ? '50%' : '100%',
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    height: 40,
    marginBottom: 12
  },
  footerTab: {
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loginButton: {
    width: Platform.isPad ? '50%' : '100%',
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: colors.tintColor,
    alignItems: 'center',
    borderRadius: 4
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
  },
  version: {
    textAlign: 'center',
    paddingBottom: 16,
    color: 'rgba(255,255,255, .1)'
  },
  errorText: {
    paddingVertical: 12,
    fontSize: 12,
    textAlign: 'center',
    color: Colors.danger
  }
})
