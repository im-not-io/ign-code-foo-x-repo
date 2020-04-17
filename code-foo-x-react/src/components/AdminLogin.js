import React from 'react'
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { useState, useEffect } from 'react';
import * as firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import "firebase/functions";
import SectionTitle from './SectionTitle'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import BetterButton from './BetterButton';
import ErrorBox from './ErrorBox';
import Grow from '@material-ui/core/Grow';
import NavBar from './NavBar';

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
  standardColor: {
    color: theme.palette.secondary.dark
  }
}));






function AdminLogin(props) {
    const classes = useStyles();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showErrorBox, setShowErrorBox] = useState(false);
    const [errorBoxText, setErrorBoxText] = useState("Login error.");
    const [buttonState, setButtonState] = useState("normal");
    const [forgotPasswordText, setForgotPasswordText] = useState("Forgot password?");
    const [isLoggedIn, setIsLoggedIn] = useState(false);


    function loginToFirebase() {
      setButtonState("loading");
      firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        console.log(error);
        setErrorBoxText("Authentication failed. Please check email and password.");
        setShowErrorBox(true);
        setButtonState("normal");

      });
      enforceRole();
  }

  function enforceRole() {
    if ("enforceRole" in props) {
      // firebase.auth().signOut();
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          console.log("user is logged in");
          var userId = firebase.auth().currentUser.uid;
          console.log('/users/' + userId + "/role");
          return firebase.database().ref('/users/' + userId + "/role").once("value").then(function(snapshot) {
            const role = snapshot.val();
            if (role === props.enforceRole) {
              console.log("Role is valid.", role, props.enforceRole)
              window.location.href = '/admin-portal';
            } else {
              console.log("Role is NOT valid.", role, props.enforceRole)
              setErrorBoxText("This functionality requires an " + props.enforceRole + " account.");
              setShowErrorBox(true);
              setButtonState("normal");
            }
          });
        } else {
          setIsLoggedIn(false);
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
        <Grid container spacing={5} justify="center">
            <Grid item xs={12}>
                <NavBar />
            </Grid>
            <Grid item container xs={6}>
                <Grid item md={12} xs={12} className={classes.marginBottom}>
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
                <BetterButton state={buttonState} variant="contained" color="primary" function={loginToFirebase}>Sign in</BetterButton>
              </Grid>
              <Grid item xs={12} className={classes.forgotPasswordArea}>
                <Link onClick={sendResetPasswordEmail}>{forgotPasswordText}</Link>
              </Grid>
              <Grid item xs={12} className={classes.forgotPasswordArea}>
                <ErrorBox show={showErrorBox}>{errorBoxText}</ErrorBox>
              </Grid>
            </Grid>
          </CardActions>
          </Card>
                </Grid>
            </Grid>

        </Grid>
      );
  


}
export default AdminLogin;