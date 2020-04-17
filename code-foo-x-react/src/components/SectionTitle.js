import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    color: {
        color: theme.palette.secondary.dark,
        marginBottom: "0.5rem",
        marginTop: "0rem"
    }
}));

function SectionTitle(props) {
    const classes = useStyles();
  return (<h2 className={classes.color}>{props.children}</h2>);
}

export default SectionTitle;
