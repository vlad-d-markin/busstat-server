import React from 'react';
import { Button, ControlLabel, FormGroup, FormControl, Panel, Glyphicon, ButtonToolbar } from 'react-bootstrap';


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
            controlsDisabled : false
        };

        // Bind context
        this.submitNewUser   = this.submitNewUser.bind(this);
        this.cleanInputs        = this.cleanInputs.bind(this);
        this.handleLoginChange  = this.handleLoginChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.setInProgressState = this.setInProgressState.bind(this);
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
                this.props.onDone(null);
            }
            else {
                console.error("Failed to add new user. Error: " + JSON.stringify(resp.error));
                this.props.onDone(resp.error);
            }
        }.bind(this));
    }


    // Clean all inputs
    cleanInputs() {
        this.setState({ newUser : { login : '', password : '' }});
    }


    // Handle changing input
    handleLoginChange(e) {
        this.setState({ newUser : { login : e.target.value }} );
    }

    handlePasswordChange(e) {
        this.setState({ newUser : { password : e.target.value }} );
    }


    // Render component
    render() {
        return(
            <Panel header="Add new user" bsStyle="primary">
                <form>
                    <FormGroup controlId="newUserLogin">
                        <ControlLabel>Login: </ControlLabel>
                        <FormControl
                            type="text"
                            value={this.state.newUser.login}
                            placeholder="Login"
                            onChange={this.handleLoginChange}></FormControl>
                        <br></br>
                        <ControlLabel>Password: </ControlLabel>
                        <FormControl
                            type="text"
                            value={this.state.newUser.password}
                            placeholder="Password"
                            onChange={this.handlePasswordChange}></FormControl>
                    </FormGroup>

                    <ButtonToolbar>
                        <Button bsStyle="default" onClick={this.cleanInputs} disabled={this.state.controlsDisabled} >
                            <Glyphicon glyph="remove" /> Clear
                        </Button>
                        <Button bsStyle="primary" onClick={this.submitNewUser} disabled={this.state.controlsDisabled} >
                            <Glyphicon glyph="ok" /> Submit
                        </Button>
                    </ButtonToolbar>
                </form>
            </Panel>
        );
    }

}



