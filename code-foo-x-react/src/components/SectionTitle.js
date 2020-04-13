import React from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    color: {
        color: theme.palette.secondary.dark,
        marginBottom: "0.5rem",
        marginTop: "0rem"
    }
}));

function SectionTitle(props) {
    const classes = useStyles();
  return (<h2 className={classes.color}>{props.title}</h2>);
}

export default SectionTitle;
