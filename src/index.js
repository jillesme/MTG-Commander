import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import * as firebase from "firebase";

import './index.css';
import App from './App';
import GameStore from './GameStore';
import registerServiceWorker from './registerServiceWorker';

// TODO move this into ENV variables
firebase.initializeApp({
  apiKey: 'AIzaSyBllPYr91TF1-xg4RsrWlq5xOA6FWFWPO8',
  authDomain: 'mtg-life-counters.firebaseapp.com',
  databaseURL: 'https://mtg-life-counters.firebaseio.com/',
});

const store = new GameStore(firebase.database());

window.db = firebase.database();

ReactDOM.render(<Provider store={ store }><App /></Provider>, document.getElementById('root'));
registerServiceWorker();
