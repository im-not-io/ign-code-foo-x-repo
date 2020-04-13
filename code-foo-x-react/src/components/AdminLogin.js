import React from 'react'
import NavBar from './NavBar';
import Grid from '@material-ui/core/Grid';
import BestQuestsGraph from './BestQuestsGraph';
import PageTitle from './PageTitle';
import { makeStyles, withStyles } from '@material-ui/core/styles';
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
import SectionTitle from './SectionTitle'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { red } from '@material-ui/core/colors';


const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: "1rem"
  },
    underline: {
        '&:after': {
          borderBottom: `2px solid #FFFFFF`,
        },
        '&$focused:after': {
          borderBottomColor: `#FFFFFF`,
        },
        '&$error:after': {
          borderBottomColor: `#FFFFFF`,
        },
        '&:before': {
          borderBottom: `1px solid #FFFFFF`,
        },
        '&:hover:not($disabled):not($focused):not($error):before': {
          borderBottom: `2px solid #FFFFFF`,
        },
        '&$disabled:before': {
          borderBottom: `1px dotted #FFFFFF`,
        },
      },
}));




function AdminPage(props) {
    const classes = useStyles();

    return ( <Card> 
        <CardContent>
        <SectionTitle title="Whoa there! Please sign in!" />
        <form noValidate autoComplete="off">
            <TextField label="Email" fullWidth/>
            <TextField label="Password" type="password" fullWidth/>
        </form>
        </CardContent>
        <CardActions className={classes.card}>
        <Button variant="contained" color="primary">Sign in</Button>
      </CardActions>
      </Card>);

}
export default AdminPage;