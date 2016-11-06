import React from 'react';
import {ListGroup, ListGroupItem} from 'react-bootstrap';


// New components
import UsersTable from './components/UsersTable.jsx';

export default class Users extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
            usersResource : this.props.route.resource,
            usersList : []
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
    
        return (
            <div>
            <h2>USER LIST</h2>

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