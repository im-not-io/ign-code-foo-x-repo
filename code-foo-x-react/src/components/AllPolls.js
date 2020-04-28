import Grid from '@material-ui/core/Grid';
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/functions";
import React, { useEffect, useState } from 'react';
import Poll from './Poll';

function AllPolls(props) {
const [polls, setPolls]= useState(null);

    useEffect(() => {
        firebase.database().ref("polls/").on("value", (dataSnapshot) => {
            let result = [];
            let pollsObject = dataSnapshot.val();
            for (let key in pollsObject) {
                result.push(
                    <Grid item xs={12} key={key}>
                        <Poll key={key} data={pollsObject[key]}/>
                    </Grid>
                )
            }
            
            setPolls(result);

        },
        (error) => {
            console.log("Error");
            console.log(error);
        });
    }, []);

        return (
            <Grid container>
                {polls}
            </Grid>
        );

}

export default AllPolls;
