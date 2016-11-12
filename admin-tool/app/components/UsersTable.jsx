import React from 'react';
import { Pagination, Table, Col, Row} from 'react-bootstrap';

import UserActions from './UserActions.jsx';


// PROPS:
// users        [users list]
// usersAPI     [ARC resource]
// searchLogin  [string]
// searchRole   [string] // admin, user, all
// onActionDone [function(message, error)]
// rowsPerPage  [Number of users per page]
export default class UsersTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            page : 1,
            rowsPerPage : this.props.rowsPerPage || 15,
            usersAPI : this.props.usersAPI,
            usersList : this.props.users
        };

        // Bind context
        this.handleSelect = this.handleSelect.bind(this);
        this.updateUsersList = this.updateUsersList.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.users != this.props.users) {
            this.updateUsersList(nextProps);
        }
    }

    updateUsersList(nextProps) {
        this.setState({ usersList: nextProps.users});
    }


    // Handle page selection
    handleSelect(e) {
        this.setState({ page : e} );
    }

    render() {
        var searchLogin = this.props.searchLogin;
        var searchRole = this.props.searchRole;
        var displayedUsers = this.props.users.filter( function(el) {
            if(searchRole === 'all') {
                return (el.login.toLowerCase().indexOf(searchLogin.toLowerCase()) !== -1);
            } else {
                return (el.login.toLowerCase().indexOf(searchLogin.toLowerCase()) !== -1) && (el.role === searchRole);
            }
        });

        var usersTableItems = displayedUsers.map(function(user, idx){
            return(
                <tr key={idx}>
                    <td className="text-center">{idx + 1}</td>
                    <td>{user.login}</td>
                    <td >{user.role}</td>
                    <td>
                        <UserActions
                            user={user}
                            onDone={this.props.onActionDone}
                            usersAPI={this.props.usersAPI}
                        />
                    </td>
                </tr>
            );
        }.bind(this)).slice((this.state.page-1) * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage);


        var pagination =
            <Pagination
                prev
                next
                first
                last
                ellipsis
                boundaryLinks
                items={Math.ceil(this.props.users.length / this.state.rowsPerPage)}
                maxButtons={5}
                activePage={this.state.page}
                onSelect={this.handleSelect} />;

        return(
            <div>
                <Table striped bordered condensed hover>
                    <thead>
                    <tr>
                        <th width="5%" className="text-center">#</th>
                        <th>Login</th>
                        <th>Role</th>
                        <th width="30%">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {usersTableItems}
                    </tbody>
                </Table>
                <Row>
                    <Col md={12} className="text-center">{pagination}</Col>
                </Row>
            </div>
        );
    }
}