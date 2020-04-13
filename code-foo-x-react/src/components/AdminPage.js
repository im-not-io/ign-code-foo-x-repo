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
import SectionTitle from './SectionTitle'
import AdminLogin from './AdminLogin'





const useStyles = makeStyles((theme) => ({
    marginTop: {
      marginTop: "2rem",
      marginLeft: "2rem"
    },
  }));





function AdminPage(props) {
  const classes = useStyles();

    return (<Grid container spacing={0}>
            <Grid item xs={12}>
                <NavBar />
            </Grid>
            <Grid item container spacing={3} xs={12} lg={5}>
              <Grid item xs={12} className={classes.marginTop}>
                <AdminLogin />
              </Grid>
            </Grid>
        </Grid>);

}
export default AdminPage;