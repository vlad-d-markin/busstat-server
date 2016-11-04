import React from 'react';
import { Alert } from 'react-bootstrap';


// Props: alerts [Array]:[{message, style}, ...]
export default class Stations extends React.Component {
    constructor(props) {
        this.state = {
            message : '',
            style : 'default'
        };

        this.nextAlert = this.nextAlert.bind(this);
    }

    nextAlert() {
        var next = this.props.alerts.pop();
        this.setState({ message: next.message, style: next.style });
    }

    render() {
        if(this.props && this.props.length) {

        }
        return(<Alert bsStyle={this.state.style}>{this.state.message}</Alert>);
    }
}