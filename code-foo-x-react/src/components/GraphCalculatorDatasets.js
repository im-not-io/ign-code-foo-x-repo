import React, { useEffect, useState } from 'react';
import * as firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import "firebase/functions";
import List from '@material-ui/core/List';
import Box from '@material-ui/core/Box';
import BetterButton from './BetterButton';
import SectionTitle from './SectionTitle';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import AddDatasetDialog from './AddDatasetDialog'
import GraphCalculatorDatasetItem from './GraphCalculatorDatasetItem'
import Grid from '@material-ui/core/Grid';


const useStyles = makeStyles((theme) => ({
    topBottomSpacing: {
        marginTop: "1rem",
        marginBottom: "2rem"
    },
    nothing: {
        marginTop: "0.5rem",
        color: theme.palette.secondary.dark,
        marginBottom: "1rem"
    }
}));



function UserManagementArea(props) {
    const classes = useStyles();
    const [datasetItems, setDatasetItems] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    function deleteDataset(deleteThisUid) {
        firebase.database().ref('datasets/' + deleteThisUid).remove().then(() => {
            console.log("delete success");
        })
        .catch(() => {
            console.log("delete failure");
        });
    }

    useEffect(() => {
        function setUpFirebaseReadListener() {

            firebase.database().ref("datasets/").on('value', function(snapshot) {
                let datasets = snapshot.val();
                let result = [];
                console.log("Datasets");
                console.log(datasets);
                for (const key in datasets) {
                    result.push(
                        <GraphCalculatorDatasetItem in={true} key={key} uid={key} name={datasets[key].name} url={datasets[key].url} onDeleteIconClicked={deleteDataset} showDeleteIcon={true}/>
                    );
                }
                setDatasetItems(result);
            }, (error) => {
              console.log('error', error);
            });
    
        }    
        setUpFirebaseReadListener();
    }, []);


    function getLoaderOrData() {
        if (datasetItems === null) {
            return <LinearProgress className={classes.topBottomSpacing}/>;
        }
        if (datasetItems.length === 0) {
            return <div className={classes.nothing}>There are no items</div>;
        }
        if (datasetItems.length >= 1) {
            return (
                <List dense={true}>
                    {datasetItems}
                </List>
            )
        }
    }

    function toggleAddDatasetDialog() {
        setDialogOpen(!dialogOpen);
    }

    return (
            <Grid container>
                <Grid item xs={12}>
                    <SectionTitle>Add/delete datasets</SectionTitle>
                </Grid>
                <Grid item xs={12}>
                    {getLoaderOrData()}
                    <BetterButton function={toggleAddDatasetDialog}>Add dataset</BetterButton>    
                    <AddDatasetDialog isOpen={dialogOpen} toggleFunction={toggleAddDatasetDialog}/>
                </Grid>
                
            </Grid>
  );

}

export default UserManagementArea;
