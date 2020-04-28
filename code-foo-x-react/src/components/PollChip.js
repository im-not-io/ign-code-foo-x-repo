import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';


const useStyles = makeStyles((theme) => ({
    chip: {
        backgroundColor: theme.palette.primary.main,
        paddingTop: "0.5rem",
        paddingBottom: "0.5rem",
        paddingLeft: "0.7rem",
        paddingRight: "0.7rem",
        borderRadius: "0.2rem",
        marginRight: "0.5rem",
        color: theme.palette.primary.light,
        fontWeight: 500,
        display: "flex",
        alignContent: "center",
        marginTop: "0.4rem",
        marginBottom: "0.15rem"
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
