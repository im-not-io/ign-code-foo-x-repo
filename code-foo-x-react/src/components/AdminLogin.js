import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/functions";
import React, { useState, useEffect } from 'react';
import BetterButton from './BetterButton';
import ErrorBox from './ErrorBox';
import NavBar from './NavBar';
import SectionTitle from './SectionTitle';

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
  },
  mainGrid: {
    marginTop: "2rem"
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

    useEffect(() => {
      document.title = "Login"
    });


    function loginToFirebase() {
      setButtonState("loading");
      firebase.auth().signInWithEmailAndPassword(email, password).then(() =>  {
        window.location.href = '/admin-portal';
        console.log("successful sign in");
      })
      .catch(function(error) {
        // Handle Errors here.
        console.log(error);
        setErrorBoxText("Authentication failed. Please check email and password.");
        setShowErrorBox(true);
        setButtonState("normal");
      });
      // enforceRole();
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
        <Grid container justify="center">
            <Grid item xs={12}>
                <NavBar />
            </Grid>
            <Grid item container md={5} xs={10} className={classes.mainGrid}>
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