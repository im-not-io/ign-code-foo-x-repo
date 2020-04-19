import React, { useEffect } from 'react'
import NavBar from './NavBar';
import Grid from '@material-ui/core/Grid';
import { useState } from 'react';
import * as firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import "firebase/functions";
import UserManagementArea from './UserManagementArea';
import { makeStyles } from '@material-ui/core/styles';
import SignOutArea from './SignOutArea';


const useStyles = makeStyles((theme) => ({
  error: {
      backgroundColor: "#ffd8d6",
      fontWeight: 450,
      color: theme.palette.primary.main,
      padding: "1rem",
      borderRadius: "0.5rem"
  },
  cancelIcon: {
      marginRight: "0.5em"
  },
  errorBox: {
      marginTop: "1rem",
      marginBottom: "1rem"
  },
  marginBottom: {
    marginBottom: "2rem"
  },
  accountCircle: {
      color: theme.palette.secondary.dark
  }
}));

function AdminPage(props) {
  const classes = useStyles();
  // const [isLoginAreaShown, setIsLoginAreaShown] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function(user) {
      if (!user) {
        setIsLoggedIn(false);
        window.location.href = "/login";
      } else {
        setIsLoggedIn(true);
      }
    });
  });


    return (<Grid container spacing={5} justify="center">
            <Grid item xs={12}>
                <NavBar />
            </Grid>
            <Grid item container xs={6}>
                <Grid item md={12} xs={12} className={classes.marginBottom}>
                  <UserManagementArea show={isLoggedIn}/>
                </Grid>
                <Grid item md={12} xs={12} className={classes.marginBottom}>
                  <SignOutArea show={isLoggedIn} />
                </Grid>
            </Grid>

        </Grid>);

}
export default AdminPage;

