import React from 'react';
import { Button, DropdownButton, InputGroup, MenuItem, Modal, Glyphicon, ButtonToolbar,
         FormGroup, FormControl, ControlLabel} from 'react-bootstrap';


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

            // login changing modal
            newLogin : this.props.user.login,
            newRole : this.props.user.role,
            editorLoginOpen : false,
            saveLoginDisabled : false,
            removeLoginDisabled : false,

            // password changing modal
            curPassword: "",
            newPassword: "",
            editorPasswordOpen : false,
            savePasswordDisabled : false,
            removePasswordDisabled : false
        };


        // BIND CONTEXT
        this.updateUserData = this.updateUserData.bind(this);

        // login changing modal
        this.openLoginEditor = this.openLoginEditor.bind(this);
        this.hideLoginEditor = this.hideLoginEditor.bind(this);
        this.handleLoginChange = this.handleLoginChange.bind(this);
        this.handleRoleAdminChange = this.handleRoleAdminChange.bind(this);
        this.handleRoleUserChange = this.handleRoleUserChange.bind(this);
        this.saveLoginAndRole = this.saveLoginAndRole.bind(this);

        // password changing modal
        this.openPasswordEditor = this.openPasswordEditor.bind(this);
        this.hidePasswordEditor = this.hidePasswordEditor.bind(this);
        this.handleCurPasswordChange = this.handleCurPasswordChange.bind(this);
        this.handleNewPasswordChange = this.handleNewPasswordChange.bind(this);
        this.savePassword = this.savePassword.bind(this);

        // deleting user modal
        this.removeUser = this.removeUser.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.user != this.props.user) {
            this.updateUserData(nextProps);
        }
    }

    updateUserData(nextProps) {
        this.setState({ newLogin: nextProps.user.login});
    }


    // Handle changing in Login-Role editor
    openLoginEditor()       { this.setState({ editorLoginOpen: true }); }
    hideLoginEditor()       { this.setState({ editorLoginOpen: false,  newLogin : this.props.user.login, newRole: this.props.user.role}); }
    handleLoginChange(e)    { this.setState({ newLogin: e.target.value }); }
    handleRoleAdminChange() { this.setState({ newRole: "admin"}); }
    handleRoleUserChange()  { this.setState({ newRole: "user"}); }

    // Save new Login and Role
    saveLoginAndRole() {
        this.setState({ saveLoginDisabled: true });

        this.state.usersAPI('login/'+this.props.user.login).put({ login : this.state.newLogin, role : this.state.newRole }).then(function (resp) {
            this.setState({ saveLoginDisabled: false, editorLoginOpen : false });
            if(resp.success) {
                console.log("Successfully changed login-role");
                this.props.onDone("Successfully changed login-role", null);
            }
            else {
                console.error("Failed to changed login-role. Error: " + JSON.stringify(resp.error));
                this.props.onDone("Failed to changed login-role.", resp.error);
            }
        }.bind(this));
    }


    // Handle changing in Password editor
    openPasswordEditor()        { this.setState({ editorPasswordOpen: true }); };
    hidePasswordEditor()        { this.setState({ editorPasswordOpen: false, curPassword: "", newPassword: ""}); };
    handleCurPasswordChange(e)  { this.setState({ curPassword: e.target.value }); };
    handleNewPasswordChange(e)  { this.setState({ newPassword: e.target.value }); };

    // Save new Password
    savePassword() {
        this.setState({ savePasswordDisabled: true });

        this.state.usersAPI('password/'+this.props.user.login)
            .put({ password: this.state.curPassword, newPassword: this.state.newPassword }).then(function (resp) {

            this.setState({ savePasswordDisabled: false, editorPasswordOpen : false, curPassword: "", newPassword: ""});

            if(resp.success) {
                console.log("Successfully changed password");
                this.props.onDone("Successfully changed password", null);
            }
            else {
                console.error("Failed to changed password. Error: " + JSON.stringify(resp.error));
                this.props.onDone("Failed to changed password.", new Error(resp.error));
            }
        }.bind(this))
    }


    // Remove station
    removeUser() {
        this.setState({removeLoginDisabled: true});
        this.props.usersAPI(this.props.user.login).delete().then(function (resp) {
            this.setState({removeLoginDisabled: false});

            if (resp.success) {
                console.log("Successfully removed user " + this.props.user.login);
                this.props.onDone("Successfully removed user " + this.props.user.login, null);
            }
            else {
                console.error("Failed to remove user " + this.props.user.login + ". Error: " + JSON.stringify(resp.error));
                this.props.onDone("Failed to remove user" + this.props.user.login + ". Error: " +
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
                    onClick={this.openPasswordEditor}
                    bsStyle="info"
                    bsSize="xsmall">
                    <Glyphicon glyph="cog" />&nbsp;
                    Password
                </Button>

                <Button
                    onClick={this.removeUser}
                    disabled={this.state.removeLoginDisabled}
                    bsStyle="danger"
                    bsSize="xsmall">
                    <Glyphicon glyph="trash" />&nbsp;
                    Remove
                </Button>

                <Modal
                    {...this.props}
                    show={this.state.editorLoginOpen}
                    onHide={this.hideLoginEditor}
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
                        <Button onClick={this.hideLoginEditor}>Close</Button>
                        <Button bsStyle="primary" onClick={this.saveLoginAndRole} disabled={this.state.saveLoginDisabled} >Save</Button>
                    </Modal.Footer>
                </Modal>

                <Modal
                    {...this.props}
                    show={this.state.editorPasswordOpen}
                    onHide={this.hidePasswordEditor}
                    dialogClassName="custom-modal"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-login-lg">Edit password</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <FormGroup controlId="curUserPassword">
                                <ControlLabel>Current password: </ControlLabel>
                                <FormControl
                                    type="text"
                                    value={this.state.curPassword}
                                    placeholder="Enter current user password"
                                    onChange={this.handleCurPasswordChange}>
                                </FormControl>
                            </FormGroup>
                            <FormGroup controlId="newUserPassword">
                                <ControlLabel>New password: </ControlLabel>
                                <FormControl
                                    type="text"
                                    value={this.state.newPassword}
                                    placeholder="Enter new user password"
                                    onChange={this.handleNewPasswordChange}>
                                </FormControl>
                            </FormGroup>
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.hidePasswordEditor}>Close</Button>
                        <Button bsStyle="primary" onClick={this.savePassword} disabled={this.state.savePasswordDisabled} >Save</Button>
                    </Modal.Footer>
                </Modal>

            </ButtonToolbar>
        );
    }
}