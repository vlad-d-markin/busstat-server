import React from 'react';
import {ListGroup, ListGroupItem} from 'react-bootstrap';
import { Link } from 'react-router';


export default class Menu extends React.Component {
  render() {
    return (
      <ListGroup>
        <ListGroupItem><Link to="/users">Users</Link></ListGroupItem>
        <ListGroupItem><Link to="/stations">Stations</Link></ListGroupItem>
        <ListGroupItem><Link to="/routes">Routes</Link></ListGroupItem>
      </ListGroup>
    );
  }
}