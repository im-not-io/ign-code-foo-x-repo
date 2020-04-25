import React from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
    h1Color: {
        color: theme.palette.secondary.dark,
        fontWeight: "bold",
        fontSize: "2.25rem",
        marginBlockStart: "0.3em",
        marginBlockEnd: "0.3em"
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
