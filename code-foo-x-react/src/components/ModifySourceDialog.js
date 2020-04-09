import React, { useEffect } from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

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
    }
}));

function ModifySourceDialog(props) {

  
  
const classes = useStyles();
        return (
            <Dialog open={props.isOpen} onClose={props.handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Modify PDF URL</DialogTitle>
            <DialogContent>
              <DialogContentText>
                  Modify this field to change the PDF that is used to load in quest data. Then press "Reload from source" to display the data.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="https://example.com"
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={props.handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={props.handleClose} color="primary">
                Subscribe
              </Button>
            </DialogActions>
          </Dialog>
        );

}

export default ModifySourceDialog;
