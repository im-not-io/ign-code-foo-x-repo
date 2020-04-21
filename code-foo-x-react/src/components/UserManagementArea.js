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
        var user = firebase.auth().currentUser;
        user.delete().then(function() {
            console.log("user deletion successful")
        }).catch(function(error) {
            console.log(error);
        });
    }

    function executeDeleteUserOnServer(idToken, deleteThisUid) {
        
        fetch('http://localhost:5000/code-foo-x-firebase/us-central1/users', {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json'
            },
          body: JSON.stringify({
            "idToken": idToken,
            "deleteUser": deleteThisUid
          })
        }).then(function(response) {
          response.json().then(data => {
            if (response.status !== 200) {
              console.log("Error happened.")
              console.log(data);
            } else {
              console.log(data);
            }
    
          })
        })
        .catch((error) => {
          console.log('Error:', error);
        });
      }

    function deleteUserFromFirebaseV2(deleteThisUid) {
        firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
            executeDeleteUserOnServer(idToken, deleteThisUid);
          }).catch(function(error) {
            console.log(error);
          });

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
                        <UserModificationItem in={true} key={key} uid={key} name={users[key].name} role={users[key].role} email={users[key].email} onDeleteIconClicked={deleteUserFromFirebaseV2} showDeleteIcon={users[key].role === "administrator"}/>
                    );
                }
                setUserModificationItems(result);
            }, (error) => {
              console.log('error', error);
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
