import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles((theme) => ({
    button: {
        backgroundColor: theme.palette.secondary.dark,
        color: theme.palette.primary.light,
        textTransform: "none",
        border: "0.2rem solid " + theme.palette.secondary.dark,
        "&:hover": {
            backgroundColor: theme.palette.secondary.dark,
        }
    }

}));



function ResultBubble(props) {
const classes = useStyles();

    return (
        <Button fullWidth className={classes.button} variant="contained" color="primary">
            {props.children}
        </Button>
    )

}

export default ResultBubble;
