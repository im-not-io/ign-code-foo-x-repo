import React, {useEffect, useState} from 'react';
import { makeStyles, withTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import DeleteIcon from '@material-ui/icons/Delete';


const useStyles = makeStyles((theme) => ({
    chip: {
        backgroundColor: theme.palette.primary.main,
        padding: "0.5rem",
        borderRadius: "0.2rem",
        marginRight: "0.5rem",
        color: theme.palette.primary.light,
        fontWeight: 500,
        display: "flex",
        alignContent: "center",
        marginTop: "1rem"
    },
    deleteIcon: {
        display: "flex",
        fontSize: "1rem"
    },
    deleteSpan: {
        marginLeft: "0.25rem",
        cursor: "pointer"
    }

}));

export default function PollChip(props) {
const classes = useStyles();
return (
    <span className={classes.chip}>
        <span>{props.title}</span>
        <span className={classes.deleteSpan}><DeleteIcon onClick={() => props.function(props.uid)} style={{fontSize: 20}}/></span>
    </span>
)


}
