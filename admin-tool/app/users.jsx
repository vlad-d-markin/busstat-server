import React from 'react';
import {Alert, Row, Col, Panel, Button, Glyphicon, ButtonToolbar} from 'react-bootstrap';


// New components
import NewUserForm from './components/NewUserForm.jsx';
import UsersTable from './components/UsersTable.jsx';


// PROPS:
// usersAPI         [ARC resource]
// adminAPI         [ARC resource]
// registrationAPI  [ARC resource]
// component        {Users}
export default class Users extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
            usersList : [],
            usersAPI : this.props.route.usersAPI,
            registrationAPI: this.props.route.registrationAPI,
            adminAPI: this.props.route.adminAPI,

            showAlert: false,
            alertStyle : 'warning',
            alertText : '',
        };

        this.update = this.update.bind(this);
        this.newUserFormDone = this.newUserFormDone.bind(this);
        this.userActionDone = this.userActionDone.bind(this);
        this.showAlert = this.showAlert.bind(this);
        this.update();
    }


    // New handlers
    newUserFormDone(err) {
        if(err) {
            this.showAlert('Failed to add new user. Error: ' + JSON.stringify(err), 'danger');
        }
        else {
            this.showAlert('Successfully created new user', 'success');
        }

    }

    userActionDone(text, err) {
        if(err) {
            this.showAlert(text+err.message, 'danger');
        }
        else {
            this.showAlert(text, 'success');
            this.update();
        }
    }

    showAlert(text, style) {
        this.setState({ showAlert: true, alertStyle : style, alertText : text });
        window.setTimeout(function () {
            this.setState({ showAlert: false, alertStyle : 'info', alertText : 'Nothing happened' });
        }.bind(this), 3000);
    }


    update() {
        this.state.usersAPI.get().then(function (resp) {
            if(resp.success) {
                this.setState({usersList: resp.users});
                console.log('Successfully updated users list');
            } else {
                this.setState({usersList: [] });
                this.showAlert('Failed to update users list', 'danger');
                console.error('Failed to update users list');
            }
        }.bind(this));
    }


    render() {

        var alert = this.state.showAlert ? <Alert bsStyle={this.state.alertStyle}>{this.state.alertText}</Alert> : '';

        return (
            <div>
                <NewUserForm
                    adminAPI={this.state.adminAPI}
                    registrationAPI={this.state.registrationAPI}
                    onDone={this.newUserFormDone} />
                <Row>
                </Row>
                <Row>
                    <Col sm={4}>
                        <Panel>
                            <Button onClick={this.update}><Glyphicon glyph="refresh" /> Refresh</Button>
                        </Panel>
                    </Col>
                    <Col sm={8}>{alert}</Col>
                </Row>

                <UsersTable
                    users={this.state.usersList}
                    usersAPI={this.state.usersAPI}
                    onActionDone={this.userActionDone}
                    rowsPerPage={14}
                />

            </div>
        );
    }

}