import React from 'react';
import ReactDOM from 'react-dom';
import { Panel, Alert,Grid, Row, Col, Button, ButtonToolbar, Glyphicon} from 'react-bootstrap';
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router'
import commonStyles from '../styles/common.css';


import Login from './login.jsx'
import Menu from './menu.jsx';
import Users from './users.jsx';
import Stations from './stations.jsx';
import Routes from './routes.jsx';
import About from './about.jsx';
import AlertsBox from './components/AlertsBox.jsx';


import RestClient from 'another-rest-client'

require('file?name=[name].[ext]!../public/index.html');

var server = new RestClient("");

server.res({
  token : 0,
  registration: '',
  api : ['users', 'stations', 'test', 'admin', 'routes']
});


server.on('request', function(xhr) {
  //var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU4MDdhYzNkZjVlNTdkMGQ3MDcwNTQ1OSIsImV4cCI6MTQ3ODUyODUxOTgwOX0.s2Vc0SvxzWHZ_6f4eL3FuqJyOO6NTLUPNhdjZ4phjT8';
  xhr.setRequestHeader('Authorization', 'JWT ' + localStorage.getItem('et_admin.token'));
});


class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.state= {
      messages : [ ],
      alerts : [],
      nextMessageId : 1
    };

    this.handleLogout = this.handleLogout.bind(this);
    this.showAlert = this.showAlert.bind(this);
    this.getNextMessageId = this.getNextMessageId.bind(this);
  }
  
  getNextMessageId() {
    var ID = this.state.nextMessageId;
    this.setState({nextMessageId : ID + 1});
    return ID;
  }
  
  showAlert(message, style) {
    var alerts = this.state.alerts;
    var id = this.getNextMessageId();
    alerts.push({ message: message, style : style, id : id });
    window.setTimeout(function() {
      this.setState({ alerts : this.state.alerts.filter(function(el) { return el.id != id } ) } );
    }.bind(this), 4000);
    this.setState({ alerts : alerts });
  }

  handleLogout() {
    localStorage.removeItem('et_admin.token');
x
    const { location } = this.props
    if (location.state && location.state.nextPathname) {
      this.props.router.replace(location.state.nextPathname)
    } else {
      this.props.router.replace('/login');
    }
  }
  
  
  render() {   
    var messages = this.state.messages.map(function(msg, index){
      return (<Alert bsStyle={msg.style} key={index}>{msg.text}</Alert>);
    });
    
    return (
      <div>
        <AlertsBox alerts={this.state.alerts} />
        <Grid>
          <Row className={commonStyles.verticalAlign}>
            <Col md={10}>
              <h1>Effective travel <small>developer tools</small></h1>
            </Col>
            <Col md={2}>
                <Button bsStyle="primary" className="pull-right" onClick={this.handleLogout}>Sign out</Button>
            </Col>


          </Row>

          <Row>
            <Col md={2}>
              <Menu/>

            </Col>

            <Col md={10}>
              {messages}

              <Panel>
                {this.props.children &&  React.cloneElement(this.props.children, { showAlert : this.showAlert }) }
              </Panel>
            </Col>
          </Row>
        </Grid>
      </div>
      );
  }
}

function requireAuth(nextState, replace) {
  if (!localStorage.getItem('et_admin.token')) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    });
  }
}


ReactDOM.render(
  <Router history={browserHistory}>
      <Route path="/">
        <IndexRoute component={About} />
        <Route path="login" tokenAPI={server.token} component={Login} />
        <Route path="admin" component={App} onEnter={requireAuth}>
          <Route path="users"
                 usersAPI={server.api.users}
                 adminAPI={server.api.admin}
                 registrationAPI={server.registration}
                 component={Users} 
                 onEnter={requireAuth}
          />
          <Route path="stations"
                 resource={server.api.stations}
                 routesAPI={server.api.routes}
                 component={Stations}
                 onEnter={requireAuth}
          />
          <Route path="routes"
                 routesAPI={server.api.routes}
                 component={Routes}
                 onEnter={requireAuth}
          />
        </Route>
{/*        <Route path="*" component={About}/>*/}
      </Route>
  </Router>, 
  document.getElementById("app"));
