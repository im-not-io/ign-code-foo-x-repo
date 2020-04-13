import React from 'react';
import './App.css';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import DrawingBoard from './components/DrawingBoard';
import Grid from '@material-ui/core/Grid';
import { Container } from '@material-ui/core';
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import LinksQuestCalculatorPage from './components/LinksQuestCalculatorPage';
import AdminPage from './components/AdminPage';
import PollsPage from './components/PollsPage';



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

function Home() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}


function App() {
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
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
   
  );
}

export default App;
