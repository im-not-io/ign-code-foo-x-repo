import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import ReplayIcon from '@material-ui/icons/Replay';
import SettingsIcon from '@material-ui/icons/Settings';
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/functions";
import React, { useEffect, useState } from 'react';
import BestQuestsGraph from './BestQuestsGraph';
import BestQuestsTable from './BestQuestsTable';
import BetterButton from './BetterButton';
import ErrorBox from './ErrorBox';
import ModifySourceDialog from './ModifySourceDialog';
import NavBar from './NavBar';
import PageTitle from './PageTitle';
import SectionTitle from './SectionTitle';



  


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
  const [questCalculatorResult, setQuestCalculatorResult] = useState(null);
  const [reloadFromSourceButtonState, setReloadFromSourceButtonState] = useState("normal");
  const [modifySourceDialogOpen, setModifySourceDialogOpen] = useState(false);

  useEffect(() => {
    document.title = "Link's Quest Calculator";
    listenForFirebaseUpdates();
    //listenForFirebaseQuestUrlChange();
  }, []);

  // useEffect(() => {
  //   fetchQuestCalculatorResult();
  // }, [pdfUrl]);

  useEffect(() => {
    fetchDataIfEmpty();
  });


  function toggleDialog() {
    if (modifySourceDialogOpen === true) {
      fetchQuestCalculatorResult();
    }
    setModifySourceDialogOpen(!modifySourceDialogOpen);
  }

    function listenForFirebaseUpdates() {
      var ref = firebase.database().ref('questCalculatorResult/');
      ref.on('value', function(snapshot) {
        console.log("snap");
        console.log(snapshot.val());
        setQuestCalculatorResult(snapshot.val())
      });
    }


  function fetchQuestCalculatorResult() {
    setReloadFromSourceButtonState("loading");
    // deleteQuestCalculatorResult();
    //http://localhost:5000/code-foo-x-firebase/us-central1/calculateBestQuests
    //https://us-central1-code-foo-x-firebase.cloudfunctions.net/calculateBestQuests
    fetch("https://us-central1-code-foo-x-firebase.cloudfunctions.net/calculateBestQuests")
    .then(
      function(response) {
        if (response.status !== 200) {
          console.log('Fetch data failed.');
          setReloadFromSourceButtonState("normal");
        }
        
        //Examine the text in the response
        response.json().then(function(data) {
          
          if (data.hasOwnProperty("error")) {
          } else {
            console.log("data is ready", data);
            setReloadFromSourceButtonState("normal");
          }

        });
      }
    )
    .catch(function(err) {
      console.log('Fetch data failed.');
      setReloadFromSourceButtonState("normal");
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
    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const d = new Date(timestamp);
  return (monthNames[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear() + " " + d.toLocaleTimeString());
}

function getQuestCalculatorTimestamp() {
  if (questCalculatorResult) {
    return "Date last updated: "+ timestampToString(questCalculatorResult.creationTimeMilliseconds)
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
                <PageTitle>Quest calculator</PageTitle>
                <SectionTitle>Most lucrative quest sequence</SectionTitle>
              </Grid> 
              <Grid item xs={12}>
                  <BestQuestsTable quests={ getBestQuestPath() }/>
              </Grid> 
            
              <Grid item xs={12}>
                  <SectionTitle>All possible quest paths</SectionTitle>
                  <p className={classes.instructionText}>Drag a node to drag it around to see things better.</p>
                  <BestQuestsGraph questCalculatorResult={questCalculatorResult}/>
              </Grid> 
                
              <Grid container item xs={12} alignItems="center">
                <Grid item xs={12}>
                  <p className={classes.instructionText}>{getQuestCalculatorTimestamp()}</p>
                  <BetterButton state={reloadFromSourceButtonState} function={fetchQuestCalculatorResult}>Reload from source<ReplayIcon className={classes.marginLeft}/></BetterButton>
                  <BetterButton function={toggleDialog}>Modify data source<SettingsIcon className={classes.marginLeft}/></BetterButton>
                </Grid>
                  <Grid item>
                    <ErrorBox message="The server isn't feeling well right now. Please try again later."/>
                  </Grid>
              </Grid> 
            </Grid>
            <ModifySourceDialog isOpen={modifySourceDialogOpen} handleClose={toggleDialog}/>
        </Grid>);

}
export default LinksQuestCalculatorPage;