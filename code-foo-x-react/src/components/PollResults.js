import Grid from '@material-ui/core/Grid';
import Slide from '@material-ui/core/Slide';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState, useEffect } from 'react';
import ResultBubble from './ResultBubble';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrophy } from '@fortawesome/free-solid-svg-icons'


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

function PollOptions(props) {
const classes = useStyles();
const [maxIndices, setMaxIndices] = useState(null);

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

useEffect(() => {
    console.log("resetting max indices", props.options)
    setMaxIndices(getMaxVoted(props.options))
}, [props.options])


function getOptionsForRender() {
    let results = [];
    if (maxIndices === null) {
        return "Loading...";
    } else {
        console.log("maxIndices result", maxIndices);
    }
    for (let i = 0; i < props.options.length; i++) {
        const result = props.options[i];
        if (maxIndices.indexOf(i) !== -1) {
            console.log("found match at", i);
            results.push(
                <Grid item key={i} xs={4} md={3}>
                    <ResultBubble><FontAwesomeIcon className={classes.trophyIcon} icon={faTrophy} />Most voted: {result.votes}</ResultBubble>
                </Grid>
            )
        } else {
            results.push(
                <Grid item key={i} xs={4} md={3}>
                    <ResultBubble>Votes: {result.votes}</ResultBubble>
                </Grid>
            )
        }

    }
    return results;
}

        return (
            <Slide direction="left" in={props.visible} mountOnEnter unmountOnExit>
            <Grid container item spacing={1} className={classes.marginTop}>
                {getOptionsForRender()}
            </Grid>
        </Slide>
        );

}

export default PollOptions;
