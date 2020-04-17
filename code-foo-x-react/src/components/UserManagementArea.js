import React, { useEffect, useState } from 'react';
import UserModifcationItem from './UserModificationItem';
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

const useStyles = makeStyles((theme) => ({
    topBottomSpacing: {
        marginTop: "1rem",
        marginBottom: "2rem"
    },
}));



function UserManagementArea(props) {
    const classes = useStyles();
    const [userModificationItems, setUserModificationItems] = useState([]);

    function setUpFirebaseReadListener() {
        let result = [];
        firebase.database().ref("users/").on('value', function(snapshot) {
            let users = snapshot.val();
            console.log("users", users);
            for (const key in users) {
                result.push(
                    <UserModifcationItem key={key} uid={key} name={users[key].name} role={users[key].role} />
                );
            }
            setUserModificationItems(result);
        });

    }
    useEffect(() => {
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

    return (
    <div>
            <Box>
                <SectionTitle>Add/delete users</SectionTitle>
                {getLoaderOrData()}
                <BetterButton>Add user</BetterButton>
            </Box>
    </div>

  );

}

export default UserManagementArea;
