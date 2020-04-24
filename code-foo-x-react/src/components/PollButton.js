import React, {useEffect, useState} from 'react';
import { makeStyles, withTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CancelIcon from '@material-ui/icons/Cancel';
import Grow from '@material-ui/core/Grow';
import Button from '@material-ui/core/Button';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

const useStyles = makeStyles((theme) => ({
    pollButtonSelected: {
        backgroundColor: "white",
        color: theme.palette.primary.main,
        textTransform: "none",
        border: "0.2rem solid " + theme.palette.primary.main,
        "&:hover": {
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary.main,
            border: "0.2rem solid " + theme.palette.primary.main
        }
    },
    pollButtonNotSelected: {
        textTransform: "none",
        border: "0.2rem solid " + theme.palette.primary.main,
        "&:hover": {
            color: theme.palette.primary.light,
            border: "0.2rem solid rgba(0,0,0,0)",
        }
    },
    checkCircle: {
        fontSize: 16,
        marginLeft: "0.25rem" 
    }

}));



function PollButton(props) {
const classes = useStyles();
const [pollButtonStyle, setPollButtonStyle] = useState(null);

useEffect(() => {
    if (props.buttonState === "selected") {
        setPollButtonStyle(classes.pollButtonSelected)
    } else {
        setPollButtonStyle(classes.pollButtonNotSelected)
    }

})

function handleClick() {
    props.changePollOption(props.value);
}

function getButton() {
    if (props.buttonState === "selected") {
        return (
            <Button size="medium" className={pollButtonStyle} variant="contained" color="primary" onClick={handleClick}>
            {props.value}<CheckCircleIcon className={classes.checkCircle}/>
            </Button>
        );
    } else {
        return (
            <Button size="medium" className={pollButtonStyle} variant="contained" color="primary" onClick={handleClick}>
            {props.value}
            </Button>
        );
    }
} 
    return getButton();

}

export default PollButton;
