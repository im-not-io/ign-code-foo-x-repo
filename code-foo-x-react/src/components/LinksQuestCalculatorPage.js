import React from 'react'
import NavBar from './NavBar';
import Grid from '@material-ui/core/Grid';
import BestQuestsGraph from './BestQuestsGraph';
import PageTitle from './PageTitle';
import { makeStyles } from '@material-ui/core/styles';
import { useEffect, useState } from 'react';
import axios from 'axios';
import BestQuestsTable from './BestQuestsTable';
import * as firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import "firebase/functions";
import { Button, Box } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import ErrorBox from './ErrorBox'
import Grow from '@material-ui/core/Grow';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import ReplayIcon from '@material-ui/icons/Replay';
import ModifySourceDialog from './ModifySourceDialog'




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
  


const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    spacer: {
        flexGrow: 1
    },
    image: {
      height: "2em"
    },
    instructionText: {
        color: theme.palette.secondary.dark,
        fontStyle: "italic"
    },
    button: {
      fontSize: "1em",
      fontWeight: 450,
      textTransform: "none",
      marginRight: "0.5rem"
    },
    circleProgress: {
      marginLeft: '0.5em'
    },
    buttonDisabled: {
      textTransform: "none",
      marginRight: "0.5rem"
    },
    replayIcon: {
      marginRight: "0.25rem"
    }
  }));





function LinksQuestCalculatorPage(props) {

const classes = useStyles();
  const [questCalculatorResult, setQuestCalculatorResult] = useState(null);
  const [reloadFromSourceButtonState, setReloadFromSourceButtonState] = useState("normal");
  const [dataReloadErrorExists, setDataReloadErrorExists] = useState(false);
  const [modifySourceDialogOpen, setModifySourceDialogOpen] = useState(false);

  useEffect(() => {


    firebase.auth().signInAnonymously().catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage)
      });
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          
          console.log("login OK");
          //read Firebase data and load questCalculatorResult into state

          listenForFirebaseUpdates();
          fetchDataIfEmpty();
        } else {
          // User is signed out.
          // ...
        }
        // ...
      });
  }, []);

  function toggleDialog() {
    console.log("toggle dialog");
    setModifySourceDialogOpen(!modifySourceDialogOpen);
  }

    function listenForFirebaseUpdates() {
      var ref = firebase.database().ref('questCalculatorResult/');
      ref.on('value', function(snapshot) {
        setQuestCalculatorResult(snapshot.val())
      });
    }
  function saveQuestCalculatorResultToFirebase(result) {
    firebase.database().ref('questCalculatorResult/').set(result).catch(function(error) {
      setDataReloadErrorExists(true);
      console.log(error);
    });
  }

  function deleteQuestCalculatorResult() {
    firebase.database().ref('questCalculatorResult/').remove().then(function() {
      console.log("Document successfully deleted!");
  }).catch(function(error) {
      console.error("Error delete failure", error);
  });
  }

  function fetchQuestCalculatorResult() {
    setReloadFromSourceButtonState("loading");
    deleteQuestCalculatorResult();
    fetch('http://localhost:5000/code-foo-x-firebase/us-central1/calculateBestQuests')
    .then(
      function(response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }
        
        // Examine the text in the response
        response.json().then(function(data) {
          console.log(data);
          saveQuestCalculatorResultToFirebase(data)
          setReloadFromSourceButtonState("normal");
        });
      }
    )
    .catch(function(err) {
      console.log('Fetch data failed.');
      setReloadFromSourceButtonState("normal");
      setDataReloadErrorExists(true);
    });
  }

  function fetchDataIfEmpty() {
    var ref = firebase.database().ref("/questCalculatorResult").once("value")
    .then(function(snapshot) {
      if (!snapshot.exists()) {
        fetchQuestCalculatorResult();
      }
  });
}

function getReloadFromSourceButton() {
  if (reloadFromSourceButtonState === "loading") {
    return (
      <Button variant="contained"  disabled={true} color="primary" className={classes.buttonDisabled}>
          Please wait...<CircularProgress className={classes.circleProgress} color="secondary" size={16} thickness={5}/>
      </Button>
      )
  } else {
    return (
      <Button variant="contained" onClick={fetchQuestCalculatorResult} color="primary" className={classes.button}>
          <span className={classes.replayIcon}>Reload from source</span><ReplayIcon />
      </Button>
      )
  }

}

function getBestQuestPath() {
  if (questCalculatorResult === null) {
    return null;
  } else {
    return questCalculatorResult.maxPath;
  }
}



console.log("qc result", questCalculatorResult)
    return (<Grid container spacing={0} justify="center">
            <Grid item xs={12}>
                <NavBar />
            </Grid>
             <Grid container item xs={10} spacing={3}>
               
              <Grid item xs={12}>
                <PageTitle title="Most lucrative quest sequence"/>
                  <BestQuestsTable quests={ getBestQuestPath() } />
              </Grid> 
            
              <Grid item xs={12}>
                  <PageTitle title="All possible quest paths"/>
                  <p className={classes.instructionText}>Drag a node to drag it around to see things better.</p>
              </Grid> 
                
              <Grid container item xs={12} alignItems="center">
                <Grid item xs={12}>
                  <p className={classes.instructionText}>Data last loaded April 3, 2020, 5:00PM PST</p>
                  {getReloadFromSourceButton()}
                  <Button variant="contained" color="primary" onClick={toggleDialog} className={classes.button}><MoreHorizIcon /></Button>
                </Grid>
                <Grow in={dataReloadErrorExists}>
                  <Grid item>
                    <ErrorBox message="The server isn't feeling well right now. Please try again later."/>
                  </Grid>
                </Grow>
              </Grid> 
            </Grid>
            <ModifySourceDialog isOpen={modifySourceDialogOpen} handleClose={toggleDialog}/>
        </Grid>);

}
export default LinksQuestCalculatorPage;