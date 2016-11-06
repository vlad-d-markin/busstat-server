import React from 'react';
import { Pagination, Table, Col, Row} from 'react-bootstrap';

//import StationActions from './StationActions.jsx';


export default class UsersTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            page : 1,
            rowsPerPage : this.props.rowsPerPage || 15
        };

        // Bind context
        this.handleSelect = this.handleSelect.bind(this);
    }

    // Handle page selection
    handleSelect(e) {
        this.setState({ page : e} );
    }


    render() {

        var usersTableItems = this.props.users.map(function(user, idx){
            return(
                <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{user.login}</td>
                    <td>{user.role}</td>
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
                        <th>#</th>
                        <th>Login</th>
                        <th>Role</th>
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