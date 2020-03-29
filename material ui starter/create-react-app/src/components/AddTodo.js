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
import TextField from '@material-ui/core/TextField';


const styles = theme => ({
    addTodoButton: {
        width: "100%",
        height: "100%"
    },
    todoTextField: {
        width: "100%",
        height: "100%"

    },
    grid: {
        // border: "solid 2px blue",
    },
    addToDoForm: {
        display: "flex",
        flexDirection: "row"
    }
  });
  

class AddTodo extends Component {
    state = {
        title: ''
    }
    onChange = (e) => {
        this.setState({ title: e.target.value });
    };

     submitTodo = () => {
        this.props.addTodo(this.state.title);
        this.setState({ title: "" });
        
    };

    onKeyDown = (e) => {
        if (e.keyCode === 13) {
            this.submitTodo();
        }
        
    }

    render() {
    const { classes } = this.props;
        return (
            <Grid container
            direction="row"
            justify="center"
            spacing={1}>
                    <Grid item xs={5} className={classes.grid}>
                        <TextField onKeyDown={this.onKeyDown} value={this.state.title} onChange={this.onChange} size="small" className={classes.todoTextField} label="What would you like to do?" variant="outlined" />
                    </Grid>
                    <Grid item xs={1} className={classes.grid}>
                        <Button onClick={this.submitTodo} variant="contained" className={classes.addTodoButton} color="primary">Add todo</Button>
                    </Grid>
            </Grid>
                
        );
    }
}

export default withStyles(styles)(AddTodo);