import React, { useEffect } from 'react';
import './App.css';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import LinksQuestCalculatorPage from './components/LinksQuestCalculatorPage';
import AdminPage from './components/AdminPage';
import PollsPage from './components/PollsPage';
import AdminLogin from './components/AdminLogin';
import * as firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import "firebase/functions";



const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#fff',
      main: '#BF1313',
      dark: '#8a1b13'
    },
    secondary: {
      main: '#ffffff',
      dark: '#4a4a4a',
      light: '#f5f5f5'
    },
 },
 overrides: {
    MuiInput: {
      underline: {
        color: "#4a4a4a",
        "&:not(.Mui-disabled):hover::before": {
          borderColor: "#BF1313"
        }
      }
    }
  }
});

function getRoute() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log("user signed in");
      return <Redirect to="/admin-portal" />
    } else {
      console.log("user not signed in")
      return <Redirect to="/login" />
    }
  });
}


function App() {
  useEffect(() => {
    getRoute();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Switch>
          <Route exact path={["/", "/polls"]}>
            <PollsPage />
          </Route>
          <Route path="/quest-calculator">
            <LinksQuestCalculatorPage />
          </Route>
          <Route path="/admin-portal">
            <AdminPage />
          </Route>
          <Route path="/login">
            <AdminLogin enforceRole={"administrator"}/>
          </Route>
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
   
  );
}

export default App;
