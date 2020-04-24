import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    color: {
        color: theme.palette.secondary.dark,
        marginBottom: "0.5rem",
        marginTop: "0rem",
        fontSize: "1.7rem",
        fontWeight: "bold"
    }
}));

function SectionTitle(props) {
    const classes = useStyles();
  return (<span className={classes.color}>{props.children}</span>);
}

export default SectionTitle;
