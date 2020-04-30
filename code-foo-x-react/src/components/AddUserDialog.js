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

export default function CustomizedDialogs(props) {
  const classes = useStyles();
  const [name, setName] = useState("Newu Sername");
  const [email, setEmail] = useState("ndigeron@uci.edu");
  const [emailConfirmation, setEmailConfirmation] = useState("ndigeron@uci.edu");
  const [password, setPassword] = useState("password");
  const [isErrorBoxShown, setIsErrorBoxShown] = useState(false);
  const [errorText, setErrorText] = useState("The account creation failed.");
  const [buttonState, setButtonState] =  useState("normal");

  function handleKeydown(event) {
    if (event.key === "Enter") {
      createAdminUserV2();
    }
  }

  function createAdminUserV2() {
    if (name === "") {
      setErrorText("Name cannot be blank.");
      setIsErrorBoxShown(true);
    } else if (emailConfirmation !== email) {
      setErrorText("The confirmation email doesn't match.");
      setIsErrorBoxShown(true);
    } else if (email.length === 0) {
      setErrorText("Email cannot be blank.");
      setIsErrorBoxShown(true);
    } else {
      setButtonState("loading");
      firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
        executeCreateUserOnServer(idToken);
      }).catch(function(error) {
        setButtonState("normal");
        setErrorText(error.message);
        setIsErrorBoxShown(true);
      });
    }

  }


  function executeCreateUserOnServer(idToken) {
    //http://localhost:5000/code-foo-x-firebase/us-central1/users
    //https://us-central1-code-foo-x-firebase.cloudfunctions.net/users
    fetch('https://us-central1-code-foo-x-firebase.cloudfunctions.net/users', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
        },
      body: JSON.stringify({
        "idToken": idToken,
        "name": name,
        "email": email,
        "password": password
      })
    }).then(function(response) {
      response.json().then(data => {
        if (response.status !== 200) {
          setErrorText(data.error);
          setIsErrorBoxShown(true);
          setButtonState("normal");
          
        } else {
          console.log("successfully created user");
          //close the dialog

          setButtonState("normal");
          props.toggleFunction();

        }

      })
    })
    .catch((error) => {
      console.log("error")
      console.log(error)
      setButtonState("normal");
    });
  }



  return (
    <div>
      <Dialog maxWidth={"sm"} fullWidth={true} onClose={props.toggleFunction} aria-labelledby="customized-dialog-title" open={props.isOpen}>
        <DialogTitle onClose={props.toggleFunction}>
          Add dataset
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText className={classes.pullUp}>
          Fill out the fields to create a new administrator user.
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
            label="Email"
            onChange={(event) => setEmail(event.target.value)}
            value={email}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Confirm email"
            type="email"
            onChange={(event) => setEmailConfirmation(event.target.value)}
            value={emailConfirmation}
            fullWidth
          />
          <TextField
            margin="dense"
            type="password"
            label="Password"
            onChange={(event) => setPassword(event.target.value)}
            value={password}
            fullWidth
          />
          </form>
        <ErrorBox show={isErrorBoxShown}>{errorText}</ErrorBox>
        </DialogContent>
        <DialogActions>
        <BetterButton function={createAdminUserV2} state={buttonState} className={classes.noTextTransform} fullWidth={true}>
          Create administrator account
        </BetterButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}