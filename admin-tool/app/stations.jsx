import React from 'react';
import {
  Button, ControlLabel, FormGroup, FormControl, Pagination, Panel, Glyphicon, Grid, Row, Col,
  Table, ListGroup, ListGroupItem, Alert, ButtonToolbar } from 'react-bootstrap';


// New components
import NewStationForm from './components/NewStationForm.jsx';
import StationsTable from './components/StationsTable.jsx';



export default class Stations extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      stations : this.props.route.resource,
      stationsList : [],

      alerts : [],
      
      showAlert: false,
      alertStyle : 'warning',
      alertText : '',

      activePage : 1
    };


    this.update = this.update.bind(this);
    this.showAlert = this.showAlert.bind(this);

    this.update();

    this.newStationFormDone = this.newStationFormDone.bind(this);
    this.stationActionDone = this.stationActionDone.bind(this);
  }

  // New handlers
  newStationFormDone(error) {
    if(error) {
      this.showAlert('Failed to add new station. Error: ' + JSON.stringify(error), 'danger');
    }
    else {
      this.showAlert('Successfully created new station', 'success');
      this.update();
    }
  }


  stationActionDone(message, error) {
    if(error) {
      this.showAlert(message, 'danger');
    }
    else {
      this.showAlert(message, 'success');
      this.update();
    }
  }




  showAlert(text, style) {
    this.setState({ showAlert: true, alertStyle : style, alertText : text });
    window.setTimeout(function () {
      this.setState({ showAlert: false, alertStyle : 'info', alertText : 'Nothing happened' });
    }.bind(this), 3000);
  }
  
  update() {
    this.state.stations.get().then(function(resp) {   
      if(resp.success) {
        this.setState({stationsList : resp.stations});
        console.log('Successfully updated stations list');
      }
      else {
        this.setState({stationsList : [] });
        this.showAlert('Failed to update stations list', 'danger');
        console.error('Failed to update stations list');
      }
    }.bind(this));
  }


  render() {
    
    var alert = this.state.showAlert ? <Alert bsStyle={this.state.alertStyle}>{this.state.alertText}</Alert> : '';


    return (
      <div>
          <NewStationForm stations={this.state.stations} onDone={this.newStationFormDone} />

            <Row>
              <Col sm={4}>
                <Panel>
                  <Button onClick={this.update}><Glyphicon glyph="refresh" /> Refresh</Button>
                </Panel>
              </Col>
              <Col sm={8}>{alert}</Col>
            </Row>

          <StationsTable
              stations={this.state.stationsList}
              stationsResource={this.state.stations}
              onActionDone={this.stationActionDone}
              rowsPerPage={14}
          />
     </div>
    );
  }
}