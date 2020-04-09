import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Box from '@material-ui/core/Box';
import clsx from 'clsx';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import InfoIcon from '@material-ui/icons/Info';

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

export default function NavBar() {
  const classes = useStyles();

  const [state, setState] = React.useState({
    left: false
  });




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
          <ListItem button key="how_nick_made_this" className={classes.listItem}>
            <InfoIcon className={classes.icon}/>
            <ListItemText className={classes.gray} primary="How Nick Made This" />
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
            <Button className={classes.loginButton}>Create a poll</Button>
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
