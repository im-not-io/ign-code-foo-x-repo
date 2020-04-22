import React, { useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { DialogContentText } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import BetterButton from './BetterButton'
import * as firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import "firebase/functions";
import ErrorBox from './ErrorBox';

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
const useStyles = makeStyles((theme) => ({
  noTextTransform: {
    textTransform: "none",
    fontSize: "1rem"
  },
  pullUp: {
    marginBottom: "-0.25rem"
  }
}));



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

export default function AddDatasetDialog(props) {
  const classes = useStyles();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [errorText, setErrorText] = useState("The user could not be created.");
  const [isErrorBoxShown, setIsErrorBoxShown] = useState(false);
  const [buttonState, setButtonState] = useState("normal");

  function handleKeydown(event) {
    if (event.key === "Enter") {
      createAdminUserV2();
    }
  }

  function createAdminUserV2() {
    if (name === "") {
      setErrorText("Name cannot be blank.");
      setIsErrorBoxShown(true);
    } else if (url === "") {
      setErrorText("The URL provided cannot be blank.");
      setIsErrorBoxShown(true);
    } else {
        setButtonState("loading");
        //passed checks execute user addition on server
        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            //wrapping in the onAuthStateChanged handler makes sure
            //user UID is not initializing
            firebase.database().ref('datasets/').push({
              name: name,
              url: url
            })
            .then(() => {
              console.log("push success");
              setButtonState("normal");
              props.toggleFunction();
            })
            .catch(() => {
              console.log("push failure")
            });
          }
        });
    }

  }

  return (
    <div>
      <Dialog maxWidth={"sm"} fullWidth={true} onClose={props.toggleFunction} aria-labelledby="customized-dialog-title" open={props.isOpen}>
        <DialogTitle id="customized-dialog-title" onClose={props.toggleFunction}>
          Add dataset
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText className={classes.pullUp}>
          Add a new dataset that can be used by the quest calculator.
          </DialogContentText>
          <form onKeyDown={handleKeydown}>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            onChange={(event) => setName(event.target.value)}
            value={name}
            fullWidth
          />
          <TextField
            margin="dense"
            label="PDF URL"
            onChange={(event) => setUrl(event.target.value)}
            value={url}
            fullWidth
          />
          </form>
        <ErrorBox show={isErrorBoxShown}>{errorText}</ErrorBox>
        </DialogContent>
        <DialogActions>
        <BetterButton function={createAdminUserV2} state={buttonState} className={classes.noTextTransform} fullWidth={true}>
          Add dataset
        </BetterButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}