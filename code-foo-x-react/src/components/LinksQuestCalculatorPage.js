import React from 'react'
import NavBar from './NavBar';
import Grid from '@material-ui/core/Grid';
import BestQuestsGraph from './BestQuestsGraph';
import PageTitle from './PageTitle';
import { makeStyles } from '@material-ui/core/styles';
import { useEffect, useState } from 'react';
import BestQuestsTable from './BestQuestsTable';
import * as firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import "firebase/functions";
import ErrorBox from './ErrorBox'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import ReplayIcon from '@material-ui/icons/Replay';
import ModifySourceDialog from './ModifySourceDialog'
import BetterButton from './BetterButton';





  


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
      marginRight: "1rem"
    },
    circleProgress: {
      marginLeft: '0.5em'
    },
    marginLeft: {
      marginLeft: "0.25rem"
    }
  }));





function LinksQuestCalculatorPage(props) {

const classes = useStyles();
  const CODE_FOO_QUESTS_URL = "https://media.ignimgs.com/code-foo/2020/files/quests_for_question.pdf";
  const [questCalculatorResult, setQuestCalculatorResult] = useState(null);
  const [reloadFromSourceButtonState, setReloadFromSourceButtonState] = useState("normal");
  const [dataReloadErrorExists, setDataReloadErrorExists] = useState(false);
  const [modifySourceDialogOpen, setModifySourceDialogOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(CODE_FOO_QUESTS_URL);

  useEffect(() => {
    document.title = "Link's Quest Calculator";
    listenForFirebaseUpdates();
    fetchDataIfEmpty();
  }, []);

  function toggleDialog() {
    setModifySourceDialogOpen(!modifySourceDialogOpen);
  }

    function listenForFirebaseUpdates() {
      var ref = firebase.database().ref('questCalculatorResult/');
      ref.on('value', function(snapshot) {
        setQuestCalculatorResult(snapshot.val())
      });
    }
  function saveQuestCalculatorResultToFirebase(result) {


    let resultObject = result;

    resultObject.timestamp = (new Date()).getTime();

    firebase.database().ref('questCalculatorResult/').set(resultObject).catch(function(error) {
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
    const targetUrl = "https://us-central1-code-foo-x-firebase.cloudfunctions.net/calculateBestQuests?" + "url=" + pdfUrl;
    console.log("using target URL", targetUrl);
    deleteQuestCalculatorResult();
    fetch(encodeURI(targetUrl))
    .then(
      function(response) {
        if (response.status !== 200) {
          console.log('Fetch data failed.');
          setReloadFromSourceButtonState("normal");
        }
        
        // Examine the text in the response
        response.json().then(function(data) {
          console.log(data);
          if (data.hasOwnProperty("error")) {
            setDataReloadErrorExists(true);
          } else {
            saveQuestCalculatorResultToFirebase(data);
            setReloadFromSourceButtonState("normal");
          }

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
    firebase.database().ref("/questCalculatorResult").once("value")
    .then(function(snapshot) {
      if (!snapshot.exists()) {
        fetchQuestCalculatorResult();
      }
  });
}


function getBestQuestPath() {
  if (questCalculatorResult === null) {
    return null;
  } else {
    return questCalculatorResult.maxPath;
  }
}

function timestampToString(timestamp) {
  console.log("timestamp to string")
    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const d = new Date(timestamp);
  return (monthNames[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear() + " " + d.toLocaleTimeString());
}

function getQuestCalculatorTimestamp() {
  if (questCalculatorResult) {
    return "Date last updated: "+ timestampToString(questCalculatorResult.timestamp)
  } else {
    return "";
  }
}

    return (<Grid container spacing={0} justify="center">
            <Grid item xs={12}>
                <NavBar />
            </Grid>
             <Grid container item xs={10} spacing={3}>
               
              <Grid item xs={12}>
                <PageTitle title="Most lucrative quest sequence"/>
                  <BestQuestsTable quests={ getBestQuestPath() }/>
              </Grid> 
            
              <Grid item xs={12}>
                  <PageTitle title="All possible quest paths"/>
                  <p className={classes.instructionText}>Drag a node to drag it around to see things better.</p>
                  <BestQuestsGraph questCalculatorResult={questCalculatorResult}/>
              </Grid> 
                
              <Grid container item xs={12} alignItems="center">
                <Grid item xs={12}>
                  <p className={classes.instructionText}>{getQuestCalculatorTimestamp()}</p>
                  <BetterButton state={reloadFromSourceButtonState} function={fetchQuestCalculatorResult}>Reload from source<ReplayIcon className={classes.marginLeft}/></BetterButton>
                  <BetterButton state={reloadFromSourceButtonState} function={toggleDialog}><MoreHorizIcon /></BetterButton>
                </Grid>
                  <Grid item>
                    <ErrorBox message="The server isn't feeling well right now. Please try again later."/>
                  </Grid>
              </Grid> 
            </Grid>
            <ModifySourceDialog isOpen={modifySourceDialogOpen} handleClose={toggleDialog} pdfUrl={pdfUrl} setPdfUrl={setPdfUrl}/>
        </Grid>);

}
export default LinksQuestCalculatorPage;