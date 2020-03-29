import React, { useState, Component } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import DeleteIcon from '@material-ui/icons/Delete';
import Slide from '@material-ui/core/Slide';


export class Todo extends Component {

    getStyle = () => {
        return {
            textDecoration: this.props.completed ? 'line-through' :  'none'
        }
    }


    render() {
        return (
        <Slide direction="left" timeout={{enter: 0, exit: 200}} in={!this.props.deleted} unmountOnExit>
            <ListItem dense button role={undefined} onClick={this.props.markComplete.bind(this, this.props.id)}>
                <Checkbox checked={this.props.completed} edge="start"
                        tabIndex={-1}
                        disableRipple
                        />
                <ListItemText style={this.getStyle()} primary={this.props.title}/>
                <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete" onClick={this.props.deleteTodo.bind(this, this.props.id)}>
                        <DeleteIcon />
                    </IconButton>
                </ListItemSecondaryAction>
          </ListItem>
        </Slide>
          )
    }

}
