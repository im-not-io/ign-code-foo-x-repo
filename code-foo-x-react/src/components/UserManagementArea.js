import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import UserModifcationItem from './UserModificationItem';
import * as firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import "firebase/functions";
import List from '@material-ui/core/List';
import Box from '@material-ui/core/Box';

import Grid from '@material-ui/core/Grid';
import CancelIcon from '@material-ui/icons/Cancel';
import Grow from '@material-ui/core/Grow';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles((theme) => ({
    error: {
        backgroundColor: "#ffd8d6",
        fontWeight: 450,
        color: theme.palette.primary.main,
        padding: "1rem",
        borderRadius: "0.5rem"
    },
    cancelIcon: {
        marginRight: "0.5em"
    },
    errorBox: {
        marginTop: "1rem",
        marginBottom: "1rem"
    }
}));



function UserManagementArea(props) {
    const classes = useStyles();
    const [userModficationItems, setUserModificationItems] = useState([]);
    function setUpFirebaseReadListener() {
        let result = [];
        firebase.database().ref("users/").on('value', function(snapshot) {
            let users = snapshot.val();
            for (const key in users) {
                result.push(
                    <UserModifcationItem name={users[key].name} />
                );
            }
            setUserModificationItems(result);
        });

    }
    useEffect(() => {
        setUpFirebaseReadListener();
    }, []);




    return (
    <List dense={true}>
        {userModficationItems}
    </List>
  );

}

export default UserManagementArea;
