import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CancelIcon from '@material-ui/icons/Cancel';
import Grow from '@material-ui/core/Grow';


const useStyles = makeStyles((theme) => ({
    error: {
        backgroundColor: "#ffd8d6",
        fontWeight: 450,
        color: theme.palette.primary.main,
        padding: "1rem",
        borderRadius: "0.5rem"
    },
    errorBox: {
        marginTop: "1rem",
        marginBottom: "1rem"
    }

}));

function ErrorBox(props) {
const classes = useStyles();
        return (
            <div>
                <Grow in={props.show} timeout={500} unmountOnExit={true}>
                    <Grid container className={classes.errorBox}>
                        <Grid container item justify="flex-start" alignItems="center" className={classes.error}>
                            <Grid item container xs={2} alignItems="center">
                                <CancelIcon/>
                            </Grid>
                            <Grid item container alignItems="center" className={classes.moveLeft} xs={10}>
                                {props.children}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grow>
            </div>


        );

}

export default ErrorBox;
