import React, { createContext } from 'react'
import { create } from 'apisauce'

const DEFAULT_API_CONFIG = {
  url: 'https://www.myfxbook.com/api',
  timeout: 10000
}
/**
 * Manages all requests to the API.
 */
export class Api {
  /**
   * Creates the api.
   *
   * @param config The configuration to use.
   */
  constructor(config = DEFAULT_API_CONFIG) {
    this.config = config
  }

  /**
   * Sets up the API.  This will be called during the bootup
   * sequence and will happen before the first React component
   * is mounted.
   *
   * Be as quick as possible in here.
   */
  setup() {
    // construct the apisauce instance
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout
      // headers: {
      //   Accept: 'application/json'
      // }
    })
  }

  /**
   * Logs into MyFxBook
   */
  async login(email, password) {
    // make the api call
    const response = await this.apisauce.get(`/login.json`, {
      email,
      password
    })
    // const response = await this.apisauce.get(`/login.json?email=${email}&password=${password}`)

    if (!response.ok) {
      return { kind: 'error' }
    }

    // transform the data into the format we are expecting
    try {
      return { kind: 'ok', session: response.data.session }
    } catch {
      return { kind: 'bad-data' }
    }
  }

  /**
   * Logout from MyFxBook
   */
  async logout(session) {
    // make the api call
    const response = await this.apisauce.get(`/logout.json`, {
      session
    })

    if (!response.ok) {
      return { kind: 'error' }
    }

    // transform the data into the format we are expecting
    try {
      console.log(response)

      return { kind: 'ok' }
    } catch {
      return { kind: 'bad-data' }
    }
  }

  /**
   * Get all of accounts
   */
  async getAllAccounts(session) {
    // make the api call
    const response = await this.apisauce.get(`/get-my-accounts.json`, {
      session
    })

    if (!response.ok) {
      return { kind: 'error' }
    }

    // transform the data into the format we are expecting
    try {
      return { kind: 'ok', accounts: response.data.accounts }
    } catch {
      return { kind: 'bad-data' }
    }
  }

  /**
   * Get account open trade
   * @param {String} session Session ID
   * @param {string} id AccountID
   */
  async getOpenTrades(session, id) {
    // make the api call
    const response = await this.apisauce.get(`/get-open-trades.json?session=${session}&id=${id}`)

    if (!response.ok) {
      return { kind: 'error' }
    }

    // transform the data into the format we are expecting
    try {
      return { kind: 'ok', trades: response.data.openTrades }
    } catch {
      return { kind: 'bad-data' }
    }
  }

  /**
   *
   * @param {String} session Session ID
   * @param {String} id Account ID
   * @param {Date} start Start date (yyyy-MM-dd)
   * @param {Date} end End date (yyyy-MM-dd)
   */
  async getWeekGain(session, id, start, end) {
    // make the api call
    const response = await this.apisauce.get(
      `/get-gain.json?session=${session}&id=${id}&start=${start}&end=${end}`
    )

    if (!response.ok) {
      return { kind: 'error' }
    }

    // transform the data into the format we are expecting
    try {
      console.log(response)

      return { kind: 'ok', gain: response.data.value }
    } catch {
      return { kind: 'bad-data' }
    }
  }
}

export const ApiContext = createContext({
  api: Api
})
