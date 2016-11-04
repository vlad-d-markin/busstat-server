import React from 'react';
import { Pagination, Table, Col, Row} from 'react-bootstrap';


import StationActions from './StationActions.jsx';


// Props: stations [Array], stationsResource [RestClient resource], onActionDone [function(message, error)]
export default class StationsTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            page : 1,
            rowsPerPage : this.props.rowsPerPage || 15
        }

        // Bind context
        this.handleSelect = this.handleSelect.bind(this);
    }

    // Handle page selection
    handleSelect(e) {
        this.setState({ page : e} );
    }


    render() {

        var stationTableItems = this.props.stations.map(function(station, idx){
            return(
                <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{station.title}</td>
                    <td>{station.s_id}</td>
                    <td>not yet</td>
                    <td>
                        <StationActions
                            station={station}
                            onDone={this.props.onActionDone}
                            resource={this.props.stationsResource(station.s_id)}/>
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
                        <th>#</th>
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