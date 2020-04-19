import React, { useEffect, useState } from 'react';
import UserModificationItem from './UserModificationItem';
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
import AddUserDialog from './AddUserDialog'

const useStyles = makeStyles((theme) => ({
    topBottomSpacing: {
        marginTop: "1rem",
        marginBottom: "2rem"
    },
}));



function UserManagementArea(props) {
    const classes = useStyles();
    const [userModificationItems, setUserModificationItems] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);

    function deleteUserFromFirebase(uid) {
        console.log("rdy to delete");
        firebase.database().ref('/users/' + uid).remove();
    }

    useEffect(() => {
        function setUpFirebaseReadListener() {
            firebase.database().ref("users/").on('value', function(snapshot) {
                let users = snapshot.val();
                let result = [];
                console.log("valchange detected", "value change detected");
                console.log("payload", users)
                for (const key in users) {
                    result.push(
                        <UserModificationItem in={true} key={key} uid={key} name={users[key].name} role={users[key].role} onDeleteIconClicked={deleteUserFromFirebase}/>
                    );
                }
                setUserModificationItems(result);
            });
    
        }    
        setUpFirebaseReadListener();
    }, []);


    function getLoaderOrData() {
        if (userModificationItems.length > 0) {
            return (

                <List dense={true}>
                    {userModificationItems}
                </List>
            )
        } else {
            return <LinearProgress className={classes.topBottomSpacing}/>
        }
    }

    function toggleAddUserDialog() {
        console.log("dialog toggle", !dialogOpen)
        setDialogOpen(!dialogOpen);
    }



    

    return (
            <Box>
                <SectionTitle>Add/delete users</SectionTitle>
                {getLoaderOrData()}
                <BetterButton function={toggleAddUserDialog}>Add administrator</BetterButton>    
                <AddUserDialog isOpen={dialogOpen} toggleFunction={toggleAddUserDialog}/>
            </Box>

  );

}

export default UserManagementArea;
