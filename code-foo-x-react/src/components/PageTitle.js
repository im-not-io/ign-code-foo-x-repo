import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

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
