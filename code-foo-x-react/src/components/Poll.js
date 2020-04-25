import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CancelIcon from '@material-ui/icons/Cancel';
import Grow from '@material-ui/core/Grow';
import { Container } from '@material-ui/core';
import SectionTitle from './SectionTitle';
import PollButton from './PollButton'


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
    
}));

function Poll(props) {
const classes = useStyles();
const [selectedOption, setSelectedOption] = useState(null)

function changePollOption(option) {
    if (selectedOption === option) {
        //if this option is already checked uncheck it
        //and set it to null
        setSelectedOption(null);
    } else {
        //React will re-render the component
        //when the state is updated
        setSelectedOption(option);
    }

}

function getOptionsForRender() {
    let result = [];
    for (let i = 0; i < props.data.options.length; i++) {
        const option = props.data.options[i];
        result.push(
            <Grid item key={i}>
                <PollButton className={classes.button} buttonState={option === selectedOption ? "selected" : "not-selected"} changePollOption={changePollOption} value={option} />
            </Grid>
        )
    }
    return result;
}

        return (
            <Container className={classes.container}>
                <SectionTitle>{props.data.title}</SectionTitle>
                <p className={classes.subsection}>Asked by {props.data.askedBy}</p>
                <Grid container spacing={1}>
                    {getOptionsForRender()}
                </Grid>
            </Container>
        );

}

export default Poll;
