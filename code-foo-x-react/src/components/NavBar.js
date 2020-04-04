import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

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
      fontWeight: "bold"
  },
  image: {
    height: "2em"
  }
}));

export default function NavBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
            <Toolbar>
                <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                    <MenuIcon />
                </IconButton>
                <Box>
                  <img src="https://code-foo-x-firebase.firebaseapp.com/ign-code-foo-logo-nick-edit-2020-04-03-night.svg" className={classes.image}></img>
                </Box>
            <div className={classes.spacer}></div>
            <Button className={classes.loginButton} color="inherit">Create a poll</Button>
            </Toolbar>
      </AppBar>
    </div>
  );
}
