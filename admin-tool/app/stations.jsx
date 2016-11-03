import React from 'react';
import {
  Button, ControlLabel, FormGroup, FormControl, Pagination, Panel, Glyphicon, Grid, Row, Col,
  Table, ListGroup, ListGroupItem, Alert, ButtonToolbar } from 'react-bootstrap';

import StationActions from './components/station_actions.jsx';


class StationsAlert extends React.Component {
  render() {
    return(<Alert >{this.props.text}</Alert>)
  }
}


export default class Stations extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      stations : this.props.route.resource,
      stationsList : [],
      newStation : {
        title : ''
      },
      
      submitDisabled : false,
      
      showAlert: false,
      alertStyle : 'warning',
      alertText : '',

      activePage : 1
    };


    this.update = this.update.bind(this);
    this.submitNewStation = this.submitNewStation.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.update = this.update.bind(this);
    this.showAlert = this.showAlert.bind(this);

    this.update();
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
  
  submitNewStation() {
    console.log('New station ' + this.state.newStation.title);
    this.setState({ submitDisabled : true });
    
    this.state.stations.post(this.state.newStation).then(function(resp){
      if(resp.success) {
        this.update();
        this.showAlert('Successfully added new station', 'success');
        this.setState({ newStation : { title : "" }} );
      }
      else {
        this.showAlert('Failed to add new station. Error: ' + JSON.stringify(resp.error), 'danger');
        console.log(resp.error);
      }
      this.setState({ submitDisabled : false });
    }.bind(this));
  }
  
  handleTitleChange(e) {
    this.setState({ newStation : { title : e.target.value }} );
  }

  handleSelect(e) {
    console.log("Page: " + e);
    this.setState({ activePage : e} );
  }

  render() {   
    var stationTableItems = this.state.stationsList.map(function(station, idx){
      return(
        <tr key={idx}>
          <td>{idx + 1}</td>
          <td>{station.title}</td>
          <td>{station.s_id}</td>
          <td>not yet</td>
          <td>
              <StationActions
                  station={station}
                  onSuccess={this.update}
                  onAlert={this.showAlert}
                  resource={this.state.stations(station.s_id)}/>
          </td>
        </tr>
      );
    }.bind(this));
    
    var alert = this.state.showAlert ? <Alert bsStyle={this.state.alertStyle}>{this.state.alertText}</Alert> : '';

    const rowsPerPage = 15;
    var pagination =
        <Pagination
            prev
            next
            first
            last
            ellipsis
            boundaryLinks
            items={Math.ceil(stationTableItems.length / rowsPerPage)}
            maxButtons={5}
            activePage={this.state.activePage}
            onSelect={this.handleSelect} />;

    return (
      <div>
        <Panel header="Add new station" bsStyle="primary">
          <form>
            <FormGroup controlId="newStationTitle">
              <ControlLabel>Title: </ControlLabel>
              <FormControl
                  type="text"
                  value={this.state.newStation.title}
                  placeholder="Enter new station title"
                  onChange={this.handleTitleChange}></FormControl>
            </FormGroup>
            <Button bsStyle="primary" onClick={this.submitNewStation} disabled={this.state.submitDisabled} >
              <Glyphicon glyph="ok" /> Submit</Button>
          </form>
        </Panel>


            <Row>
              <Col sm={4}>
                <Panel>
                  <Button onClick={this.update}><Glyphicon glyph="refresh" /> Refresh</Button>
                </Panel>
              </Col>
              <Col sm={8}>{alert}</Col>
            </Row>



         <Table striped bordered condensed hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>S_ID</th>
                <th>Coordinates</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stationTableItems.slice((this.state.activePage-1) * rowsPerPage, this.state.activePage * rowsPerPage)}
            </tbody>
         </Table>

        {pagination}
     </div>
    );
  }
}