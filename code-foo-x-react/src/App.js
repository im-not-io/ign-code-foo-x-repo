import React from 'react';
import './App.css';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import LinksQuestCalculatorPage from './components/LinksQuestCalculatorPage';

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
 }
});




function App() {



  return (
    <ThemeProvider theme={theme}>
      <LinksQuestCalculatorPage fish="fish"/>
    </ThemeProvider>
   
  );
}

export default App;
