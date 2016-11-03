import React from 'react';
import {
    Button, ControlLabel, FormGroup, FormControl, Pagination, Panel, Modal, Glyphicon,
    Table, ListGroup, ListGroupItem, Alert, ButtonToolbar } from 'react-bootstrap';



export default class StationActions extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            station : this.props.resource,

            title : this.props.station.title,

            editorOpen : false,
            saveDisabled : false,
            removeDisabled : false
        }

        this.openEditor = this.openEditor.bind(this);
        this.hideEditor = this.hideEditor.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.removeStation = this.removeStation.bind(this);
    }

    openEditor() {
        this.setState({ editorOpen: true });
    }

    hideEditor() {
        this.setState({ editorOpen: false,  title : this.props.station.title});
    }

    handleTitleChange(e) {
        this.setState({ title : e.target.value });
    }

    saveChanges() {
        console.log("Save changes. Title " + this.state.title);
        this.setState({ saveDisabled: true });
        this.state.station.put({ title : this.state.title }).then(function (resp) {
            this.setState({ saveDisabled: false });
            if(resp.success) {
                console.log("Successfully saved changes");
                this.props.onSuccess();
            }
            else {
                console.error("Failed to save changes. Error: " + JSON.stringify(resp.error));
            }
        }.bind(this));
    }

    removeStation() {
        console.log("Remove station " + this.state.title);
        this.setState({ removeDisabled: true });
        this.state.station.delete().then(function (resp) {
            this.setState({ removeDisabled: false });
            if(resp.success) {
                console.log("Successfully removed station " + this.state.title);
                this.props.onAlert("Successfully removed station " + this.state.title, 'success');
                this.props.onSuccess();
            }
            else {
                console.error("Failed to remove station. Error: " + JSON.stringify(resp.error));
                this.props.onAlert("Failed to remove station. Error: " + JSON.stringify(resp.error), 'danger');
            }
        }.bind(this));
    }

    render() {
        return(
            <ButtonToolbar>
                <Button
                    onClick={this.openEditor}
                    bsStyle="primary"
                    bsSize="xsmall">
                    <Glyphicon glyph="edit" />&nbsp;
                    Edit</Button>

                <Button
                    onClick={this.removeStation}
                    disabled={this.state.removeDisabled}
                    bsStyle="danger"
                    bsSize="xsmall">
                    <Glyphicon glyph="remove" />&nbsp;
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
                    <Modal.Footer>
                        <Button onClick={this.hideEditor}>Close</Button>
                        <Button bsStyle="primary" onClick={this.saveChanges} disabled={this.state.saveDisabled} >Save</Button>
                    </Modal.Footer>
                </Modal>
            </ButtonToolbar>
        );
    }
}
