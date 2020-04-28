import { DialogContentText } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import Grow from '@material-ui/core/Grow';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/functions";
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import BetterButton from './BetterButton';
import ErrorBox from "./ErrorBox";
import PollChip from './PollChip';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const useStyles = makeStyles((theme) => ({
    addPollButton: {
        textTransform: "none"
    },
    chipInput: {
        marginTop: "1rem"
    },
    h3: {
      color: theme.palette.secondary.dark,
      marginBottom: "-0.10rem"
    },
    dialogTitle: {
      color: theme.palette.secondary.dark
    },
    leftPadding: {
      paddingLeft: "1rem"
    },
    rightPadding: {
      paddingRight: "1rem"
    },
    inputArea: {
      marginTop: "0.75rem"
    },
    topBottomMargin: {
      marginBottom: "-0.5rem",
      marginTop: "1rem"
    }
}));

export default function AddPollDialog(props) {
    const classes = useStyles();
    const [pollOptions, setPollOptions] = useState([]);
    const [optionInput, setOptionInput] = useState("");
    const [pollTitle, setPollTitle] = useState("");
    const [name, setName] = useState("");
    const [isErrorBoxShown, setIsErrorBoxShown] = useState(false);
    const [errorText, setErrorText] = useState("Error: The poll couldn't be created.");
    const [buttonState, setButtonState] = useState("normal");

    useEffect(() => {
      function clearFields() {
        setPollOptions([]);
        setOptionInput("");
        setPollTitle("");
        setName("");
        setIsErrorBoxShown(false);
        setButtonState("normal");
      }
      clearFields();
    }, [props.isOpen]);

    function scheduleDelete(uid) {
      //check this function. Why does using
      //having an non-fixed key cause problems?
      let result = [];
      for (let i = 0; i < pollOptions.length; i++) {
        if (uid === pollOptions[i].id) {
          result.push({
            option: pollOptions[i].option,
            deleted: true,
            id: pollOptions[i].id
          });
        } else {
          result.push(pollOptions[i]);
        }
      }
  
      setPollOptions(result);


      //using the same timeout as the animation
      setTimeout(() => {
        actuallyDeleteChip(uid)
      }, 500)
    }

    function actuallyDeleteChip(uid) {
      let result = [];
      for (let i = 0; i < pollOptions.length; i++) {
        if (pollOptions[i].id !== uid) {
          result.push(pollOptions[i])
        }
      }
      console.log("actual delete trigger", result);
      setPollOptions(result);
    }

    function deleteChip(uid) {
      console.log("delete called")
      scheduleDelete(uid);
    }



    function handleOptionInputKeydown(event) {
      if (event.key === "Enter" && event.target.value !== "") {
        //copy the array to force the state to re-render
        //major react gotcha
        let options = pollOptions.slice();
        options.push({
          option: event.target.value,
          deleted: false,
          id: uuidv4()
        });
        console.log("pollOptions vs temp", pollOptions, options)
        setPollOptions(options);
        //clear the input so another option can be typed
        setOptionInput("")

      }
    }

    function renderOptions() {
      let result = [];
      for (let i = 0; i < pollOptions.length; i++) {
        result.push(
          <Grow in={!pollOptions[i].deleted} timeout={500} unmountOnExit key={pollOptions[i].id}>
            <Grid item>
              <PollChip uid={pollOptions[i].id} title={pollOptions[i].option} function={deleteChip}/>
            </Grid>
          </Grow>
          );
      }
      return result;
    }

    function saveAndClose() {
      //pull out the poll option strings. We don't need to know
      //its deleted status or id to save in the database
      console.log("requesting save and close");

      let options = pollOptions.map((optionObject, index) => {
        return {
          name: optionObject.option,
          votes: 0,
          index: index

        }
      });
      if (pollTitle === "") {
        setErrorText("You must provide a question.");
        setIsErrorBoxShown(true);
      } else if (!Array.isArray(options) || options.length < 2) {
        setErrorText("Two or more responses must be provided.");
        setIsErrorBoxShown(true);
      } else {
        //if input is valid 
        setButtonState("loading")
        console.log("ready to write", pollTitle, name, pollOptions.map((optionObject) => optionObject.options));
        let push = firebase.database().ref("polls/").push();
        const key = push.key;
        let resultObject = {
          title: pollTitle,
          options: options,
          id: key,
          askedBy: (name === "" ? "Anonymous" : name),
        };
        push.set(resultObject, () => {
          //if successfully added
          props.handleClose();
          setButtonState("normal")
          setIsErrorBoxShown(false)
        });
      }
    }

    function handleTextFieldKeydown(event) {
      if (event.key === "Enter") {
        var nodes = document.querySelectorAll("input[type=text]");
        console.log("nodes", nodes);
        nodes.forEach((currentValue, currentIndex) => { 
            if (currentValue === event.target) {
              const nextItem = nodes.item(currentIndex + 1);
              if (nextItem !== null) {
                nextItem.focus();
              } else {
                console.log("ready to close")
                saveAndClose();
              }
            }
            console.log(currentValue);
          },
        );
      }
    }




    
  return (
    <div>
      <Dialog maxWidth={"sm"} fullWidth={true} onClose={props.handleClose} aria-labelledby="customized-dialog-title" open={props.isOpen}>
        <DialogTitle className={classes.dialogTitle} onClose={props.handleClose}>
          Create a poll
        </DialogTitle>
        <DialogContent dividers>
           <DialogContentText className={classes.pullUp}>
            Enter your poll's question
          </DialogContentText>
            <Grid container justify="center">
              <Grid item xs={12}>
                <TextField
                fullWidth
                label="Type your question"
                placeholder="Example: What is your favorite color?"
                variant="outlined"
                color="primary"
                onChange={(event) => setPollTitle(event.target.value)}
                value={pollTitle}
                onKeyDown={handleTextFieldKeydown}
                />
              </Grid>
              <Grid item xs={12} className={classes.topBottomMargin}>
                  <DialogContentText>Enter two or more answers to the question</DialogContentText> 
              </Grid>
              <Grid item container xs={12}>
              {renderOptions()}
              </Grid>
              <Grid item container xs={12} className={classes.inputArea}>
                    <TextField variant="outlined" value={optionInput} onChange={(event) => setOptionInput(event.target.value)} onKeyDown={handleOptionInputKeydown} placeholder="Type your answer. Press Enter to add another." color="primary" fullWidth/>
              </Grid>
              <Grid item container xs={12} className={classes.inputArea}>
                <DialogContentText className={classes.pullUp}>
                    Optionally, provide your name for public display
                  </DialogContentText>
                    <TextField variant="outlined" onKeyDown={handleTextFieldKeydown} onChange={(event) => setName(event.target.value)} value={name} placeholder="Your name (optional)" color="primary" fullWidth/>
              </Grid>
            </Grid>
          <ErrorBox show={isErrorBoxShown}>{errorText}</ErrorBox>
        </DialogContent>
        <DialogActions>
          <BetterButton autoFocus fullWidth className={classes.addPollButton} state={buttonState} function={saveAndClose} variant="contained" color="primary">
            Add new poll
          </BetterButton>
        </DialogActions>
      </Dialog>
      
    </div>
  );
}