import React, { useEffect, useState } from 'react'
import { Platform, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import dayjs from 'dayjs'
import 'dayjs/locale/en-SG'
import relativeTime from 'dayjs/plugin/relativeTime'
import Colors from '../constants/Colors'

dayjs.extend(relativeTime)

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
        setTrades(request.trades)
      }
    }
  }

  const calculateTotalPL = () => {
    if (trades && !trades.length) return <Text style={styles.float}>0.00 {currency}</Text>
    const total = trades.reduce((m, trade) => m + trade.profit, 0)
    return (
      <Text
        style={{
          ...styles.float,
          color: total < 0 ? Colors.danger : Colors.success
        }}>
        {total > 0 ? '+' : ''}
        {total.toFixed(2)} {currency}
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
    <TouchableOpacity style={styles.accountCard}>
      <View style={styles.accountCardInner}>
        <View
          style={styles.cardRow}
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-start">
          <Text style={styles.accountName} numberOfLines={1}>
            {name}
          </Text>
          <View style={styles.cardRight} alignItems="flex-end">
            {calculateTotalPL()}
          </View>
        </View>
        <View
          style={styles.cardRow}
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-start">
          <Text style={styles.balance}>Balance / Equity</Text>
          <Text style={styles.balance}>
            {balance} / {equity} {currency}
          </Text>
        </View>
        <View
          style={styles.cardRow}
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-start">
          <Text style={styles.balance}>Profit</Text>
          <Text
            style={{
              ...styles.balance,
              color:
                parseFloat(profit) >= 1
                  ? Colors.success
                  : parseFloat(profit) < 0
                  ? Colors.danger
                  : 'rgba(255,255,255, .25)'
            }}>
            {parseFloat(profit) > 0 ? '+' : ''}
            {profit} {currency}
          </Text>
        </View>
        <View
          style={styles.cardRow}
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-start">
          <Text style={styles.balance}>Week's gain</Text>
          <Text
            style={{
              ...styles.balance,
              color:
                weeklyGain >= 1
                  ? Colors.success
                  : weeklyGain < 0
                  ? Colors.danger
                  : 'rgba(255,255,255, .25)'
            }}>
            {weeklyGain > 0 ? '+' : ''}
            {weeklyGain.toFixed(2)} %
          </Text>
        </View>
        <View style={styles.updateTimeContainer}>
          <Text style={styles.updateTimeText}>
            Updated{' '}
            {dayjs(lastUpdateDate)
              .add(dayjs().utcOffset(), 'minute')
              .fromNow()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  accountCard: {
    paddingBottom: Platform.isPad ? 24 : 12,
    paddingHorizontal: Platform.isPad ? 12 : 0,
    width: Platform.isPad ? `${100 / 3}%` : '100%'
  },
  accountCardInner: {
    backgroundColor: 'rgba(255,255,255, .025)',
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0, .15)',
    padding: 16
  },
  accountName: {
    flex: 0.5,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'rgba(255,255,255, .7)'
  },
  float: {
    fontSize: 20,
    color: 'rgba(255,255,255, .25)'
  },
  cardRow: {
    paddingVertical: 4
  },
  cardRight: {
    flex: 0.5
  },
  balance: {
    fontSize: Platform.isPad ? (100 / 3 / 100) * 32 : 14,
    color: 'rgba(255,255,255, .25)'
  },
  updateTimeContainer: {
    paddingTop: 8
  },
  updateTimeText: {
    fontSize: Platform.isPad ? (100 / 3 / 100) * 28 : 14,
    color: 'rgba(255,255,255, .15)'
  }
})
