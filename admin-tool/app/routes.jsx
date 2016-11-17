import React from 'react';
import {Alert, Row, Col, Panel, Button, Glyphicon, ButtonToolbar,
    InputGroup, FormControl, DropdownButton, MenuItem} from 'react-bootstrap';

import RoutesTable from './components/RoutesTable.jsx';
import NewRouteForm from './components/NewRouteForm.jsx';
export default class Routes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      routesAPI: this.props.route.routesAPI,
      routesList: [],

      searchRoute: '',
      searchType: 'all',

      alerts: [],

      showAlert: false,
      alertStyle: 'warning',
      alertText: '',

      activePage: 1
    };
    this.update = this.update.bind(this);
    this.update();
    this.newRouteFormDone = this.newRouteFormDone.bind(this);
    this.showAlert = this.showAlert.bind(this);
    this.handleSearchLineAll = this.handleSearchLineAll.bind(this);
    this.handleSearchLineBus = this.handleSearchLineBus.bind(this);
    this.handleSearchLineChange = this.handleSearchLineChange.bind(this);
    this.handleSearchLineShuttleBus = this.handleSearchLineShuttleBus.bind(this);
    this.handleSearchLineTramway = this.handleSearchLineTramway.bind(this);
    this.handleSearchLineTrolleyBus = this.handleSearchLineTrolleyBus.bind(this);
    this.routeActionDone = this.routeActionDone.bind(this);
  }

    routeActionDone(text, err) {
        if(err) {
            this.showAlert(text+" "+err.message, 'danger');
        } else {
            this.showAlert(text, 'success');
            this.update();
        }
    }

    newRouteFormDone(err) {
      if(err) {
        this.showAlert('Failed to add new route. Error: ' + JSON.stringify(err), 'danger');
      }
      else {
        this.showAlert('Successfully created new route', 'success');
        this.update();
      }

    }

    showAlert(text, style) {
      this.props.showAlert(text, style);
      
//       this.setState({ showAlert: true, alertStyle : style, alertText : text });
//       window.setTimeout(function () {
//         this.setState({ showAlert: false, alertStyle : 'info', alertText : 'Nothing happened' });
//       }.bind(this), 3000);
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

    handleSearchLineChange(e)   { this.setState({ searchRoute : e.target.value } ); }
    handleSearchLineBus(e)    { this.setState({ searchType : 'bus' }) }
    handleSearchLineShuttleBus(e)    { this.setState({ searchType : 'shuttlebus' }) }
    handleSearchLineTrolleyBus(e)      { this.setState({ searchType : 'trolleybus' }) }
    handleSearchLineTramway(e)      { this.setState({ searchType : 'tramway' }) }
    handleSearchLineAll(e)      { this.setState({ searchType : 'all' }) }

  render()
    {
      var alert = this.state.showAlert ? <Alert bsStyle={this.state.alertStyle}>{this.state.alertText}</Alert> : '';

    return (
        <div>
            <NewRouteForm
                routesAPI = {this.state.routesAPI}
                onDone = {this.newRouteFormDone}
            />
            <Row>
                <Col sm={3}>
                    <Panel>
                        <Button onClick={this.update}><Glyphicon glyph="refresh" /> Refresh</Button>
                    </Panel>
                </Col>
                <Col sm={9}>
                    <Panel>
                        <InputGroup>
                            <InputGroup.Addon>
                                <Glyphicon glyph="search" />
                            </InputGroup.Addon>
                            <FormControl type="text" placeholder="title" onChange={this.handleSearchLineChange} />
                            <DropdownButton
                                componentClass={InputGroup.Button}
                                id="input-dropdown-addon"
                                title={this.state.searchType}>
                                <MenuItem key="1" onClick={this.handleSearchLineAll}>all</MenuItem>
                                <MenuItem key="2" onClick={this.handleSearchLineBus}>bus</MenuItem>
                                <MenuItem key="3" onClick={this.handleSearchLineShuttleBus}>shuttlebus</MenuItem>
                                <MenuItem key="4" onClick={this.handleSearchLineTrolleyBus}>trolleybus</MenuItem>
                                <MenuItem key="5" onClick={this.handleSearchLineTramway}>tramway</MenuItem>
                            </DropdownButton>
                        </InputGroup>
                    </Panel>
                </Col>
            </Row>
            <RoutesTable
                routes={this.state.routesList}
                routesAPI={this.state.routesAPI}
                searchRoute={this.state.searchRoute}
                searchType={this.state.searchType}
                onActionDone={this.routeActionDone}
                rowsPerPage={14}
            />
        </div>
    );
  }
}