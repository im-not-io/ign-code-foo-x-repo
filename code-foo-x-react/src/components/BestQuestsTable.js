import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';



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


function addRows(quests, classes) {

    if (quests === undefined || quests.length === 0) {
        return (
            <div></div>
        )
    } else {
        return (
            //slicing out the start quest since all quests start there
            quests.map((quest, index) => (
                <TableRow key={index}>
                <TableCell className={classes.normal} component="th" scope="row">
                    {index + 1}
                </TableCell>
                <TableCell className={classes.normal}>{quest.quest}</TableCell>
                <TableCell className={classes.normal}>{quest.earnedRupees}</TableCell>
                </TableRow>
            ))
        )
    }

}

function getSum(quests, classes) {
    let sum = 0;
    for (let i = 0; i < quests.length; i++) {
        sum = sum + quests[i].earnedRupees;
    }
    return (
        <TableRow className={classes.headerRow}>
        <TableCell>
        </TableCell>
        <TableCell className={classes.bold}>Maximum rupees possible:</TableCell>
        <TableCell className={classes.bold}>{sum}</TableCell>
        </TableRow>
    )
}

function getBestQuestsTable(classes, props) {
    if (props.quests === null) {
        return (<Grid container spacing={0}>
            <Grid item xs={12}>
                <LinearProgress color="primary" />
            </Grid> 
        </Grid>);
    } else {
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
           {addRows(props.quests, classes)}
           {getSum(props.quests, classes)}
         </TableBody>
       </Table> 
   
               
     </TableContainer>
        );
    }
}
  

export default function BestQuestsTable(props) {
  const classes = useStyles();


  return getBestQuestsTable(classes, props);
}


