import React, { useEffect, useState } from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'
import dayjs from 'dayjs'
import 'dayjs/locale/en-SG'

export default function AccountOpenTrade({
  api,
  id,
  name,
  currency,
  balance,
  equity,
  profit,
  lastUpdateDate,
  session
}) {
  const [trades, setTrades] = useState([])
  const [weeklyGain, setweeklyGain] = useState(0)

  const getOpenTrade = async () => {
    if (api) {
      const request = await api.getOpenTrades(session, id)

      if (request.kind === 'ok') {
        console.log(` `)
        console.log(` `)
        console.log(`=====Account ${name}: ${id}======`)
        console.log(`Trades retrieved...`)
        console.log(request.trades)
        setTrades(request.trades)
      }
    }
  }

  const calculateTotalPL = () => {
    const total = trades.reduce((m, trade) => m + trade.profit, 0)
    return (
      <Text>
        {total} {currency}
      </Text>
    )
  }

  const currentWeekGain = async () => {
    if (api) {
      // const today = dayjs()
      // const todayInNumber = parseInt(today.format('d'))
      const startOfWeek = dayjs()
        .startOf('week')
        .format('YYYY-MM-DD')
      const endOfWeek = dayjs()
        .endOf('week')
        .format('YYYY-MM-DD')
      // const startOfWeek =
      //   todayInNumber > 0
      //     ? today.subtract(todayInNumber - (todayInNumber - 1), 'day').format('YYYY-MM-DD')
      //     : today.subtract(6, 'day').format('YYYY-MM-DD')
      // const endOfWeek =
      //   todayInNumber > 0
      //     ? today.add(7 - todayInNumber, 'day').format('YYYY-MM-DD')
      //     : today.format('YYYY-MM-DD')

      const request = await api.getWeekGain(session, id, startOfWeek, endOfWeek)

      if (request.kind === 'ok') {
        console.log(`Current week gain retrieved...${request.gain}`)
        setweeklyGain(request.gain)
      }
    }
  }

  useEffect(() => {
    getOpenTrade()
    currentWeekGain()
  }, [session, id])

  return (
    <View>
      <Text>{name}</Text>
      <View>
        {!trades.length ? (
          <Text>No open trade.</Text>
        ) : (
          <Text>Current float: {calculateTotalPL()}</Text>
        )}
        <View>
          <Text>
            Balance: {balance} {currency}
          </Text>
          <Text>
            Equity: {equity} {currency}
          </Text>
          <Text>
            Total Profit: {profit} {currency}
          </Text>
          <Text>This week gain: {weeklyGain.toFixed(2)} %</Text>
          <Text>Updated on: {lastUpdateDate}</Text>
        </View>
      </View>
    </View>
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
    paddingTop: 30
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20
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
  }
})
