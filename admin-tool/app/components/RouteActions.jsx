import React from 'react';
import { Button, DropdownButton, InputGroup, MenuItem, Modal, Glyphicon, ButtonToolbar,
    FormGroup, FormControl, ControlLabel, Row, Col } from 'react-bootstrap';

/*props:
 route
    routesAPI
 */
export default class RouteActions extends React.Component {
    constructor(props) {
        super(props);

        // Init state
        this.state = {
            routesAPI: this.props.routesAPI,

            // login changing modal
            newTitle: this.props.route.title,
            newCost: this.props.route.cost,
            newType: this.props.route.transport_type,
            editorRouteOpen: false,
            saveRouteDisabled: false,
            removeRouteDisabled: false
        };

        // BIND CONTEXT
        this.updateRouteData = this.updateRouteData.bind(this);

        // route changing modal
        this.openRouteEditor = this.openRouteEditor.bind(this);
        this.hideRouteEditor = this.hideRouteEditor.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleCostChange = this.handleCostChange.bind(this);
        this.handleTypeBusChange = this.handleTypeBusChange.bind(this);
        this.handleTypeShuttleBusChange = this.handleTypeShuttleBusChange.bind(this);
        this.handleTypeTramwayChange = this.handleTypeTramwayChange.bind(this);
        this.handleTypeTrolleyBusChange = this.handleTypeTrolleyBusChange.bind(this);
        this.saveTitleAndCostAndType = this.saveTitleAndCostAndType.bind(this);

        // deleting route modal
        this.removeRoute = this.removeRoute.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.route != this.props.route) {
            this.updateRouteData(nextProps);
        }
    }

    updateRouteData(nextProps){
        this.setState({newTitle: nextProps.route.title, newCost: nextProps.route.cost, newType: nextProps.route.transport_type});
    }

    // Handle changing in Route editor
    openRouteEditor()       { this.setState({ editorRouteOpen: true }); }
    hideRouteEditor()       { this.setState({ editorRouteOpen: false,  newTitle : this.props.route.title, newCost: this.props.route.cost, newType : this.props.route.transport_type}); }
    handleTitleChange(e)    { this.setState({ newTitle: e.target.value }); }
    handleCostChange(e)    { this.setState({ newCost: e.target.value }); }
    handleTypeBusChange() { this.setState({ newType: "bus"}); }
    handleTypeShuttleBusChange()  { this.setState({ newType: "shuttle bus"}); }
    handleTypeTramwayChange()  { this.setState({ newType: "tramway"}); }
    handleTypeTrolleyBusChange()  { this.setState({ newType: "trolleybus"}); }

    saveTitleAndCostAndType() {
        this.setState({ saveRouteDisabled: true });
        var newRoute = {title:this.state.newTitle,
                        cost:this.state.newCost,
                        transport_type:this.state.newType};
        this.state.routesAPI(this.props.route.r_id).put(newRoute).then(function (resp) {
            this.setState({ saveRouteDisabled: false, editorRouteOpen : false });
            if(resp.success) {
                console.log("Successfully changed route");
                this.props.onDone("Successfully changed route", null);
            }
            else {
                console.error("Failed to changed route. Error: " + JSON.stringify(resp.error));
                this.props.onDone("Failed to changed route.", resp.error);
            }
        }.bind(this));
    }

    // Remove route
    removeRoute() {
        this.setState({removeRouteDisabled: true});
        this.props.routesAPI(this.props.route.r_id).delete().then(function (resp) {
            this.setState({removeRouteDisabled: false});

            if (resp.success) {
                console.log("Successfully removed route " + this.props.route.title);
                this.props.onDone("Successfully removed route " + this.props.route.title, null);
            }
            else {
                console.error("Failed to remove route " + this.props.route.title + ". Error: " + JSON.stringify(resp.error));
                this.props.onDone("Failed to remove route" + this.props.route.title + ". Error: " +
                    JSON.stringify(resp.error), resp.error);
            }
        }.bind(this));
    }

    // Render component
    render() {
        return(
            <ButtonToolbar>
                <Button
                    onClick={this.openRouteEditor}
                    bsStyle="primary"
                    bsSize="xsmall">
                    <Glyphicon glyph="pencil" />&nbsp;
                    Edit
                </Button>


                <Button
                    onClick={this.removeRoute}
                    disabled={this.state.removeRouteDisabled}
                    bsStyle="danger"
                    bsSize="xsmall">
                    <Glyphicon glyph="trash" />&nbsp;
                    Remove
                </Button>

                <Modal
                    {...this.props}
                    show={this.state.editorRouteOpen}
                    onHide={this.hideRouteEditor}
                    dialogClassName="custom-modal"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-route-rt">Edit route</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <form>
                            <FormGroup controlId="newRouteTitleCostType">
                                <Row>
                                    <div className="text-center">
                                    <Col sm={4} smOffset={1}>
                                        <ControlLabel>Title: </ControlLabel>
                                        <InputGroup>
                                            <FormControl
                                                type="text"
                                                value={this.state.newTitle}
                                                placeholder="Enter new route title"
                                                onChange={this.handleTitleChange}>
                                            </FormControl>
                                        </InputGroup>
                                    </Col>
                                    <Col sm={2} smOffset={1}>
                                        <ControlLabel>Cost: </ControlLabel>
                                        <InputGroup>
                                            <FormControl
                                                type="text"
                                                value={this.state.newCost}
                                                placeholder="Enter new route title"
                                                onChange={this.handleCostChange}>
                                            </FormControl>
                                        </InputGroup>
                                    </Col>
                                    <Col sm={4}>
                                        <ControlLabel>Type: </ControlLabel>
                                        <DropdownButton
                                            title={this.state.newType}
                                            componentClass={InputGroup.Button}
                                            id="input-dropdown-addon">
                                            <MenuItem key="1" onClick={this.handleTypeBusChange}>bus</MenuItem>
                                            <MenuItem key="2" onClick={this.handleTypeShuttleBusChange}>shuttlebus</MenuItem>
                                            <MenuItem key="3" onClick={this.handleTypeTrolleyBusChange}>trolleybus</MenuItem>
                                            <MenuItem key="4" onClick={this.handleTypeTramwayChange}>tramway</MenuItem>
                                        </DropdownButton>
                                    </Col>
                                        </div>
                            </Row>
                            </FormGroup>
                        </form>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={this.hideRouteEditor}>Close</Button>
                        <Button bsStyle="primary" onClick={this.saveTitleAndCostAndType} disabled={this.state.saveRouteDisabled} >Save</Button>
                    </Modal.Footer>
                </Modal>
            </ButtonToolbar>
        );
    }
}