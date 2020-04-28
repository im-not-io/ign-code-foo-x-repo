import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useEffect } from 'react';
import PollButton from './PollButton';
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/functions";


const useStyles = makeStyles((theme) => ({
    container: {
        boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.2)",
        margin: "0.5rem",
        padding: "1rem",
        borderRadius: "5px"
    },
    subsection: {
        color: theme.palette.secondary.dark
    },
    marginTop: {
        marginTop: "0.5rem"
    }
    
}));

function PollOptions(props) {
const classes = useStyles();
const [selectedOption, setSelectedOption] = useState(null)
const [previousOption, setPreviousOption] = useState(null)




function getChosenOptionData() {
    if (selectedOption !== null) {
        for (let i = 0; i < props.options.length; i++) {
            let option = props.options[i];
            if (option.name === selectedOption.name) {
                return [i, option.votes]
            }
        }
    }
    return [null, null];
}



useEffect(() => {
    console.log("prev, current", previousOption, selectedOption);
    if (previousOption !== null) {
        firebase.database().ref("polls/" + props.pollReference + "/options/" + previousOption.index + "/votes").once("value").then((snapshot) => {
            const votes = snapshot.val();
            firebase.database().ref("polls/" + props.pollReference + "/options/" + previousOption.index + "/votes").set(votes - 1);
        });
    }
    if (selectedOption !== null) {
        firebase.database().ref("polls/" + props.pollReference + "/options/" + selectedOption.index + "/votes").once("value").then((snapshot) => {
            const votes = snapshot.val();
            firebase.database().ref("polls/" + props.pollReference + "/options/" + selectedOption.index + "/votes").set(votes + 1);
            props.voteWasCast();
        });
    }
    if (previousOption !== null && selectedOption === null) {
        console.log("ready to substract from votes");
        firebase.database().ref("polls/" + props.pollReference + "/options/" + previousOption.index + "/votes").once("value").then((snapshot) => {
            const votes = snapshot.val();
            firebase.database().ref("polls/" + props.pollReference + "/options/" + previousOption.index + "/votes").set(votes - 1);
        });
    }

}, [selectedOption, previousOption]);



function changePollOption(option) {
    if (selectedOption !== null && option.name === selectedOption.name) {
        setPreviousOption(selectedOption);
        setSelectedOption(null);
    } else {
        setPreviousOption(selectedOption);
        setSelectedOption(option);
    }
}

function isSelected(currentOption) {
    if (selectedOption !== null) {
        if (currentOption.name === selectedOption.name) {
            return "selected";
        } else {
            return "not-selected"
        }
    } else {
        return "not selected";
    }
}

function getOptionsForRender() {

    let result = [];


        for (let i = 0; i < props.options.length; i++) {
            const option = props.options[i];
            result.push(
                <Grid item key={i} xs={4} md={3}>
                    <PollButton buttonState={isSelected(option)} className={classes.button} changePollOption={changePollOption} option={option} /> 
                </Grid>
            )
        }

    return result;
}
        return (
            <Grid container item spacing={1} className={classes.marginTop}>
                {getOptionsForRender()}
            </Grid>
        );

}

export default PollOptions;
