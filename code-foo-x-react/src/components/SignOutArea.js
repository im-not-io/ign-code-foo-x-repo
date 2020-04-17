import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CancelIcon from '@material-ui/icons/Cancel';
import Grow from '@material-ui/core/Grow';
import Box from '@material-ui/core/Box';
import SectionTitle from './SectionTitle';
import BetterButton from './BetterButton';
import * as firebase from "firebase/app";

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

function SignOutArea(props) {
    console.log("props show", props.show)
const classes = useStyles();

return (
    <div>
        <Grow in={props.show} timeout={500} unmountOnExit={true}>
            <Box>
                <SectionTitle>You are signed in</SectionTitle>
                <BetterButton function={() => firebase.auth().signOut()}>Sign out</BetterButton>
            </Box>
        </Grow>
    </div>
)

}

export default SignOutArea;
