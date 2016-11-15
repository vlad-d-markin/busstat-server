import React from 'react';
import ReactDOM from 'react-dom';
import { Panel, Alert,Grid, Row, Col, Button, Glyphicon} from 'react-bootstrap';
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router'


import Login from './login.jsx'
import Menu from './menu.jsx';
import Users from './users.jsx';
import Stations from './stations.jsx';
import Routes from './routes.jsx';
import About from './about.jsx';


import RestClient from 'another-rest-client'

require('file?name=[name].[ext]!../public/index.html');

var server = new RestClient("");
// var server = new RestClient("https://busstat-server.herokuapp.com");
// var server = new RestClient("http://dev-tool-vladdmarkin900424.codeanyapp.com:8000");

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
      messages : [ ]
    };

    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    localStorage.removeItem('et_admin.token');
    // TODO: redirect to /login
  }
  
  
  render() {   
    var messages = this.state.messages.map(function(msg, index){
      return (<Alert bsStyle={msg.style} key={index}>{msg.text}</Alert>);
    });
    
    return (
      <Grid>
        <Row>
          <Col md={10}>
            <h1>Effective travel <small>developer tools</small></h1>
          </Col>
          <Col>
            <Button className="text-left" bsStyle="primary" onClick={this.handleLogout}>BUSSTAT</Button>
          </Col>


        </Row>
        
        <Row>
          <Col md={2}>
            <Menu/>

          </Col>
          
          <Col md={10}>
            {messages}

            <Panel>
              {this.props.children}
            </Panel>
          </Col>
        </Row>
      </Grid>
      );
  }
}

function requireAuth(nextState, replace) {
  console.log("AUTH = "+ !localStorage.getItem('et_admin.token'));
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
        <Route path="about" component={About} />
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
                 component={Stations}
                 onEnter={requireAuth}
          />
          <Route path="routes"
                 routesAPI={server.api.routes}
                 component={Routes}
                 onEnter={requireAuth}
          />
        </Route>
        <Route path="about" component={About}/>
        <Route path="*" component={About}/>
      </Route>
  </Router>, 
  document.body);
