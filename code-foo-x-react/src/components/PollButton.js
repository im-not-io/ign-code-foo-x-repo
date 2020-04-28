import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import React, { useEffect, useState } from 'react';

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
        marginRight: "0.25rem" 
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

}, [props.buttonState, classes.pollButtonSelected, classes.pollButtonNotSelected])

function handleClick() {
    props.changePollOption(props.option);
}

function getButton() {
    if (props.buttonState === "selected") {
        return (
            <Button fullWidth size="medium" className={pollButtonStyle} variant="contained" color="primary" onClick={handleClick}>
            <CheckCircleIcon className={classes.checkCircle}/>You voted: {props.option.name}
            </Button>
        );
    } else {
        return (
            <Button fullWidth size="medium" className={pollButtonStyle} variant="contained" color="primary" onClick={handleClick}>
            {props.option.name}
            </Button>
        );
    }
} 
    return getButton();

}

export default PollButton;
