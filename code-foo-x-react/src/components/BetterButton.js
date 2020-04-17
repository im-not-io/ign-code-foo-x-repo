import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import "firebase/database";
import "firebase/auth";
import "firebase/functions";
import { Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';




const useStyles = makeStyles((theme) => ({
    button: {
      marginRight: "0.5rem",
      textTransform: "none"
    },
    pushRight: {
      marginLeft: "0.3rem"
    }
}));

function BetterButton(props) {
  const classes = useStyles();

  function getReloadFromSourceButton() {
    if (props.state === "loading") {
      return (<Button onClick={props.function} className={classes.button} variant="contained"  disabled={true} color="primary">
        Please wait..<CircularProgress className={classes.pushRight} color="secondary" size={16} thickness={5}/>
    </Button>)

    } else {
      return (<Button onClick={props.function} variant="contained" color="primary" className={classes.button}>
        {props.children}
      </Button>)

    }

  
  }

  return getReloadFromSourceButton();
}

export default BetterButton;
