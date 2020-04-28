import * as firebase from "firebase/app";
import React from 'react';
import BetterButton from './BetterButton';
import SectionTitle from './SectionTitle';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    pushDown: {
        marginTop: "0.75rem"
    },

}));

function SignOutArea(props) {
const classes = useStyles();

return (
    <div>
            <Grid container>
                <Grid item xs={12}>
                    <SectionTitle>You are signed in</SectionTitle>
                </Grid>
                <Grid item xs={12} className={classes.pushDown}>
                    <BetterButton function={() => firebase.auth().signOut()}>Sign out</BetterButton>
                </Grid>
            </Grid>
    </div>
)

}

export default SignOutArea;
