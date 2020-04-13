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
  return ( <Box className={classes.h1Color}>
            <h1>{props.title}</h1>
        </Box>
  );
}

export default PageTitle;
