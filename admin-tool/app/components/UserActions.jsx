import React from 'react';
import { Button, DropdownButton, InputGroup, MenuItem, Modal, Glyphicon, ButtonToolbar, FormGroup,
         FormControl, ControlLabel} from 'react-bootstrap';

// PROPS:
// user     [user = { login, role }]
// usersAPI [ARC resource]
// onDone   [function(message, error)]
export default class UserActions extends React.Component {
    constructor(props) {
        super(props);

        // Init state
        this.state = {
            usersAPI : this.props.usersAPI,

            user : this.props.user,

            newLogin : this.props.user.login,
            newRole : this.props.user.role,

            editorOpen : false,
            saveDisabled : false,
            removeDisabled : false
        };


        // Bind context
        this.openLoginEditor = this.openLoginEditor.bind(this);
        this.hideEditor = this.hideEditor.bind(this);
        this.handleLoginChange = this.handleLoginChange.bind(this);
        this.saveLoginAndRole = this.saveLoginAndRole.bind(this);
        this.removeStation = this.removeStation.bind(this);
        this.handleRoleAdminChange = this.handleRoleAdminChange.bind(this);
        this.handleRoleUserChange = this.handleRoleUserChange.bind(this);
        this.savePassword = this.savePassword.bind(this);
    }



    //
    openLoginEditor() {
        this.setState({ editorOpen: true });
    }


    //
    hideEditor() {
        this.setState({ editorOpen: false,  newLogin : this.props.user.login});
    }


    //
    handleLoginChange(e) {
        this.setState({ newLogin : e.target.value });
    }

    //
    handleRoleAdminChange() {
        this.setState({ newRole : "admin"});
    }

    //
    handleRoleUserChange() {
        this.setState({ newRole : "user"});
    }


    // Save
    saveLoginAndRole() {
        this.setState({ saveDisabled: true });

        this.state.usersAPI(this.state.user.login).put({ login : this.state.newLogin, role : this.state.newRole }).then(function (resp) {
            this.setState({ saveDisabled: false });

            if(resp.success) {
                this.setState({ user: {login : this.state.newLogin}});
                console.log("Successfully changed login-role");
                this.props.onDone("Successfully changed login-role", null);
            }
            else {
                console.error("Failed to changed login-role. Error: " + JSON.stringify(resp.error));
                this.props.onDone("Failed to changed login-role.", resp.error);
            }
        }.bind(this));

    }


    savePassword() {
        this.props.onDone("COMING SOON", null);
    }


    // Remove station
    removeStation() {
        this.setState({ removeDisabled: true });
        this.props.usersAPI(this.state.user.login).delete().then(function (resp) {
            this.setState({ removeDisabled: false });

            if(resp.success) {
                console.log("Successfully removed user " + this.state.user.login);
                this.props.onDone("Successfully removed user " + this.state.user.login, null);
            }
            else {
                console.error("Failed to remove user " + this.state.user.login + ". Error: " + JSON.stringify(resp.error));
                this.props.onDone("Failed to remove user" + this.state.user.login + ". Error: " +
                    JSON.stringify(resp.error), resp.error);
            }
        }.bind(this));
    }


    // Render component
    render() {
        return(
            <ButtonToolbar>
                <Button
                    onClick={this.openLoginEditor}
                    bsStyle="primary"
                    bsSize="xsmall">
                    <Glyphicon glyph="pencil" />&nbsp;
                    Edit
                </Button>

                <Button
                    onClick={this.savePassword}
                    bsStyle="info"
                    bsSize="xsmall">
                    <Glyphicon glyph="cog" />&nbsp;
                    Password
                </Button>

                <Button
                    onClick={this.removeStation}
                    disabled={this.state.removeDisabled}
                    bsStyle="danger"
                    bsSize="xsmall">
                    <Glyphicon glyph="trash" />&nbsp;
                    Remove
                </Button>

                <Modal
                    {...this.props}
                    show={this.state.editorOpen}
                    onHide={this.hideEditor}
                    dialogClassName="custom-modal"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-login-lg">Edit login</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <FormGroup controlId="newUserLoginRole">
                                <ControlLabel>Login: </ControlLabel>
                                <InputGroup>
                                    <FormControl
                                        type="text"
                                        value={this.state.newLogin}
                                        placeholder="Enter new user login"
                                        onChange={this.handleLoginChange}>
                                    </FormControl>
                                    <DropdownButton
                                        componentClass={InputGroup.Button}
                                        id="input-dropdown-addon"
                                        title={this.state.newRole}>
                                        <MenuItem key="1" onClick={this.handleRoleUserChange}>user</MenuItem>
                                        <MenuItem key="2" onClick={this.handleRoleAdminChange}>admin</MenuItem>
                                    </DropdownButton>
                                </InputGroup>
                            </FormGroup>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.hideEditor}>Close</Button>
                        <Button bsStyle="primary" onClick={this.saveLoginAndRole} disabled={this.state.saveDisabled} >Save</Button>
                    </Modal.Footer>
                </Modal>
            </ButtonToolbar>
        );
    }
}