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


const useStyles = makeStyles((theme) => ({
    topBottomSpacing: {
        marginTop: "1rem",
        marginBottom: "2rem"
    },
}));



function UserManagementArea(props) {
    const classes = useStyles();
    const [datasetItems, setDatasetItems] = useState([]);
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
        if (datasetItems.length > 0) {
            return (
                <List dense={true}>
                    {datasetItems}
                </List>
            )
        } else {
            return <LinearProgress className={classes.topBottomSpacing}/>
        }
    }

    function toggleAddDatasetDialog() {
        setDialogOpen(!dialogOpen);
    }

    return (
            <Box>
                <SectionTitle>Add/delete datasets</SectionTitle>
                {getLoaderOrData()}
                <BetterButton function={toggleAddDatasetDialog}>Add dataset</BetterButton>    
                <AddDatasetDialog isOpen={dialogOpen} toggleFunction={toggleAddDatasetDialog}/>
            </Box>

  );

}

export default UserManagementArea;
