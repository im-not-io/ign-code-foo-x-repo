import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
spacer: {
    flexGrow: 1
},
loginButton: {
    fontSize: "1em"
},
image: {
    width: "12.5%"
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
            <img src="https://firebasestorage.googleapis.com/v0/b/code-foo-x-firebase.appspot.com/o/ign-code-foo-logo-nick-edit-2020-07-29.svg?alt=media&token=933b0b60-be20-451f-bd52-15850e3b2c9c" className={classes.image}></img>
            <div className={classes.spacer}></div>
            <Button className={classes.loginButton} color="inherit">Sign in</Button>
            </Toolbar>
      </AppBar>
    </div>
  );
}
