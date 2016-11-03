import React from 'react';
import ReactDOM from 'react-dom';
import { Panel, Alert,Grid, Row, Col} from 'react-bootstrap';
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router'


import Menu from './menu.jsx';
import Users from './users.jsx';
import Stations from './stations.jsx';
import Routes from './routes.jsx';
import About from './about.jsx';


import RestClient from 'another-rest-client'

require('file?name=[name].[ext]!../public/index.html');


var server = new RestClient("https://busstat-server.herokuapp.com");
// var server = new RestClient("http://dev-tool-vladdmarkin900424.codeanyapp.com:8000");

server.res({
  token : 0,
  api : ['users', 'stations', 'test']
});

server.on('request', function(xhr) {
  var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU4MDdhYzNkZjVlNTdkMGQ3MDcwNTQ1OSIsImV4cCI6MTQ3ODUyODUxOTgwOX0.s2Vc0SvxzWHZ_6f4eL3FuqJyOO6NTLUPNhdjZ4phjT8';  
  xhr.setRequestHeader('Authorization', 'JWT ' + token);
});

class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.state= {
      messages : [ ]
    };
  }
  
  
  render() {   
    var messages = this.state.messages.map(function(msg, index){
      return (<Alert bsStyle={msg.style} key={index}>{msg.text}</Alert>);
    });
    
    return (
      <Grid>
        <Row>
          <Col md={12}><h1>Effective travel <small>developer tools</small></h1></Col>
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

ReactDOM.render(
  <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={About} />
        <Route path="users" resource={server.api.test} component={Users}/>
        <Route path="stations" resource={server.api.stations} component={Stations}/>
        <Route path="routes" component={Routes}/>
        <Route path="*" component={About}/>
      </Route>
  </Router>, 
  document.body);
