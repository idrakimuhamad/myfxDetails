import { AsyncStorage } from 'react-native'
import Reactotron, { asyncStorage } from 'reactotron-react-native'
import apisaucePlugin from 'reactotron-apisauce'

Reactotron.setAsyncStorageHandler(AsyncStorage)
  .configure({
    name: 'MyFxDetails'
  })
  .use(asyncStorage())
  .use(apisaucePlugin())
  .useReactNative({
    networking: {
      // optionally, you can turn it off with false.
      ignoreUrls: /symbolicate/
    },
    errors: { veto: stackFrame => false } // or turn it off with false
  })
  .connect()

console.tron = Reactotron
