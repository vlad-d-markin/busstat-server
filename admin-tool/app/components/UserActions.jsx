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
        this.openEditor = this.openEditor.bind(this);
        this.hideEditor = this.hideEditor.bind(this);
        this.handleLoginChange = this.handleLoginChange.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.removeStation = this.removeStation.bind(this);
        this.handleRoleAdminChange = this.handleRoleAdminChange.bind(this);
        this.handleRoleUserChange = this.handleRoleUserChange.bind(this);
    }



    //
    openEditor() {
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
    saveChanges() {
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


    // Remove station
    removeStation() {
        console.log("I DELETE USER = "+this.state.user.login);

        this.setState({ removeDisabled: true });
/*
        this.props.resource.delete().then(function (resp) {
            this.setState({ removeDisabled: false });

            if(resp.success) {
                console.log("Successfully removed station " + this.state.title);
                this.props.onDone("Successfully removed station " + this.state.title, null);
            }
            else {
                console.error("Failed to remove station " + this.state.title + ". Error: " + JSON.stringify(resp.error));
                this.props.onDone("Failed to remove station" + this.state.title + ". Error: " +
                    JSON.stringify(resp.error), resp.error);
            }
        }.bind(this));*/
    }


    // Render component
    render() {
        return(
            <ButtonToolbar>
                <Button
                    onClick={this.openEditor}
                    bsStyle="primary"
                    bsSize="xsmall">
                    <Glyphicon glyph="pencil" />&nbsp;
                    Edit
                </Button>

                <Button
                    onClick={this.openEditor}
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
                        <Button bsStyle="primary" onClick={this.saveChanges} disabled={this.state.saveDisabled} >Save</Button>
                    </Modal.Footer>
                </Modal>
            </ButtonToolbar>
        );
    }
}