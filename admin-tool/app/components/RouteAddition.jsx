import React from 'react';
import RouteAddAction from './RouteAddAction.jsx';

import { Pagination, Table, Col, Row, Panel, InputGroup, Glyphicon, FormControl,
         DropdownButton, MenuItem, Button } from 'react-bootstrap';

// PROPS:
// routesAPI        [ARC resource]
// onActionDone     [function]

export default class RouteAddition extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            station: this.props.station,

            routesAPI: this.props.routesAPI,
            page: 1,
            rowsPerPage: this.props.rowsPerPage || 10,
            routes: [],

            searchRoute: '',
            searchType: 'all'
        };

        // Bind context
        this.handleSelect = this.handleSelect.bind(this);
        this.addRoute = this.addRoute.bind(this);
        this.update = this.update.bind(this);

        this.handleSearchLineChange = this.handleSearchLineChange.bind(this);
        this.handleSearchLineAll = this.handleSearchLineAll.bind(this);
        this.handleSearchLineBus = this.handleSearchLineBus.bind(this);
        this.handleSearchLineShuttleBus = this.handleSearchLineShuttleBus.bind(this);
        this.handleSearchLineTrolleyBus = this.handleSearchLineTrolleyBus.bind(this);
        this.handleSearchLineTramway = this.handleSearchLineTramway.bind(this);

        this.update();
    }

    componentWillReceiveProps(nextProps) {
        this.update();
    }


    // Handle page selection
    handleSelect(e) {
        this.setState({ page : e} );
    }


    addRoute(r_id) {
        this.props.onActionDone(this.state.station.s_id, r_id);
    }


    // search block
    handleSearchLineChange(e)       { this.setState({ searchRoute : e.target.value } ); }
    handleSearchLineBus(e)          { this.setState({ searchType : 'bus' }) }
    handleSearchLineShuttleBus(e)   { this.setState({ searchType : 'shuttlebus' }) }
    handleSearchLineTrolleyBus(e)   { this.setState({ searchType : 'trolleybus' }) }
    handleSearchLineTramway(e)      { this.setState({ searchType : 'tramway' }) }
    handleSearchLineAll(e)          { this.setState({ searchType : 'all' }) }


    update() {
        this.state.routesAPI.get().then(function (resp) {
            if(resp.success) {
                this.setState({routes: resp.routes});
                console.log('Successfully updated routes list');
            } else {
                this.setState({routes: [] });
                this.showAlert('Failed to update routes list', 'danger');
                console.error('Failed to update routes list');
            }
        }.bind(this));
    }

    render() {
        var searchRoute = this.state.searchRoute;
        var searchType = this.state.searchType;
        var displayedRoutes = this.state.routes.filter(function (el) {
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
                    <td><center><b>{route.title}</b></center></td>
                    <td>{route.r_id}</td>
                    <td>{route.transport_type}</td>
                    <td>{route.cost}</td>
                    <td>
                        <RouteAddAction
                            route={route}
                            onActionDone={this.addRoute}
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
                items={Math.ceil(this.state.routes.length / this.state.rowsPerPage)}
                maxButtons={5}
                activePage={this.state.page}
                onSelect={this.handleSelect} />;
        return(
            <div>
                <Panel>
                    <InputGroup>
                        <InputGroup.Addon>
                            <Glyphicon glyph="search" />
                        </InputGroup.Addon>
                        <FormControl type="text" placeholder="Search route" onChange={this.handleSearchLineChange} />
                        <DropdownButton
                            componentClass={InputGroup.Button}
                            id="input-dropdown-addon"
                            title={this.state.searchType}>
                            <MenuItem key="1" onClick={this.handleSearchLineAll}>all</MenuItem>
                            <MenuItem key="2" onClick={this.handleSearchLineBus}>bus</MenuItem>
                            <MenuItem key="3" onClick={this.handleSearchLineShuttleBus}>shuttlebus</MenuItem>
                            <MenuItem key="4" onClick={this.handleSearchLineTrolleyBus}>trolleybus</MenuItem>
                            <MenuItem key="5" onClick={this.handleSearchLineTramway}>tramway</MenuItem>
                        </DropdownButton>
                    </InputGroup>
                </Panel>
                <Table striped bordered condensed hover>
                    <thead>
                        <tr>
                            <th width="5%" className="text-center">#</th>
                            <th><center>Route</center></th>
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

