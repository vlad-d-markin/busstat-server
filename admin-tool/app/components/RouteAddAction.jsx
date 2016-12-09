import React from 'react';
import { Button, ButtonToolbar, Glyphicon } from 'react-bootstrap';


export default class RouteAddAction extends React.Component {
    constructor(props) {
        super(props);

        // Init state
        this.state = {
            route: this.props.route,
            onActionDone: this.props.onActionDone
        };

        this.action = this.action.bind(this);
    }

    action() {
        this.state.onActionDone(this.state.route.r_id);
    }


    // Render component
    render() {
        return(
            <div>
                <ButtonToolbar>
                    <Button
                        onClick={this.action}
                        bsStyle="success"
                        bsSize="xsmall">
                        <Glyphicon glyph="plus" />&nbsp;
                        Add route
                    </Button>
                </ButtonToolbar>
            </div>
        );
    }
}
