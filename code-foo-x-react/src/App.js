import React from 'react';
import logo from './logo.svg';
import './App.css';
import NavBar from './components/NavBar';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { orange } from '@material-ui/core/colors';
import * as d3 from "d3";
import BarChart from './components/BarChart';

const theme = createMuiTheme({
  palette: {
    primary: {
       light: '#fff',
       main: '#BF1313',
       dark: '#000'
    },
    secondary: {
      main: '#f44336',
    },
 }
});

function setupD3() {

}

function App() {

  setupD3();
  return (
    <ThemeProvider theme={theme}>
      <NavBar />
      <BarChart data={[5,10,1,3,20,5]} width={500} height={500}/>
    </ThemeProvider>
  );
}

export default App;
