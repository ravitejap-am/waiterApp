/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';


import {Provider} from 'react-redux';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import MainNavigator from './src/navigation/MainNavigator';

import {store, persistor} from './src/storage/store';
import {PersistGate} from 'redux-persist/integration/react';


function App(): React.JSX.Element {
 

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <SafeAreaProvider>
          <MainNavigator />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>

  );
}



export default App;
