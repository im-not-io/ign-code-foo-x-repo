import React from 'react'
import NavBar from './NavBar';
import Grid from '@material-ui/core/Grid';
import "firebase/database";
import "firebase/auth";
import "firebase/functions";

function PollsPage(props) {


    return (<Grid container spacing={0} justify="center">
            <Grid item xs={12}>
                <NavBar />
            </Grid>
            <Grid item xs={12}>
                Polls page
            </Grid>
        </Grid>);

}
export default PollsPage;