import React from 'react';
import {Row, Col, Panel, Button, Glyphicon, ButtonToolbar} from 'react-bootstrap';


// New components
import NewUserForm from './components/NewUserForm.jsx';
import UsersTable from './components/UsersTable.jsx';


export default class Users extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
            usersResource : this.props.route.userURL,
            registrationURL: this.props.route.registrationURL,
            usersList : [],

            showAlert: false,
            alertStyle : 'warning',
            alertText : '',
        };

        this.update();
    }


    update() {
        this.state.usersResource.get().then(function (resp) {
            if(resp.success) {
                this.setState({usersList: resp.users});
                console.log('Successfully updated users list'+resp.users);
            } else {
                this.setState({usersList: [] });
                //this.showAlert('Failed to update users list', 'danger');
                console.error('Failed to update users list');
            }
        }.bind(this));
    }


    render() {

        //var table = this.state.userList.map(function(message){ return(<strong> {message} </strong>) });

        var alert = this.state.showAlert ? <Alert bsStyle={this.state.alertStyle}>{this.state.alertText}</Alert> : '';

        return (
            <div>
                <NewUserForm usersResource={this.state.registrationURL} onDone={this.newUserFormDone} />
                <Row>
                    <Panel></Panel>
                </Row>
                <Row>
                    <Col sm={4}>
                        <Button onClick={this.update}><Glyphicon glyph="refresh" /> Refresh</Button>
                    </Col>
                    <Col sm={4}>
                            <h3 className="text-center">USERS LIST</h3>
                    </Col>
                    <Col sm={4}></Col>
                </Row>

                <UsersTable
                    users={this.state.usersList}
                    usersResource={this.state.users}
                    //onActionDone={this.stationActionDone}
                    rowsPerPage={14}
                />

            </div>
        );
    }

}