import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Toolbar from '@material-ui/core/Toolbar';
import ExploreIcon from '@material-ui/icons/Explore';
import InfoIcon from '@material-ui/icons/Info';
import MenuIcon from '@material-ui/icons/Menu';
import PollIcon from '@material-ui/icons/Poll';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import clsx from 'clsx';
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/functions";
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";



const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  spacer: {
      flexGrow: 1
  },
  loginButton: {
      fontSize: "1em",
      textTransform: "none",
      color: "white",
      fontWeight: 450
  },
  image: {
    height: "1.7em"
  },
  navBar: {
    background: "linear-gradient(180deg, rgba(191,19,19,1) 0%, rgba(153,18,18,1) 100%)"
  },
  gray: {
    color: theme.palette.secondary.dark
  },
  icon: {
    color: theme.palette.secondary.dark,
    marginRight: "0.7em"
  },
  listItem: {
    marginRight: "0.7em"
  }
}));

export default function NavBar(props) {
  const classes = useStyles();
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        firebase.database().ref('users/' + firebase.auth().currentUser.uid + "/name").on('value', function(snapshot) {
          setUserName(snapshot.val())
        });
    }
    })
  }, []);

  const [state, setState] = React.useState({
    left: false
  });
  
  function runLoginFunction() {
    var unsubscribe = firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        //is signed in the button should then sign the user out
        //use the AuthStateChanged callback to make sure
        //the firebase.auth().currentUser is ready
        //it's wrapped in onAuthStateChanged to ensure the auth().currentUser
        //is already initialized
          firebase.auth().signOut();
        }
   });
   //force Firebase to stop listening for auth changes to prevent weird login errors
  
   unsubscribe();
    //if the user is not signed in the React Router
    //will redirect to the login page so we don't handle
    //the other case
  }




  const toggleDrawer = (anchor, open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

  

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
      <div
        className={clsx(classes.list, {
          [classes.fullList]: anchor === 'top' || anchor === 'bottom',
        })}
        role="presentation"
        onClick={toggleDrawer(anchor, false)}
        onKeyDown={toggleDrawer(anchor, false)}
      >
        <List>
              <ListItem component={Link} to="/polls"  button key="all_polls" className={classes.listItem}>
                <PollIcon className={classes.icon}/>
                <ListItemText className={classes.gray} primary="All polls" />
              </ListItem>
              <ListItem button component={Link} to="/quest-calculator" key="links_quest_calculator" className={classes.listItem}>
                  <ExploreIcon className={classes.icon}/>
                  <ListItemText className={classes.gray} primary="Link's Quest Calculator" />
                </ListItem>
              <ListItem component={Link} to="/admin-portal"  button key="admin_portal" className={classes.listItem}>
                <SupervisorAccountIcon className={classes.icon}/>
                <ListItemText className={classes.gray} primary="Admin Portal" />
              </ListItem>
            <ListItem button onClick={function() { window.location.href="/assets/How%20Nick%20Made%20This%20Website.pdf" }}>
              <InfoIcon className={classes.icon}/>
              <ListItemText className={classes.gray} primary="How Nick Made This" />
            </ListItem>
            <ListItem component={Link} to="/login" button key="login" className={classes.listItem} onClick={runLoginFunction}>
                <VpnKeyIcon className={classes.icon}/>
                <ListItemText className={classes.gray} primary={userName ? userName + " — Sign out" : "Log in"} />
              </ListItem>
        </List>
      </div>

  );

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.navBar}>
            <Toolbar>
                <IconButton onClick={toggleDrawer("left", true)} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                    <MenuIcon />
                </IconButton>
                <Box>
                  <img src="/ign-code-foo-logo-nick-edit-2020-04-03-night.svg" alt="Code Foo X Logo" className={classes.image}></img>
                </Box>
            <div className={classes.spacer}></div>
            <Button className={classes.loginButton}>All polls</Button>
            </Toolbar>
            <SwipeableDrawer
            anchor={"left"}
            open={state["left"]}
            onClose={toggleDrawer("left", false)}
            onOpen={toggleDrawer("left", true)}
          >
            {list("left")}
          </SwipeableDrawer>
      </AppBar>
    </div>
  );
}
