import { AppLoading } from 'expo'
import { Asset } from 'expo-asset'
import * as Font from 'expo-font'
import React, { useState, useEffect } from 'react'
import { Platform, StatusBar, StyleSheet, View, AsyncStorage } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import AppNavigator from './navigation/AppNavigator'
import { Api, ApiContext } from './services/api'

if (__DEV__) {
  import('./config/ReactotronConfig').then(() => console.log('Reactotron Configured'))
}

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false)
  const [apiContext, setApiContext] = useState(null)
  const [session, setSession] = useState('')

  const setup = async () => {
    const env = new Api()
    await env.setup()
    setApiContext(env)
  }

  async function getSession() {
    console.tron.log('Retrieving session...')
    try {
      const value = await AsyncStorage.getItem('myfxSession')
      if (value !== null) {
        // set the session to state
        console.tron.log(`Session received...${value}`)
        setSession(value)
      } else {
        console.tron.log('No session in storage...')
      }
    } catch (error) {
      // Error retrieving data
      console.tron.error(`Unable to retrieve session: ${error.message}`)
    }
  }

  async function storeSession(sessionId) {
    console.tron.log('Storing session...')
    try {
      await AsyncStorage.setItem('myfxSession', sessionId)
      getSession()
    } catch (error) {
      console.tron.error(`Unable to save the session: ${error.message}`)
    }
  }

  async function removeSession() {
    console.tron.log('Clearing session...')
    try {
      console.tron.log('Done...')
      await AsyncStorage.removeItem('myfxSession')
    } catch (error) {
      console.tron.error(`Unable to clear the session: ${error.message}`)
    }
  }

  async function handleLogin() {
    console.tron.log('Logging in...')

    const request = await apiContext.login('idrakimuhamad@gmail.com', 'atin2309')

    if (request.kind === 'ok') {
      console.tron.log(`Logged in... Session ${request.session}`)
      storeSession(request.session)
    }
  }

  async function handleLogout() {
    console.tron.log('Logging out..')

    const request = await apiContext.logout(session)

    if (request.kind === 'ok') {
      console.tron.log(`Logged out...`)
      setSession('')
      removeSession()
    }
  }

  useEffect(() => {
    setup()
    getSession()
  }, [])

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    )
  } else {
    return (
      <ApiContext.Provider
        value={{
          api: apiContext,
          session: session,
          login: handleLogin,
          logout: handleLogout
        }}>
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <AppNavigator />
        </View>
      </ApiContext.Provider>
    )
  }
}

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      require('./assets/images/robot-dev.png'),
      require('./assets/images/robot-prod.png')
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf')
    })
  ])
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error)
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
})
