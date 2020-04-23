import React from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    h1Color: {
        color: theme.palette.secondary.dark,
        display: "flex",
        alignItems: "center",
        fontWeight: "bold",
        fontSize: "2.25rem"
    }
}));

function PageTitle(props) {
    const classes = useStyles();
  return (
    <h1 className={classes.h1Color}>
        {props.children}
    </h1>
  );
}

export default PageTitle;
