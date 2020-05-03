import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import PollIcon from '@material-ui/icons/Poll';
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/functions";
import SectionTitle from "./SectionTitle";
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles((theme) => ({
    pollIcon: {
        color: theme.palette.secondary.dark,
        fontSize: "2.5rem"
    },
    progressBar: {
        marginTop: "1rem",
        width: "100%"
    },
    nothing: {
      marginTop: "0.5rem",
      color: theme.palette.secondary.dark
    }
    
}));

export default function DeletePollArea() {
  const classes = useStyles();
  const [deleteItems, setDeleteItems] = useState(null);

  useEffect(() => {
      firebase.database().ref("polls/").on("value", (snapshot) => {
        const pollsObject = snapshot.val();
        let result = [];
        for (let key in pollsObject) {
            result.push(
                  <ListItem key={key}>
                    <ListItemAvatar>
                        <PollIcon className={classes.pollIcon}/>
                    </ListItemAvatar>
                    <ListItemText
                      primary={pollsObject[key].title}
                      secondary={"ID: " + pollsObject[key].id}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="delete" onClick={() => {
                        firebase.database().ref("polls/" + pollsObject[key].id).remove().then(() => {
                            console.log("delete success")
                        })
                        .catch(() => {
                          console.log("delete failure")
                        });
                      }}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
    )
            }
        setDeleteItems(result);
        });
    }, []);

  function getDeleteItems() {
    if (deleteItems !== null && deleteItems.length === 0) {
      console.log("no polls");
      return <div className={classes.nothing}>There are no polls.</div>
    }
    if (deleteItems !== null && deleteItems.length >= 1) {
      return (
      <List dense={true}>
        {deleteItems}
      </List> 
      )
    } else {
        return <LinearProgress color="primary" className={classes.progressBar}/>
    }
  }

  return (
            
            <Grid container>
                <Grid item xs={12}>
                    <SectionTitle>Delete polls</SectionTitle>
                </Grid>
                <Grid item xs={12}>
                  {getDeleteItems()}
                </Grid>
            </Grid> 
  );
}
