import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CancelIcon from '@material-ui/icons/Cancel';
import Grow from '@material-ui/core/Grow';
import { Container } from '@material-ui/core';
import Poll from './Poll';
import * as firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import "firebase/functions";

const useStyles = makeStyles((theme) => ({
    error: {
        backgroundColor: "#ffd8d6",
        fontWeight: 450,
        color: theme.palette.primary.main,
        padding: "1rem",
        borderRadius: "0.5rem"
    },
    cancelIcon: {
        marginRight: "0.5em"
    },
    errorBox: {
        marginTop: "1rem",
        marginBottom: "1rem"
    }

}));

function fetchPolls() {
    let result = [];
    const polls = {
        "poll1": {
            "title": "What is the meaning of life?",
            "askedBy": "Nick DiGeronimo",
            "options": ["I don't know", "To be happy", "Other"],
            "id": "123456-789"
        },
        "poll2": {
            "title": "What is your favorite color?",
            "askedBy": "James Barth",
            "options": ["Red", "Blue", "Green", "Brown", "Yellow"],
            "id": "123456-790"
        },
    }
    for (let key in polls) {
        result.push(
        <Grid item xs={12} key={key}>
            <Poll data={polls[key]}/>
        </Grid>
        )
    }

    return result;

}

function AllPolls(props) {
const classes = useStyles();
const [polls, setPolls]= useState(null);

    useEffect(() => {
        firebase.database().ref("polls/").on("value", (dataSnapshot) => {
            console.log("data snapshot ready");
        },
        (error) => {
            console.log("Error");
            console.log(error);
        });
    }, []);

        return (
            <Grid container>
                {fetchPolls()}
            </Grid>
        );

}

export default AllPolls;
