import React from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    h1Color: {
        color: theme.palette.secondary.dark
    }
}));

function PageTitle(props) {
    const classes = useStyles();
  return (
        <Box>
            <h1 className={classes.h1Color}>{props.title}</h1>
        </Box>
  );
}

export default PageTitle;
