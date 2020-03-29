import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import { createMuiTheme } from '@material-ui/core/styles';
import { Todo } from './Todo'
import List from '@material-ui/core/List';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AppBar from '@material-ui/core/AppBar';
import { withStyles } from "@material-ui/core/styles";


// const theme = createMuiTheme({
//   palette: {
//     light: '#757ce8',
//     main: '#ed758c',
//     dark: '#002884',
//     contrastText: '#fff'
//   },
// });

// const useStyles = makeStyles(theme => ({
//   appBar: {
//     flexGrow: 1,
//     border: 0,
//     color: 'white',
//     background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
//   },
// title: {
//     flexGrow: 1,
//   },
// }));


const styles = theme => ({
  appBar: {
    flexGrow: 1,
    border: 0,
    color: 'white',
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  },
title: {
    flexGrow: 1,
  },
});


function generateRows(props) {
    return props.todos.map((todo) => (
        <Todo deleted={todo.deleted} title={todo.title} key={todo.id} id={todo.id} completed={todo.completed} markComplete={props.markComplete} deleteTodo={props.deleteTodo}></Todo>
    ));
}

class Todos extends Component {
    
    render() {
    const { classes } = this.props;
    return (
        <Grid container
        direction="row"
        justify="center"
        spacing={3}>
            <Grid item xs={12}>
            <AppBar position="static" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                    {this.props.info.title}
                    </Typography>
                    <Button color="inherit">Coded by {this.props.info.author}</Button>
                </Toolbar>
            </AppBar>
        </Grid>
            <Grid item xs={6}>
                <List>
                {generateRows(this.props)}
                </List>
            </Grid>
        </Grid>
    );
    }
}

export default withStyles(styles)(Todos);