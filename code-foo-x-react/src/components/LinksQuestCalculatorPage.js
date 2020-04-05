import React, {
    Component
} from 'react'
import {
    scaleLinear
} from 'd3-scale'
import {
    max
} from 'd3-array'
import {
    select
} from 'd3-selection'
import * as d3 from 'd3';
import NavBar from './NavBar';
import Grid from '@material-ui/core/Grid';
import BestQuestsGraph from './BestQuestsGraph';
import PageTitle from './PageTitle';
import { makeStyles } from '@material-ui/core/styles';
import { useEffect, useState } from 'react';
import axios from 'axios';


const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    spacer: {
        flexGrow: 1
    },
    loginButton: {
        fontSize: "1em",
        textTransform: "none",
        fontWeight: "bold"
    },
    image: {
      height: "2em"
    }
  }));

function LinksQuestCalculatorPage(props) {
    /*
    <LinksQuestCalculatorPage>
    <NavBar>
    <PageTitle>
    <SectionTitle>
    <BestQuestsGraph>
    <BestQuestsTable>
    <Footer>  
</LinksQuestCalculatorPage>

*/

const [questCalculatorResult, setQuestCalculatorResult] = useState({
    graph: null,
});
https://us-central1-code-foo-x-firebase.cloudfunctions.net/calulateBestQuests

useEffect(() => {
    async function fetchData() {
        const result = await axios({
            url: 'https://us-central1-code-foo-x-firebase.cloudfunctions.net/calulateBestQuests',
            method: 'get'
            });
        setQuestCalculatorResult(result.data);
      }
      fetchData();
  }, []);



const classes = useStyles();


    return (
        <Grid container spacing={0}>
            <Grid item xs={12}>
                <NavBar />
            </Grid>   
            <Grid item xs={1}></Grid> 
            <Grid item xs={11}>
                <PageTitle title="Best Quests Graph"/>
                <BestQuestsGraph questCalculatorResult={questCalculatorResult}/>
            </Grid> 
        </Grid>
    );


}
export default LinksQuestCalculatorPage;