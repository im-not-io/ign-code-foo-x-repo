import React from 'react'
import NavBar from './NavBar';
import Grid from '@material-ui/core/Grid';
import BestQuestsGraph from './BestQuestsGraph';
import PageTitle from './PageTitle';
import { makeStyles } from '@material-ui/core/styles';
import { useEffect, useState } from 'react';
import axios from 'axios';
import BestQuestsTable from './BestQuestsTable';
import * as firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import "firebase/functions";
import { Button, Box } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import ErrorBox from './ErrorBox'
import Grow from '@material-ui/core/Grow';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import ReplayIcon from '@material-ui/icons/Replay';
import ModifySourceDialog from './ModifySourceDialog'







const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    spacer: {
        flexGrow: 1
    },
    image: {
      height: "2em"
    },
    instructionText: {
        color: theme.palette.secondary.dark,
        fontStyle: "italic"
    },
    button: {
      fontSize: "1em",
      fontWeight: 450,
      textTransform: "none",
      marginRight: "0.5rem"
    },
    circleProgress: {
      marginLeft: '0.5em'
    },
    buttonDisabled: {
      textTransform: "none",
      marginRight: "0.5rem"
    },
    replayIcon: {
      marginRight: "0.25rem"
    }
  }));





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