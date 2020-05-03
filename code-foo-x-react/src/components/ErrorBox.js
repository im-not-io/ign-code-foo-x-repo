import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CancelIcon from '@material-ui/icons/Cancel';
import Grow from '@material-ui/core/Grow';


const useStyles = makeStyles((theme) => ({
    error: {
        marginTop: "1rem",
        backgroundColor: "#ffd8d6",
        fontWeight: 450,
        color: theme.palette.primary.main,
        padding: "0.5rem",
        borderRadius: "0.5rem"
    },
    icon: {
        padding: "0.25rem"
    }

}));

function ErrorBox(props) {
const classes = useStyles();
        return (
            <div>
                <Grow in={props.show} timeout={500} unmountOnExit={true}>
                        <Grid container className={classes.error} alignItems="center">
                            <Grid item alignItems="center">
                                <CancelIcon className={classes.icon}/>
                            </Grid>
                            <Grid item xs={1}>
                            </Grid>
                            <Grid item xs={9}>
                                {props.children}
                            </Grid>
                        </Grid>
                </Grow>
            </div>


        );

}

export default ErrorBox;
