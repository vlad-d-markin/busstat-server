import React from 'react';
import { Button, Modal, Glyphicon, ButtonToolbar, FormGroup, FormControl, ControlLabel} from 'react-bootstrap';

// Props: resource [ARC resource], station [Object], onDone [function(message, error)]
export default class UserActions extends React.Component {
    constructor(props) {
        super(props);

        // Init state
        this.state = {
            //users : this.props.resource,

            //login : this.props.users.login,
            //password : this.props.users.password,

            editorOpen : false,
            saveDisabled : false,
            removeDisabled : false
        }


        // Bind context
        /*this.openEditor = this.openEditor.bind(this);
        this.hideEditor = this.hideEditor.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.removeStation = this.removeStation.bind(this);*/
    }



    //
    openEditor() {
        ///this.setState({ editorOpen: true });
    }


    //
    hideEditor() {
        //this.setState({ editorOpen: false,  title : this.props.station.title});
    }


    //
    handleTitleChange(e) {
        //this.setState({ title : e.target.value });
    }


    // Save
    saveChanges() {
        /*console.log("Trying to save changes. Title " + this.state.title);

        this.setState({ saveDisabled: true });

        this.props.resource.put({ title : this.state.title }).then(function (resp) {
            this.setState({ saveDisabled: false });

            if(resp.success) {
                console.log("Successfully saved changes");
                this.props.onDone("Successfully saved changes", null);
            }
            else {
                console.error("Failed to save changes. Error: " + JSON.stringify(resp.error));
                this.props.onDone("Successfully saved changes", resp.error);
            }
        }.bind(this));*/
    }


    // Remove station
    removeStation() {
        /*console.log("Trying to remove station [" + this.props.station + "]");

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
        }.bind(this));*/
    }


    // Render component
    render() {
        return(
            <ButtonToolbar>
                <Button
                    onClick={this.openEditor}
                    bsStyle="primary"
                    bsSize="xsmall">
                    <Glyphicon glyph="pencil" />&nbsp;
                    Edit</Button>

                <Button
                    onClick={this.removeStation}
                    disabled={this.state.removeDisabled}
                    bsStyle="danger"
                    bsSize="xsmall">
                    <Glyphicon glyph="trash" />&nbsp;
                    Remove</Button>
            </ButtonToolbar>
        );
    }
}