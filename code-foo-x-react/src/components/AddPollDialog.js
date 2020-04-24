import React, { useEffect, useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import ChipInput from 'material-ui-chip-input'
import PollChip from './PollChip';
import SectionTitle from './SectionTitle';
import BetterButton from './BetterButton';
import Container from '@material-ui/core/Container';

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
    }
}));

export default function AddPollDialog(props) {
    const classes = useStyles();
    const [pollOptions, setPollOptions] = useState([
      "one", "two", "three", "four"
    ]);

    function deleteChip(uid) {
      console.log("delete this id", uid);
    }

    function getChips() {
      let result = [];
      for (let i = 0; i < pollOptions.length; i++) {
        const title = pollOptions[i];
        result.push(
        <Grid item>
          <PollChip key={i} uid={i} title={title} function={deleteChip}/>
        </Grid>)
      }
      return result;
    }
    
  return (
    <div>
      <Dialog maxWidth={"sm"} fullWidth={true} onClose={props.handleClose} aria-labelledby="customized-dialog-title" open={props.isOpen}>
        <DialogTitle className={classes.dialogTitle} onClose={props.handleClose}>
          Create a poll
        </DialogTitle>
        <DialogContent dividers>
            <Grid container justify="center">
              <Grid item xs={12}>
                <TextField
                fullWidth
                label="Poll question"
                placeholder="Example: What is your favorite color?"
                multiline
                rowsMax={3}
                rows={3}
                variant="outlined"
                color="primary"
                // onChange={handleChange}
                />
              </Grid>
              <Grid item container xs={12}>
              {getChips()}
              </Grid>
              <Grid item container xs={12} className={classes.inputArea}>
                    <TextField placeholder="Type an option, press enter to add it" color="primary" fullWidth/>
              </Grid>
            </Grid>
        </DialogContent>
        <DialogActions>
          <Button autoFocus fullWidth className={classes.addPollButton} onClick={props.handleClose} variant="contained" color="primary">
            Save changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}