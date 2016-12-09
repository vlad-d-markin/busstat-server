import React from 'react';
import { Button, Panel, Glyphicon, Row, Col, Alert, InputGroup, FormControl } from 'react-bootstrap';


// New components
import NewStationForm from './components/NewStationForm.jsx';
import StationsTable from './components/StationsTable.jsx';



export default class Stations extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      routesAPI: this.props.route.routesAPI,
      stations : this.props.route.resource,
      stationsList : [],

      searchStation: '',

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

    this.handleSearchLineChange = this.handleSearchLineChange.bind(this);
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
      console.log(error);
    }
    else {
      this.showAlert(message, 'success');
      this.update();
    }
  }

  handleSearchLineChange(e) {
    this.setState({ searchStation : e.target.value } );
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



  // Deprecated
  showAlert(text, style) {
    this.props.showAlert(text, style);
        
//     this.setState({ showAlert: true, alertStyle : style, alertText : text });
//     window.setTimeout(function () {
//       this.setState({ showAlert: false, alertStyle : 'info', alertText : 'Nothing happened' });
//     }.bind(this), 3000);
  }
  // ==========



  render() {

    var alert = this.state.showAlert ? <Alert bsStyle={this.state.alertStyle}>{this.state.alertText}</Alert> : '';


    return (
      <div>
          <NewStationForm stations={this.state.stations} onDone={this.newStationFormDone} />

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
                    <FormControl type="text" placeholder="Station" onChange={this.handleSearchLineChange} />
                  </InputGroup>
                </Panel>
              </Col>
            </Row>

          <StationsTable
              stations={this.state.stationsList}
              stationsResource={this.state.stations}
              routesAPI={this.state.routesAPI}
              onActionDone={this.stationActionDone}
              searchStation={this.state.searchStation}
              rowsPerPage={14}
          />
     </div>
    );
  }
}