import React from 'react';
import { Row, Button, DropdownButton, MenuItem, InputGroup, Col, ControlLabel, Form, FormGroup,
    FormControl, Panel, Glyphicon, ButtonToolbar } from 'react-bootstrap';

// PROPS:
// onDone       [function(error)]
// routeAPI  [server route] to create new user

export default class NewRouteForm extends React.Component {
    constructor(props) {
        super(props);

        // Init component state
        this.state = {
            title: '',
            cost: '',
            transport_type: 'bus',

            controlsDisabled : false
        };

        this.submitNewRoute   = this.submitNewRoute.bind(this);
        this.cleanInputs        = this.cleanInputs.bind(this);
        this.setInProgressState = this.setInProgressState.bind(this);
        this.handleTitleChange  = this.handleTitleChange.bind(this);
        this.handleCostChange = this.handleCostChange.bind(this);
        this.handleBusTypeSelect = this.handleBusTypeSelect.bind(this);
        this.handleShuttleBusTypeSelect = this.handleShuttleBusTypeSelect.bind(this);
        this.handleTrolleyBusTypeSelect = this.handleTrolleyBusTypeSelect.bind(this);
        this.handleTramwayTypeSelect = this.handleTramwayTypeSelect.bind(this);
        this.answerRequest = this.answerRequest.bind(this);
    }

    // Disable controls
    setInProgressState(yes) {
        this.setState({ controlsDisabled : yes });
    }


    // Send new station to server
    submitNewRoute() {
        console.log("Trying to add new route... [" + this.state.title);
        this.setInProgressState(true);
        var newRoute = {
                        "title":this.state.title,
                        "cost":this.state.cost,
                        "transport_type": this.state.transport_type};
        this.props.routesAPI.post(newRoute).then(this.answerRequest);
    }

    answerRequest(resp) {
        this.setInProgressState(false);
        if(resp.success) {
            console.log("Successfully created new "+this.state.title);
            this.cleanInputs();
            this.props.onDone(null);
        } else {
            console.error("Failed to add new "+this.state.title+". Error: " + JSON.stringify(resp.error));
            this.props.onDone(resp.error);
        }
    }

    // Clean all inputs
    cleanInputs() {
        this.setState({title: '', cost: '', transport_type: 'bus'});
    }


    // Handle changing input
    handleTitleChange(e) {
        this.setState({title : e.target.value} );
    }

    handleCostChange(e) {
        this.setState({ cost : e.target.value} );
    }


    handleBusTypeSelect(e) {
        this.setState( { transport_type : "bus"} );
    }


    handleTrolleyBusTypeSelect(e) {
        this.setState( { transport_type : "trolleybus"} );
    }

    handleTramwayTypeSelect(e) {
        this.setState( { transport_type : "tramway"} );
    }

    handleShuttleBusTypeSelect(e) {
        this.setState( { transport_type : "shuttlebus"} );
    }



    // Render component
    render() {
        return(
            <Panel header="Add new route" bsStyle="primary">
                <Form horizontal>

                    <FormGroup controlId="newRoute">

                        <Col componentClass={ControlLabel} sm={2}>
                            Title
                        </Col>
                        <Col sm={9}>
                            <FormControl
                                type="text"
                                value={this.state.title}
                                placeholder="title"
                                onChange={this.handleTitleChange}>
                            </FormControl>
                        </Col>
                    </FormGroup>

                    <FormGroup controlId="newRoute">
                        <Col componentClass={ControlLabel} sm={2}>
                            Cost
                        </Col>
                        <Col sm={9}>
                            <InputGroup>
                                <FormControl
                                    type="text"
                                    value={this.state.cost}
                                    placeholder="Cost"
                                    onChange={this.handleCostChange}>
                                </FormControl>
                                <DropdownButton
                                    componentClass={InputGroup.Button}
                                    id="input-dropdown-addon"
                                    title={this.state.transport_type}>
                                    <MenuItem key="1" onClick={this.handleBusTypeSelect}>bus</MenuItem>
                                    <MenuItem key="2" onClick={this.handleShuttleBusTypeSelect}>shuttlebus</MenuItem>
                                    <MenuItem key="3" onClick={this.handleTramwayTypeSelect}>tramway</MenuItem>
                                    <MenuItem key="4" onClick={this.handleTrolleyBusTypeSelect}>trolleybus</MenuItem>
                                </DropdownButton>
                            </InputGroup>
                        </Col>
                    </FormGroup>

                    <FormGroup>
                        <Col sm={9} smOffset={2}>
                            <ButtonToolbar className="pull-right">
                                <Button bsStyle="default" onClick={this.cleanInputs} disabled={this.state.controlsDisabled} >
                                    <Glyphicon glyph="remove" /> Clear
                                </Button>
                                <Button bsStyle="primary" onClick={this.submitNewRoute} disabled={this.state.controlsDisabled} >
                                    <Glyphicon glyph="ok" /> Submit
                                </Button>
                            </ButtonToolbar>
                        </Col>
                    </FormGroup>
                </Form>
            </Panel>
        );
    }

}
