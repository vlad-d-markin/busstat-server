import React from 'react';
import { Pagination, Table, Col, Row} from 'react-bootstrap';


import StationActions from './StationActions.jsx';


// Props:
// stations [Array],
// stationsResource [RestClient resource],
// routesRecource [RestClient resource],
// search station [String]
// onActionDone [function(message, error)]
export default class StationsTable extends React.Component {
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

        var searchWord = this.props.searchStation;

        var sortStations = this.props.stations.sort(function(a, b) {
            return a.s_id - b.s_id;
        });

        var displayedStations = this.props.stations.filter( function(el) {
            return (el.title.toLowerCase().indexOf(searchWord.toLowerCase()) !== -1);
        });


        var stationTableItems = displayedStations.map(function(station, idx){
            return(
                <tr key={idx}>
                    <td><center>{idx + 1}</center></td>
                    <td>{station.title}</td>
                    <td>{station.s_id}</td>
                    <td>not yet</td>
                    <td>
                        <StationActions
                            station={station}
                            onDone={this.props.onActionDone}
                            resource={this.props.stationsResource(station.s_id)}
                            stationsAPI={this.props.stationsResource}
                            routesAPI={this.props.routesAPI}
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
                items={Math.ceil(this.props.stations.length / this.state.rowsPerPage)}
                maxButtons={5}
                activePage={this.state.page}
                onSelect={this.handleSelect} />;

        return(
            <div>
                <Table striped bordered condensed hover>
                    <thead>
                    <tr>
                        <th><center>#</center></th>
                        <th>Title</th>
                        <th>S_ID</th>
                        <th>Coordinates</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                        {stationTableItems}
                    </tbody>
                </Table>
                <Row>
                    <Col md={12} className="text-center">{pagination}</Col>
                </Row>
            </div>
        );
    }
}