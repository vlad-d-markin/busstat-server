import React from 'react';
import {ListGroup, ListGroupItem, Button} from 'react-bootstrap';
import { Link } from 'react-router';


export default class Menu extends React.Component {
  render() {
    return (
      <ListGroup>
          <ListGroupItem><Link to="/admin/users">Users</Link></ListGroupItem>
          <ListGroupItem><Link to="/admin/stations">Stations</Link></ListGroupItem>
          <ListGroupItem><Link to="/admin/routes">Routes</Link></ListGroupItem>
          <ListGroupItem><Link to="/admin/about">About</Link></ListGroupItem>
      </ListGroup>
    );
  }
}