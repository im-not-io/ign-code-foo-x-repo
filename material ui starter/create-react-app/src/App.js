import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import { ThemeProvider } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import Todos from './components/Todos';
import AddTodo from './components/AddTodo';
import { useState } from "react";
import {v4 as uuid} from "uuid"; 


const theme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#FE6B8B',
      contrastText: '#FFFFFF'
    }
  },
});

const useStyles = makeStyles(theme => ({
  appBar: {
    flexGrow: 1,
    border: 0,
    color: 'white',
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    borderBottomLeftRadius: '20px',
    borderBottomRightRadius: '20px',
  },
  title: {
    flexGrow: 1,
  },
  cardItem: {
    marginTop: '2%',
  }
}));

export class App extends Component {
state = {
    info: {
      title: "To do list app",
      author: "Nick DiGeronimo"
    },
    todos: [
      {
        id: 1,
        title: "Example of a completed task",
        completed: true,
        deleted: false
      },
      {
        id: 2,
        title: "Option 2",
        completed: false,
        deleted: false
      },
    ]
  };
  markComplete = (id) => {
    const temp = {
      todos: this.state.todos.map(todo => {
        if (todo.id === id) {
          todo.completed = !todo.completed
        }
        return todo;
      })
    };
    this.setState(temp)
  }

  deleteTodo = (id) => {
    const temp = {
      todos: this.state.todos.map(todo => {
        if (todo.id === id) {
          todo.deleted = true;
        }
        return todo;
      })
    };
    this.setState(temp);
    console.log(this.state.todos);
    setTimeout(() => {
      this.setState({todos: [...this.state.todos.filter(todo => todo.id !== id)]});
      console.log(this.state.todos);
    }, 500);
  }

  addTodo = (title) => {
    const newTodo = {
      id: uuid(),
      title: title,
      completed: false,
      deleted: false
    };
    console.log(newTodo)
    this.setState({
      todos: [...this.state.todos, newTodo]
    })
  }

  
  render() {

    // classes = useStyles();
    return (
      <ThemeProvider theme={theme}>
        <Todos todos={this.state.todos} info={this.state.info} markComplete={this.markComplete} deleteTodo={this.deleteTodo} />
        <AddTodo addTodo={this.addTodo} />
      </ThemeProvider>
    );
  }




}
