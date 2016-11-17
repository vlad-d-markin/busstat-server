import React from 'react';
import { Row, Button, DropdownButton, MenuItem, InputGroup, Col, ControlLabel, Form, FormGroup,
         FormControl, Panel, Glyphicon, ButtonToolbar } from 'react-bootstrap';


// PROPS:
// onDone       [function(error)]
// adminAPI  [server route] to create new user
// registrationAPI   [server route] to create new admin
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
        this.answerRequest = this.answerRequest.bind(this);
    }

    // Disable controls
    setInProgressState(yes) {
        this.setState({ controlsDisabled : yes });
    }


    // Send new station to server
    submitNewUser() {
        console.log("Trying to add new user... [" + JSON.stringify(this.state.newUser) + "]");
        this.setInProgressState(true);

        if(this.state.userRole === 'admin') {
            this.props.adminAPI.post(this.state.newUser).then(this.answerRequest);
        } else {
            this.props.registrationAPI.post(this.state.newUser).then(this.answerRequest);
        }
    }


    answerRequest(resp) {
        this.setInProgressState(false);
        if(resp.success) {
            this.cleanInputs();
            console.log("Successfully created new "+this.state.userRole);
            this.props.onDone(null);
        } else {
            console.error("Failed to add new "+this.state.userRole+". Error: " + JSON.stringify(resp.error));
            this.props.onDone(resp.error);
        }
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


    // Render component
    render() {
        return(
            <Panel header="Add new user" bsStyle="primary">
                <Form horizontal>

                    <FormGroup controlId="newUser">

                        <Col componentClass={ControlLabel} sm={2}>
                            Login
                        </Col>
                        <Col sm={9}>
                            <InputGroup>
                                <DropdownButton
                                    componentClass={InputGroup.Button}
                                    id="input-dropdown-addon"
                                    title={this.state.userRole}>
                                    <MenuItem key="1" onClick={this.handleUserRoleSelect}>user</MenuItem>
                                    <MenuItem key="2" onClick={this.handleAdminRoleSelect}>admin</MenuItem>
                                </DropdownButton>
                                <FormControl
                                    type="login"
                                    value={this.state.newUser.login}
                                    placeholder="Login"
                                    onChange={this.handleLoginChange}>
                                </FormControl>
                            </InputGroup>
                        </Col>
                    </FormGroup>

                    <FormGroup controlId="newUser">
                        <Col componentClass={ControlLabel} sm={2}>
                            Password
                        </Col>
                        <Col sm={9}>
                                <FormControl
                                    type="text"
                                    value={this.state.newUser.password}
                                    placeholder="Password"
                                    onChange={this.handlePasswordChange}>
                                </FormControl>                                
                        </Col>
                    </FormGroup>

                    <FormGroup>
                        <Col sm={9} smOffset={2}>
                            <ButtonToolbar className="pull-right">
                                <Button bsStyle="default" onClick={this.cleanInputs} disabled={this.state.controlsDisabled} >
                                    <Glyphicon glyph="remove" /> Clear
                                </Button>
                                <Button bsStyle="primary" onClick={this.submitNewUser} disabled={this.state.controlsDisabled} >
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
