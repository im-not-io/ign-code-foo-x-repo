import React from 'react'
import NavBar from './NavBar';
import Grid from '@material-ui/core/Grid';
import BestQuestsGraph from './BestQuestsGraph';
import PageTitle from './PageTitle';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useEffect, useState } from 'react';
import axios from 'axios';
import BestQuestsTable from './BestQuestsTable';
import * as firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import "firebase/functions";
import { Button, Box, Container } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grow from '@material-ui/core/Grow';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import ReplayIcon from '@material-ui/icons/Replay';
import ModifySourceDialog from './ModifySourceDialog'
import SectionTitle from './SectionTitle'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { red } from '@material-ui/core/colors';
import Link from '@material-ui/core/Link';
import BetterButton from './BetterButton';
import ErrorBox from './ErrorBox';



const useStyles = makeStyles((theme) => ({
  card: {
    padding: "1.15em",
  },
  forgotPasswordArea: {
    marginTop: "1rem",
    cursor: "pointer"
  },
  signInArea: {
    marginTop: "-0.5rem"
  },
    underline: {
        '&:after': {
          borderBottom: `2px solid #FFFFFF`,
        },
        '&$focused:after': {
          borderBottomColor: `#FFFFFF`,
        },
        '&$error:after': {
          borderBottomColor: `#FFFFFF`,
        },
        '&:before': {
          borderBottom: `1px solid #FFFFFF`,
        },
        '&:hover:not($disabled):not($focused):not($error):before': {
          borderBottom: `2px solid #FFFFFF`,
        },
        '&$disabled:before': {
          borderBottom: `1px dotted #FFFFFF`,
        },
      },
}));






function AdminLogin(props) {
    const classes = useStyles();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showErrorBox, setShowErrorBox] = useState(false);
    const [errorBoxText, setErrorBoxText] = useState("Login error.");
    const [buttonState, setButtonState] = useState("normal");
    const [forgotPasswordText, setForgotPasswordText] = useState("Forgot password?");
    const [userManagementAreaShown, setUserManagementAreaShown] = useState(false);

    function loginToFirebase() {
      setButtonState("loading");
      firebase.auth().signOut();
      firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error);
        setErrorBoxText("Authentication failed. Please check email and password.");
        setShowErrorBox(true);
        setButtonState("normal");

      });
      enforceRole();
  }

  function enforceRole() {
    if ("enforceRole" in props) {
      firebase.auth().onAuthStateChanged(function(user) {
        if (firebase.auth().currentUser != null) {
          var userId = firebase.auth().currentUser.uid;
          console.log('/users/' + userId + "/role");
          return firebase.database().ref('/users/' + userId + "/role").once("value").then(function(snapshot) {
            const role = snapshot.val();
            if (role === props.enforceRole) {
              console.log("Role is valid.", role, props.enforceRole)
              setShowErrorBox(false);
              setButtonState("normal");
            } else {
              console.log("Role is NOT valid.", role, props.enforceRole)
              setErrorBoxText("This functionality requires an " + props.enforceRole + " account.");
              setShowErrorBox(true);
              setButtonState("normal");
            }
          });
        }
      });

    }

  }


  function handleEmailFieldChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordFieldChange(event) {
    setPassword(event.target.value);
  }

  function handleKeydown(event) {
    if (event.keyCode === 13) {
      loginToFirebase();
    }

  }

  function sendResetPasswordEmail() {

    firebase.auth().sendPasswordResetEmail(email).then(function() {
      console.log("Email sent");
      setForgotPasswordText("Password reset email successfully sent! Resend.")
    }).catch(function(error) {
      console.log(error);
      setErrorBoxText("Failed to send reset email. Please check email.");
      setShowErrorBox(true);
    });
  }



    return (
    <Grow in={props.show} timeout={500} unmountOnExit={true}>
      <Card className={classes.card}> 
          <CardContent>
          <SectionTitle>Please login to access the admin portal</SectionTitle>
          <form noValidate autoComplete="off" onKeyDown={handleKeydown}>
              <TextField label="Email" onChange={handleEmailFieldChange} fullWidth/>
              <TextField label="Password" onChange={handlePasswordFieldChange} type="password" fullWidth/>
          </form>
          </CardContent>
          <CardActions>
          <Grid container spacing={0}>
            <Grid item xs={12} className={classes.signInArea}>
              <BetterButton state={buttonState} ariant="contained" color="primary" function={loginToFirebase}>Sign in</BetterButton>
            </Grid>
            <Grid item xs={12} className={classes.forgotPasswordArea}>
              <Link onClick={sendResetPasswordEmail}>{forgotPasswordText}</Link>
            </Grid>

            <ErrorBox show={showErrorBox}>{errorBoxText}</ErrorBox>


          </Grid>
        </CardActions>
        </Card>
      </Grow>);

}
export default AdminLogin;