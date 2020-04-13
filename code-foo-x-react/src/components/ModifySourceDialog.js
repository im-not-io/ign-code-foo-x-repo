import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
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
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';

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
  
const [modifySourceDialogOpen, setModifySourceDialogOpen] = useState(false);
const classes = useStyles();
        return (
            <Dialog open={props.isOpen} onClose={props.handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="customized-dialog-title" onClose={props.handleClose}>Modify data set</DialogTitle>
            <DialogContent>
            <Grid container>
              <Grid item className={classes.dialogInstructions} xs={12}>
                Use the dropdown to permanently change the data source used by the quest calculator. Access the <Link className={classes.link} color="primary">Admin Panel</Link> to add/delete new datasets.
              </Grid>
              <Grid item xs={12}>
              <InputLabel id="demo-simple-select-label">Select data set</InputLabel>
                <Select fullWidth
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={inputValue}
                  onChange={handleChange}
                >
                  <MenuItem value={"Link's Quest Calculator Data"}>Link's Quest Calculator Data</MenuItem>
                  <MenuItem value={"Sample Data"}>Sample Data</MenuItem>
                </Select>
        
              </Grid>
            </Grid>

              {/* <TextField
                autoFocus
                margin="dense"
                label={props.pdfUrl}
                onChange={handleChange}
                value={inputValue}
                fullWidth
              /> */}

            </DialogContent>
            <DialogActions>
                  <Button variant="contained" className={classes.noTextTransform} fullWidth color="primary">
                    Permanently Change URL
                  </Button>
                </DialogActions>
          </Dialog>
        );

}

export default ModifySourceDialog;
