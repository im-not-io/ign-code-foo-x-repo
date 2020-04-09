import React from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CancelIcon from '@material-ui/icons/Cancel';

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

function ErrorBox(props) {
const classes = useStyles();
        return (
            <Grid container className={classes.errorBox}>
                <Grid container item justify="flex-start" alignItems="center" className={classes.error}>
                    <Grid item className={classes.cancelIcon}>
                        <CancelIcon />
                    </Grid>
                    <Grid>{props.message}</Grid>

                </Grid>
            </Grid>
        );

}

export default ErrorBox;
