import React from 'react';
import {ListGroup, ListGroupItem} from 'react-bootstrap';


export default class Users extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      users : this.props.route.resource,
      userList : []
    };
    
    
    this.state.users.get().then(function(res){
      console.log(res);
      return this.setState({userList : [res.message, 'hello from promise'] });
    }.bind(this));
  }
  
  render() {
    var table = this.state.userList.map(function(message){ return(<strong> {message} </strong>) });
    
    return (
      <p>{table}</p>
    );
  }
}