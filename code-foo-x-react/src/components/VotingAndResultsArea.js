import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useEffect } from 'react';
import ResultBubble from './ResultBubble';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrophy } from '@fortawesome/free-solid-svg-icons'
import Slide from '@material-ui/core/Slide';
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
    },
    trophyIcon: {
        marginRight: "0.5rem",
        marginLeft: "-0.2rem"
    }
    
}));


function VotingAndResultsArea(props) {
const classes = useStyles();

const [selectedOption, setSelectedOption] = useState(null);
const [previousOption, setPreviousOption] = useState(null);
const [maxIndices, setMaxIndices] = useState(null);

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
    console.log("change poll trig");
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

useEffect(() => {
    console.log("resetting max indices", props.options)
    setMaxIndices(getMaxVoted(props.options))
}, [props.options])

function getMaxVoted(arr) {    
    let maxVotes = Number.NEGATIVE_INFINITY;
    let maxHits = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].votes > maxVotes) {
            maxHits = [];
            maxVotes = arr[i].votes
        }
        if (arr[i].votes === maxVotes) {
            maxHits.push(i)
        }
    }
    return maxHits;
}


function getBlocks() {
    if (maxIndices === null) {
        return "Loading...";
    }
    let result = [];
        for (let i = 0; i < props.options.length; i++) {
            const option = props.options[i];
            result.push(
                <Grid item key={i} xs={12} md={3}>
                    <PollButton buttonState={isSelected(option)} changePollOption={changePollOption} option={option} />   
                    {maxIndices.indexOf(i) !== -1 ?
                    <ResultBubble isTop={maxIndices.indexOf(i) !== -1} visible={props.visible}><FontAwesomeIcon className={classes.trophyIcon} icon={faTrophy} />Most voted: {option.votes}</ResultBubble>
                    : <ResultBubble isTop={maxIndices.indexOf(i) !== -1} visible={props.visible}>Votes: {option.votes}</ResultBubble>}
                </Grid>
            )
        }


    return result;
}
        return (
                <Grid container item xs={12} spacing={1} className={classes.marginTop}>
                    {getBlocks()}
                </Grid>
        );

}

export default VotingAndResultsArea;
