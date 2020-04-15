import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as firebase from "firebase/app";

var firebaseConfig = {
  apiKey: "AIzaSyDrlRLAzlG_qAF5RzrY-HBTd4y6sDcwrzY",
  authDomain: "code-foo-x-firebase.firebaseapp.com",
  databaseURL: "https://code-foo-x-firebase.firebaseio.com",
  projectId: "code-foo-x-firebase",
  storageBucket: "code-foo-x-firebase.appspot.com",
  messagingSenderId: "82570174117",
  appId: "1:82570174117:web:8047c9987f9700d0f4774c"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
