import React from 'react';
import { Button, Modal, Glyphicon, ButtonToolbar, FormGroup, FormControl, ControlLabel} from 'react-bootstrap';

import RouteAddition from './RouteAddition.jsx';
import RouteDeletion from './RouteDeletion.jsx';

// Props: resource [ARC resource], station [Object], onDone [function(message, error)]
export default class StationActions extends React.Component {
    constructor(props) {
        super(props);

        // Init state
        this.state = {
            stationAPI : this.props.resource,

            station: this.props.station,
            title : this.props.station.title,


            editorOpen : false,
            saveEditDisabled : false,
            removeDisabled : false,

            additorOpen : false,
            addDisabled : false,

            removerOpen : false,
            deleteDisabled : false

        };


        // Bind context
        this.openEditor = this.openEditor.bind(this);
        this.hideEditor = this.hideEditor.bind(this);

        this.openAdditor = this.openAdditor.bind(this);
        this.hideAdditor = this.hideAdditor.bind(this);

        this.openRemover = this.openRemover.bind(this);
        this.hideRemover = this.hideRemover.bind(this);

        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.saveEdittedChanges = this.saveEdittedChanges.bind(this);
        this.removeStation = this.removeStation.bind(this);
        this.addRoute = this.addRoute.bind(this);
        this.deleteRoute = this.deleteRoute.bind(this);
    }


    //
    openEditor() {
        this.setState({ editorOpen: true });
    }
    //
    hideEditor() {
        this.setState({ editorOpen: false,  title : this.props.station.title});
    }


    //
    openAdditor() {
        this.setState({ additorOpen: true });
    }
    //
    hideAdditor() {
        this.setState({ additorOpen: false });
    }


    //
    openRemover() {
        this.setState({ removerOpen: true });
    }
    //
    hideRemover() {
        this.setState({ removerOpen: false });
    }


    //
    handleTitleChange(e) {
        this.setState({ title : e.target.value });
    }


    // Save
    saveEdittedChanges() {
        console.log("Trying to save changes. Title " + this.state.title);

        this.setState({ saveEditDisabled: true });

        this.props.resource.put({ title : this.state.title }).then(function (resp) {
            this.setState({ saveEditDisabled: false });

            if(resp.success) {
                console.log("Successfully saved changes");
                this.props.onDone("Successfully saved changes", null);
            }
            else {
                console.error("Failed to save changes. Error: " + JSON.stringify(resp.error));
                this.props.onDone("Failed to save changess", resp.error);
            }
        }.bind(this));
    }

    //
    addRoute(s_id, r_id) {
        console.log("Trying to add route for station. S_ID="+s_id+"  R_ID="+r_id);

        this.setState({ addDisabled: true });

        var api = this.props.stationsAPI(s_id+'/'+r_id);
        api.put({}).then(function (resp) {
            this.setState({ addDisabled: false });

            if(resp.success) {
                console.log("Successfully added route for station");
                this.props.onDone("Successfully added route for station", null);
                this.update()
            }
            else {
                console.error("Failed to add route for station. Error: " + JSON.stringify(resp.error));
                this.props.onDone("Failed to add route for station", resp.error);
            }
        }.bind(this));
    }

    //
    deleteRoute(s_id, r_id) {
        console.log("Trying to delete route from station. S_ID="+s_id+"  R_ID="+r_id);

        this.setState({ addDisabled: true });

        var api = this.props.stationsAPI(s_id+'/'+r_id);
        api.delete({}).then(function (resp) {
            this.setState({ addDisabled: false });

            if(resp.success) {
                console.log("Successfully deleted route from station");
                this.props.onDone("Successfully deleted route from station", null);
            }
            else {
                console.error("Failed to delete route from station. Error: " + JSON.stringify(resp.error));
                this.props.onDone("Failed to delete route from station", resp.error);
            }
        }.bind(this));
    }

    // Remove station
    removeStation() {
        console.log("Trying to remove station [" + this.props.stationAPI + "]");

        this.setState({ removeDisabled: true });

        this.props.resource.delete().then(function (resp) {
            this.setState({ removeDisabled: false });

            if(resp.success) {
                console.log("Successfully removed station " + this.state.title);
                this.props.onDone("Successfully removed station " + this.state.title, null);
            }
            else {
                console.error("Failed to remove station " + this.state.title + ". Error: " + JSON.stringify(resp.error));
                this.props.onDone("Failed to remove station" + this.state.title + ". Error: " +
                    JSON.stringify(resp.error), resp.error);
            }
        }.bind(this));
    }

    update() {

    }

    // Render component
    render() {
        return(
            <ButtonToolbar>
                <Button
                    onClick={this.openAdditor}
                    bsStyle="success"
                    bsSize="xsmall">
                    <Glyphicon glyph="plus" />&nbsp;
                    Add route</Button>

                <Button
                    onClick={this.openRemover}
                    bsStyle="warning"
                    bsSize="xsmall">
                    <Glyphicon glyph="remove" />&nbsp;
                    Delete route</Button>

                <Button
                    onClick={this.openEditor}
                    bsStyle="primary"
                    bsSize="xsmall">
                    <Glyphicon glyph="pencil" />&nbsp;
                    Edit</Button>

                <Button
                    onClick={this.removeStation}
                    disabled={this.state.removeLoginDisabled}
                    bsStyle="danger"
                    bsSize="xsmall">
                    <Glyphicon glyph="trash" />&nbsp;
                    Remove</Button>

                <Modal
                    {...this.props}
                    show={this.state.editorOpen}
                    onHide={this.hideEditor}
                    dialogClassName="custom-modal"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-lg">Edit station</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <FormGroup controlId="newStationTitle">
                                <ControlLabel>Title: </ControlLabel>
                                <FormControl
                                    type="text"
                                    value={this.state.title}
                                    placeholder="Enter new station title"
                                    onChange={this.handleTitleChange}></FormControl>
                            </FormGroup>
                        </form>
                    </Modal.Body>
                </Modal>

                <Modal
                    {...this.props}
                    show={this.state.additorOpen}
                    onHide={this.hideAdditor}
                    dialogClassName="custom-modal"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-lg">Add route</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <RouteAddition
                            routesAPI={this.props.routesAPI}
                            onActionDone={this.addRoute}
                            station={this.state.station}
                        />
                    </Modal.Body>
                </Modal>

                <Modal
                    {...this.props}
                    show={this.state.removerOpen}
                    onHide={this.hideRemover}
                    dialogClassName="custom-modal"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-lg">Delete route</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <RouteDeletion
                            routesAPI={this.props.routesAPI}
                            onActionDone={this.deleteRoute}
                            station={this.state.station}
                        />
                    </Modal.Body>
                </Modal>

            </ButtonToolbar>
        );
    }
}
