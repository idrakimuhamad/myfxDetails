import React, { useEffect, useState } from 'react'
import { Platform, Text, ScrollView, StyleSheet, RefreshControl, View } from 'react-native'
import AccountOpenTrade from './AccountOpenTrade'
import Colors from '../constants/Colors'

export default function Accounts({ api, session }) {
  const [accounts, setAccounts] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  let polling

  const retrieveAccounts = async () => {
    if (api) {
      const request = await api.getAllAccounts(session)

      if (request.kind === 'ok') {
        console.log(`Account retrieved...`)
        setAccounts(request.accounts)
      } else {
        setError(request.message)
      }

      setRefreshing(false)
    }
  }

  const handleRefreshing = () => {
    setRefreshing(true)
    retrieveAccounts()
  }

  const handlePolling = () => {
    console.log('Polling every 30 minutes')

    if (polling) clearInterval(polling)

    polling = setInterval(() => {
      console.log('polling time...refreshing')
      handleRefreshing()
    }, 1000 * 60 * 30)
  }

  useEffect(() => {
    handleRefreshing()
    handlePolling()

    return function clear() {
      clearInterval(polling)
    }
  }, [api, session])

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.title}>Accounts</Text>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            tintColor="rgba(255,255,255, .35)"
            title="Refresh feed"
            titleColor="rgba(255,255,255, .25)"
            refreshing={refreshing}
            onRefresh={handleRefreshing}
          />
        }>
        <View style={styles.accountContainer}>
          {!!error && (
            <Text style={styles.errorText}>Unable to retrieve account info. {error}</Text>
          )}
          <View style={styles.accountFlex}>
            {accounts.map(account => (
              <AccountOpenTrade
                key={account.id}
                api={api}
                session={session}
                {...account}></AccountOpenTrade>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  mainContainer: {
    flex: 1,
    paddingTop: 30
  },
  title: {
    fontSize: 24,
    color: 'rgba(255,255,255, .7)',
    paddingTop: 24,
    paddingBottom: 12,
    paddingHorizontal: 24
  },
  accountContainer: {
    paddingHorizontal: 24
  },
  errorText: {
    paddingVertical: 12,
    fontSize: 12,
    textAlign: 'center',
    color: Colors.danger
  },
  accountFlex: {
    flexDirection: Platform.isPad ? 'row' : 'column',
    flexWrap: Platform.isPad ? 'wrap' : 'noWrap',
    marginHorizontal: Platform.isPad ? -12 : 0
  }
})
