import React from 'react';
import { Button, ControlLabel, FormGroup, FormControl, Panel, Glyphicon, ButtonToolbar } from 'react-bootstrap';

// Props: stations [ARC resource], onDone [function(error)]
export default class NewStationForm extends React.Component {
    constructor(props) {
        super(props);

        // Init component state
        this.state = {
            newStation : {
                title : ''
            },
            controlsDisabled : false
        };

        // Bind context
        this.submitNewStation   = this.submitNewStation.bind(this);
        this.cleanInputs        = this.cleanInputs.bind(this);
        this.handleTitleChange  = this.handleTitleChange.bind(this);
        this.setInProgressState = this.setInProgressState.bind(this);
    }


    // Disable controls
    setInProgressState(yes) {
        this.setState({ controlsDisabled : yes });
    }


    // Send new station to server
    submitNewStation() {
        console.log("Trying to add new station... [" + JSON.stringify(this.state.newStation) + "]");

        this.setInProgressState(true);

        // Send request to server
        this.props.stations.post(this.state.newStation).then(function(resp){
            this.setInProgressState(false);
            if(resp.success) {
                this.cleanInputs();
                console.log("Successfully created new station");
                this.props.onDone(null);

            }
            else {
                console.error("Failed to add new station. Error: " + JSON.stringify(resp.error));
                this.props.onDone(resp.error);
            }
        }.bind(this));
    }


    // Clean all inputs
    cleanInputs() {
        this.setState({ newStation : { title : '' }});
    }


    // Handle changing input
    handleTitleChange(e) {
        this.setState({ newStation : { title : e.target.value }} );
    }


    // Render component
    render() {
        return(
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

                    <ButtonToolbar>
                        <Button bsStyle="default" onClick={this.cleanInputs} disabled={this.state.controlsDisabled} >
                            <Glyphicon glyph="remove" /> Clear
                        </Button>
                        <Button bsStyle="primary" onClick={this.submitNewStation} disabled={this.state.controlsDisabled} >
                            <Glyphicon glyph="ok" /> Submit
                        </Button>
                    </ButtonToolbar>
                </form>
            </Panel>
        );
    }

}