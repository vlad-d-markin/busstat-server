import React from 'react';
import { Alert } from 'react-bootstrap';
import commonStyles from '../../styles/common.css';


// Props: alerts [Array]:[{message, style}, ...]
export default class AlertsBox extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
        var alerts = this.props.alerts.map(function(alert) {
          return (<Alert bsStyle={alert.style}>{alert.message}</Alert>);
        });
      
        return(
          <div className={commonStyles.alertOverlayBox} >
            {alerts}
          </div>
        );
    }
}