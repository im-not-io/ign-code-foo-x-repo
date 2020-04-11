import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Link from '@material-ui/core/Link';
import WarningIcon from '@material-ui/icons/Warning';
import { Grid } from '@material-ui/core';
import Container from '@material-ui/core/Container';

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
    dialogInstructions: {
      marginBottom: "1rem"
    }
}));

function ModifySourceDialog(props) {
  const [inputValue, setInputValue] = useState("");

function saveAndClose() {
    props.setPdfUrl(inputValue);
    props.handleClose();
}

function handleChange(event) {
  setInputValue(event.target.value);
}

function setTextFieldToSampleQuest1() {
  setInputValue("https://code-foo-x-firebase.firebaseapp.com/assets/sample_quests.pdf");
}

function setTextFieldToIgnDefault() {
  setInputValue("https://media.ignimgs.com/code-foo/2020/files/quests_for_question.pdf");
}

  
const [modifySourceDialogOpen, setModifySourceDialogOpen] = useState(false);
const classes = useStyles();
        return (
            <Dialog open={props.isOpen} onClose={props.handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Modify PDF URL</DialogTitle>
            <DialogContent>
            <Grid container>
              <Grid item className={classes.dialogInstructions} xs={12}>
                Modify this field to permanently change the PDF that is used to load in quest data. Then press "Reload from source" to display the data.
              </Grid>
              <Grid item xs={12}>
              Alternatively, use a sample PDF:
              </Grid>
              <Grid item xs={12}>
              <Link onClick={setTextFieldToSampleQuest1} color="primary" className={classes.link}>Sample quest PDF</Link>
              </Grid>

            </Grid>

              <TextField
                autoFocus
                margin="dense"
                label={props.pdfUrl}
                onChange={handleChange}
                value={inputValue}
                fullWidth
              />
            <Grid container className={classes.persistenceWarning}>
              <Grid item container xs={12} alignItems="center">
                <WarningIcon style={{ fontSize: 20 }} className={classes.warningIcon}/>Warning: The URL will be saved to database.
              </Grid>
              <Grid item container xs={12} alignItems="center">
              To reset to the Code Foo Quest URL<Link onClick={setTextFieldToIgnDefault} color="primary" className={classes.linkPushRight}>reset to default</Link>.
              </Grid>
            </Grid>

            </DialogContent>
            <DialogActions>
              <Button fullWidth variant="contained" color="primary" onClick={saveAndClose} color="primary">
              Permanently Change URL
              </Button>
            </DialogActions>
          </Dialog>
        );

}

export default ModifySourceDialog;
