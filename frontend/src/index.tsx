import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { DAppProvider, Config } from '@usedapp/core';
import { Provider } from 'react-redux';
import { store } from './store';

const config: Config = {  
  readOnlyChainId: 10226688,
  readOnlyUrls: {
    [10226688]: "https://rpc1.testnet.yarchain.org"
  },
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <DAppProvider config={config}>
      <Provider store={store}>
        <App />
      </Provider>
    </DAppProvider>
  </React.StrictMode>
);
