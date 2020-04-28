import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import Slide from '@material-ui/core/Slide';


const useStyles = makeStyles((theme) => ({
    top: {
        backgroundColor: "#e0a910",
        color: theme.palette.primary.light,
        textTransform: "none",
        border: "0.2rem solid #e0a910",
        "&:hover": {
            backgroundColor: "#e0a910"
        }
    },
    notTop: {
        backgroundColor: theme.palette.secondary.dark,
        opacity: 0.5,
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
        <Slide direction="left" in={props.visible} mountOnEnter unmountOnExit>
            <Button fullWidth className={props.isTop ? classes.top : classes.notTop} variant="contained" color="primary">
                {props.children}
            </Button>
        </Slide>
    )

}

export default ResultBubble;
