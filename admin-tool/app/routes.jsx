import React from 'react';
import {ListGroup, ListGroupItem} from 'react-bootstrap';

import RoutesTable from './components/RoutesTable.jsx';
export default class Routes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      routesAPI: this.props.route.routesAPI,
      routesList: [],

      searchRoute: '',

      alerts: [],

      showAlert: false,
      alertStyle: 'warning',
      alertText: '',

      activePage: 1
    };
    this.update = this.update.bind(this);
    this.update();
  }

    update() {
      this.state.routesAPI.get().then(function (resp) {
        if(resp.success) {
          this.setState({routesList: resp.routes});
          console.log('Successfully updated routes list');
        } else {
          this.setState({routesList: [] });
          this.showAlert('Failed to update routes list', 'danger');
          console.error('Failed to update routes list');
        }
      }.bind(this));
    }

  render()
    {
    return (
    <div>
      <RoutesTable
          routes={this.state.routesList}
          routesAPI={this.state.routesAPI}
          searchRoute={this.state.searchRoute}
          rowsPerPage={14}
      />
    </div>
    );
  }
}