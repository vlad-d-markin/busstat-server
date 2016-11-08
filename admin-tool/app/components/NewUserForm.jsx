import React from 'react';
import { Alert, Row, Button, DropdownButton, MenuItem, InputGroup, Col, ControlLabel, Form, FormGroup, FormControl, Panel, Glyphicon, ButtonToolbar } from 'react-bootstrap';

//import AlertsBox from './components/AlertsBox.jsx';

// Props: stations [ARC resource], onDone [function(error)]
export default class NewUserForm extends React.Component {
    constructor(props) {
        super(props);

        // Init component state
        this.state = {
            newUser : {
                login : '',
                password: ''
            },
            userRole : 'user',

            controlsDisabled : false
        };

        // Bind context
        this.submitNewUser   = this.submitNewUser.bind(this);
        this.cleanInputs        = this.cleanInputs.bind(this);
        this.setInProgressState = this.setInProgressState.bind(this);
        this.handleLoginChange  = this.handleLoginChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleAdminRoleSelect = this.handleAdminRoleSelect.bind(this);
        this.handleUserRoleSelect = this.handleUserRoleSelect.bind(this);
        this.showAlert = this.showAlert.bind(this);
        this.newUserFormDone = this.newUserFormDone.bind(this);
    }

    // Disable controls
    setInProgressState(yes) {
        this.setState({ controlsDisabled : yes });
    }


    // Send new station to server
    submitNewUser() {
        console.log("NEWUSER = "+this.state.newUser.login + ' PWR='+this.state.newUser.password);
        console.log("Trying to add new user... [" + JSON.stringify(this.state.newUser) + "]");

        this.setInProgressState(true);


        // Send request to server
        this.props.usersResource.post(this.state.newUser).then(function(resp){
            this.setInProgressState(false);
            if(resp.success) {
                this.cleanInputs();
                console.log("Successfully created new user");
                this.newUserFormDone(null);
            }
            else {
                console.error("Failed to add new user. Error: " + JSON.stringify(resp.error));
                this.newUserFormDone(resp.error);
            }
        }.bind(this));
    }


    // Clean all inputs
    cleanInputs() {
        this.setState({ newUser : { login : '', password : '' }});
    }


    // Handle changing input
    handleLoginChange(e) {
        this.setState({ newUser : { login : e.target.value, password : this.state.newUser.password }} );
    }

    handlePasswordChange(e) {
        this.setState({ newUser : { login : this.state.newUser.login, password : e.target.value }} );
    }

    // Handle select role
    handleAdminRoleSelect(e) {
        this.setState( { userRole : "admin"} );
    }

    handleUserRoleSelect(e) {
        this.setState( { userRole : "user" } );
    }


    // New handlers
    newUserFormDone(error) {
        if(error) {
            this.showAlert('Failed to add new user. Error: ' + JSON.stringify(error), 'danger');
        }
        else {
            this.showAlert('Successfully created new user', 'success');
            this.update();
        }
    }

    showAlert(text, style) {
        this.setState({ showAlert: true, alertStyle : style, alertText : text });
        window.setTimeout(function () {
            this.setState({ showAlert: false, alertStyle : 'info', alertText : 'Nothing happened' });
        }.bind(this), 3000);
    }


    // Render component
    render() {

        var alert = this.state.showAlert ? <Alert height="100px" bsStyle={this.state.alertStyle}>{this.state.alertText}</Alert> : '';

        return(
            <Panel header="Add new user" bsStyle="primary">
                <Form horizontal>
                    <FormGroup controlId="newUser">
                        <Col componentClass={ControlLabel} sm={2}>
                            Login
                        </Col>
                        <Col sm={9}>
                            <FormControl
                                type="login"
                                value={this.state.newUser.login}
                                placeholder="Login"
                                onChange={this.handleLoginChange}>
                            </FormControl>
                        </Col>
                    </FormGroup>

                    <FormGroup controlId="newUser">
                        <Col componentClass={ControlLabel} sm={2}>
                            Password
                        </Col>
                        <Col sm={9}>
                            <InputGroup>
                                <FormControl
                                    type="text"
                                    value={this.state.newUser.password}
                                    placeholder="Password"
                                    onChange={this.handlePasswordChange}>
                                </FormControl>
                                <DropdownButton
                                    componentClass={InputGroup.Button}
                                    id="input-dropdown-addon"
                                    title={this.state.userRole}>
                                    <MenuItem key="1" onClick={this.handleUserRoleSelect}>user</MenuItem>
                                    <MenuItem key="2" onClick={this.handleAdminRoleSelect}>admin</MenuItem>
                                </DropdownButton>
                            </InputGroup>
                        </Col>
                    </FormGroup>

                    <Col sm={4}>
                        <Panel>
                            <ButtonToolbar>
                                <Button bsStyle="default" onClick={this.cleanInputs} disabled={this.state.controlsDisabled} >
                                    <Glyphicon glyph="remove" /> Clear
                                </Button>
                                <Button bsStyle="primary" onClick={this.submitNewUser} disabled={this.state.controlsDisabled} >
                                    <Glyphicon glyph="ok" /> Submit
                                </Button>
                            </ButtonToolbar>
                        </Panel>
                    </Col>
                    <Col sm={7}>{alert}</Col>
                </Form>
            </Panel>
        );
    }

}



