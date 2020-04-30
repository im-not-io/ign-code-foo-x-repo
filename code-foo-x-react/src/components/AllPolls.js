import Grid from '@material-ui/core/Grid';
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/functions";
import React, { useEffect, useState } from 'react';
import Poll from './Poll';
import Grow from '@material-ui/core/Grow';
import LinearProgress from '@material-ui/core/LinearProgress';

function AllPolls(props) {
const [polls, setPolls]= useState(null);

    useEffect(() => {
        firebase.database().ref("polls/").on("value", (dataSnapshot) => {
            let result = [];
            let pollsObject = dataSnapshot.val();
            for (let key in pollsObject) {
                result.push(
                    <Grid item xs={12} key={key}>
                        <Grow in={true}>
                            <Poll key={key} data={pollsObject[key]}/>
                        </Grow>
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
                { polls !== null ? polls :
                    <Grid item style={{width: "100%", marginTop: "1rem"}}>
                        <LinearProgress color="primary" />
                    </Grid>
                }
            </Grid>
        );

}

export default AllPolls;
