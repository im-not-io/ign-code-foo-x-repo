import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Link from '@material-ui/core/Link';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

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
  }
});


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
    persistenceWarning: {
      marginTop: "0.5rem"
    },
    modalButton: {
      textTransform: "none"
    },
    warningIcon: {
      marginRight: "0.20rem"
    },
    link: {
      cursor: "pointer"
    },
    linkPushRight: {
      cursor: "pointer",
      marginLeft: "0.3rem"
    },
    buttonPushRight: {
      cursor: "pointer",
      marginLeft: "0.4rem"
    },
    dialogInstructions: {
      marginBottom: "1rem"
    },
    noSpacing: {
      paddingLeft: 0
    },
    noTextTransform: {
      textTransform: "none",
      fontSize: "1rem"
    }
}));

function AddUserDialog(props) {
  const [inputValue, setInputValue] = useState("");


function handleChange(event) {
  setInputValue(event.target.value);
}
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
  
const classes = useStyles();
        return (
            <Dialog open={props.open} onClose={props.toggleFunction} aria-labelledby="form-dialog-title">
            <DialogTitle onClose={props.handleClose}>Modify data set</DialogTitle>
            <DialogContent>
            <DialogContentText>
            To subscribe to this website, please enter your email address here. We will send updates
            occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            fullWidth
          />
          <TextField
            margin="dense"
            id="email"
            label="Email"
            type="email"
            fullWidth
          />
        <TextField
            margin="dense"
            id="confirmEmail"
            label="Confirm Email"
            type="email"
            fullWidth
          />
        <TextField
            margin="dense"
            id="password"
            label="Password"
            type="password"
            fullWidth
          />
            </DialogContent>
            <DialogActions>
                  <Button variant="contained" className={classes.noTextTransform} fullWidth color="primary">
                    Create new administrator
                  </Button>
                </DialogActions>
          </Dialog>
        );

}

export default AddUserDialog;
