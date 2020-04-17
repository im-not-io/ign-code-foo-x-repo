import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';



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
    },
    accountCircle: {
        color: theme.palette.secondary.dark
    }
}));

function UserModifcationItem(props) {
const classes = useStyles();
        return (
            <ListItem key={props.uid}>
                <ListItemAvatar>
                    <AccountCircleIcon style={{ fontSize: 40 }} className={classes.accountCircle}/>
                </ListItemAvatar>
                <ListItemText
                primary={props.name}
                secondary={props.role}
                />
                <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete">
                    <DeleteIcon />
                </IconButton>
                </ListItemSecondaryAction>
          </ListItem>
        );

}

export default UserModifcationItem;