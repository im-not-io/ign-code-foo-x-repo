import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';


const useStyles = makeStyles((theme) => ({
    headerRow: {
        backgroundColor: theme.palette.secondary.light
    },
    bold: {
        fontWeight: "bold",
        color: theme.palette.secondary.dark
    },
    normal: {
        color: theme.palette.secondary.dark
    }
}));

function createData(order, quest, earnedRupees) {
    return { 
        order: order,
        quest: quest,
        earnedRupees: earnedRupees
    };
  }

function getQuestRupees(quest, props) {
    let graphEdges = props.questCalculatorResult.graph.edges;
    console.log(graphEdges);
    console.log("quest", quest);
    for (let edgeIndex = 0; edgeIndex < graphEdges.length; edgeIndex = edgeIndex + 1) {
        let edge = graphEdges[edgeIndex];
        if (edge.target === quest) {
            return edge.label;
        }
    }
    throw "Data format is invalid.";   
}

function addRows(props, classes) {

    if (props.questCalculatorResult.maxPath.length === 0) {
        return (
            <TableRow key="loading">
            <TableCell>
                <CircularProgress color="primary" />
            </TableCell>
            <TableCell>
                <CircularProgress color="primary" />
            </TableCell>
            <TableCell>
                <CircularProgress color="primary" />
            </TableCell>
            </TableRow>
        )
    } else {
        return (
            //slicing out the start quest since all quests start there
            props.questCalculatorResult.maxPath.slice(1).map((quest, index) => (
                <TableRow key={quest}>
                <TableCell className={classes.normal} component="th" scope="row">
                    {index + 1}
                </TableCell>
                <TableCell className={classes.normal}>{quest}</TableCell>
                <TableCell className={classes.normal}>{getQuestRupees(quest, props)}</TableCell>
                </TableRow>
            ))
        )
    }

}

function getSum(props, classes) {
    return (
        <TableRow className={classes.headerRow}>
        <TableCell>
        </TableCell>
        <TableCell className={classes.bold}>Maximum rupees possible:</TableCell>
        <TableCell className={classes.bold}>{props.questCalculatorResult.maxDistance}</TableCell>
        </TableRow>
    )
}
  

export default function BestQuestsTable(props) {

  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
    <Table aria-label="simple table">
      <TableHead >
        <TableRow className={classes.headerRow}>
          <TableCell className={classes.bold}>Order</TableCell>
          <TableCell className={classes.bold}>Quest</TableCell>
          <TableCell className={classes.bold}>Earned Rupees</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {addRows(props, classes)}
        {getSum(props, classes)}
      </TableBody>
    </Table>
  </TableContainer>
  );
}
