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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function createAdminUser() {
    console.log("ready to create admin");
    console.log(name, email, password)
  }

  return (
    <div>
      <Dialog maxWidth={"sm"} fullWidth={true} onClose={props.toggleFunction} aria-labelledby="customized-dialog-title" open={props.isOpen}>
        <DialogTitle id="customized-dialog-title" onClose={props.toggleFunction}>
          Add administrator
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText className={classes.pullUp}>
          Fill out the fields to create a new administrator user.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            onChange={(event) => setName(event.target.value)}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Email"
            onChange={(event) => setEmail(event.target.value)}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Confirm email"
            type="email"
            fullWidth
          />
          <TextField
            margin="dense"
            type="password"
            label="Password"
            onChange={(event) => setPassword(event.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
        <BetterButton function={createAdminUser} className={classes.noTextTransform} fullWidth={true}>
          Create administrator account
        </BetterButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}