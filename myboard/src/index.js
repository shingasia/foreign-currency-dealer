import React from 'react';
import ReactDOM from 'react-dom/client';
import store from './redux/store';
import App from './App';


import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
export let persistor = persistStore(store);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <Provider store = {store} >
            <PersistGate loading={null} persistor={persistor} >
                <App />
            </PersistGate>
        </Provider>
    </React.StrictMode>
);

