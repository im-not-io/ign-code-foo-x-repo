import { Container } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import PollOptions from './PollOptions';
import PollResults from './PollResults';
import SectionTitle from './SectionTitle';

const useStyles = makeStyles((theme) => ({
    container: {
        boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.2)",
        margin: "0.5rem",
        padding: "1rem",
        borderRadius: "5px",
        overflow: "hidden"
    },
    subsection: {
        color: theme.palette.secondary.dark
    },
    marginTop: {
        marginTop: "0.5rem"
    }
    
}));

function Poll(props) {
const classes = useStyles();
const [pollResultsVisible, setPollResultsVisible] = useState(false);


function voteWasCast() {
    setPollResultsVisible(true);
}

console.log("props in poll", props);

        return (
            <Container className={classes.container}>
                <SectionTitle>{props.data.title}</SectionTitle>
                <p className={classes.subsection}>Asked by {props.data.askedBy}</p>
                <Grid container>
                    <PollOptions voteWasCast={voteWasCast} options={props.data.options} pollReference={props.data.id} />
                    <PollResults options={props.data.options} visible={pollResultsVisible} />
                </Grid>
            </Container>
        );

}

export default Poll;
