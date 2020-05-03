import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/functions";
import React, { useEffect, useState } from 'react';
import GraphCalculatorDatasets from './GraphCalculatorDatasets';
import NavBar from './NavBar';
import SignOutArea from './SignOutArea';
import UserManagementArea from './UserManagementArea';
import DeletePollArea from './DeletePollArea';


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
  },
  padTopBottom: {
    paddingTop: "1.5rem",
    paddingBottom: "1rem"
  }
}));

function AdminPage(props) {
  const classes = useStyles();
  // const [isLoginAreaShown, setIsLoginAreaShown] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    document.title = "Admin portal";
    firebase.auth().onAuthStateChanged(function(user) {
      if (!user) {
        setIsLoggedIn(false);
        window.location.href = "/login";
      } else {
        setIsLoggedIn(true);
      }
    });
  }, []);




    return (<Grid container justify="center">
            <Grid item xs={12}>
                <NavBar />
            </Grid>
            <Grid item container xs={10} md={6} className={classes.padTopBottom}>
                <Grid item md={12} xs={12} className={classes.marginBottom}>
                  <UserManagementArea show={isLoggedIn}/>
                </Grid>
                <Grid item md={12} xs={12} className={classes.marginBottom}>
                <DeletePollArea show={isLoggedIn} />
              </Grid>
                <Grid item md={12} xs={12} className={classes.marginBottom}>
                    <GraphCalculatorDatasets /> 
                </Grid>
              <Grid item md={12} xs={12} className={classes.marginBottom}>
                <SignOutArea show={isLoggedIn} />
              </Grid>
            </Grid>

        </Grid>);

}
export default AdminPage;

