import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import * as firebase from "firebase";

import App from './App';
import GameStore from './GameStore';

firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: 'mtg-life-counters.firebaseapp.com',
  databaseURL: 'https://mtg-life-counters.firebaseio.com/',
});

const store = new GameStore(firebase.database());

ReactDOM.render(
  <Provider store={ store }>
    <App />
  </Provider>, document.getElementById('root'));
