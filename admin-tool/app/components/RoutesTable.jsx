import React from 'react';
import { Pagination, Table, Col, Row} from 'react-bootstrap';

/*routes={this.state.routesList}
routesAPI={this.state.routesAPI}
{/!*onActionDone={this.routeActionDone}*!/}
searchRoute={this.state.searchRoute}
rowsPerPage={14}*/

export default class RoutesTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 1,
            rowsPerPage: this.props.rowsPerPage || 15,
            routesAPI: this.props.routesAPI,
            routesList: this.props.routes
        };

        // Bind context
        this.handleSelect = this.handleSelect.bind(this);
        this.updateRoutesList = this.updateRoutesList.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.routes != this.props.routes) {
            this.updateRoutesList(nextProps);
        }
    }

    updateRoutesList(nextProps) {
        this.setState({ routesList: nextProps.routes});
    }

    // Handle page selection
    handleSelect(e) {
        this.setState({ page : e} );
    }

    render() {
        var searchRoute = this.props.searchRoute;
        var searchType = this.props.searchType;
        var displayedRoutes = this.props.routes.filter(function (el) {
            if(searchType === 'all') {
                return (el.title.toLowerCase().indexOf(searchRoute.toLowerCase()) !== -1);
            } else {
                return (el.title.toLowerCase().indexOf(searchRoute.toLowerCase()) !== -1) && (el.transport_type === searchType);
            }
        });

        var routesTableItems = displayedRoutes.map(function(route, idx){
            return(
                <tr key={idx}>
                    <td className="text-center">{idx + 1}</td>
                    <td>{route.title}</td>
                    <td>{route.r_id}</td>
                    <td>{route.transport_type}</td>
                    <td>{route.cost}</td>
                    <td>
                        {/*<RouteActions
                            route={route}
                            onDone={this.props.onActionDone}
                            routesAPI={this.props.routesAPI}
                        />*/}
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
                items={Math.ceil(this.props.routes.length / this.state.rowsPerPage)}
                maxButtons={5}
                activePage={this.state.page}
                onSelect={this.handleSelect} />;
        return(
            <div>
                <Table striped bordered condensed hover>
                    <thead>
                    <tr>
                        <th width="5%" className="text-center">#</th>
                        <th>Route</th>
                        <th>R_ID</th>
                        <th>Type</th>
                        <th>Cost</th>
                        <th width="30%">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {routesTableItems}
                    </tbody>
                </Table>
                <Row>
                    <Col md={12} className="text-center">{pagination}</Col>
                </Row>
            </div>
        );
    }
}

