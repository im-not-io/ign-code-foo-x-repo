import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import NavBar from './components/NavBar';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { orange } from '@material-ui/core/colors';
import * as d3 from "d3";
import LinksQuestCalculatorPage from './components/LinksQuestCalculatorPage';
import pdfjsLib from 'pdfjs-dist';
import * as glib from 'graphlib';
import { useEffect } from 'react';



const sizes = {
  mobile: 600,
  mobileContentLength: 1000
}


const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#fff',
      main: '#BF1313',
      dark: '#000'
    },
    secondary: {
      main: '#adadad',
      dark: '#4a4a4a'
    },
 },
 typography: {
  fontFamily: "Verdana, sans-serif"
},
});

function getIdealContainerWidth() {

  return window.innerWidth < sizes.mobile ? sizes.mobileContentLength : window.innerWidth;
}

function getIdealContainerHeight() {
  return (window.innerHeight/3)*2;
}





function App() {



  return (
    <ThemeProvider theme={theme}>
      <LinksQuestCalculatorPage />
    </ThemeProvider>
   
  );
}

export default App;
