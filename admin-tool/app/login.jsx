import React from 'react';
import { Row, Button, MenuItem, InputGroup, Col, ControlLabel, Form, FormGroup,
    FormControl, Glyphicon, ButtonToolbar, Panel, Alert } from 'react-bootstrap';


export default class Login extends React.Component {
    constructor(props) {
        super(props);

        // Init component state
        this.state = {
            login : '',
            password: '',

            controlsDisabled : false
        };

        console.log(this.props);

        // Bind context
        this.submitLogin   = this.submitLogin.bind(this);
        this.setInProgressState = this.setInProgressState.bind(this);
        this.handleLoginChange  = this.handleLoginChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.cleanLogin = this.cleanLogin.bind(this);
        this.cleanPassword = this.cleanPassword.bind(this);
        this.showAlert = this.showAlert.bind(this);
    }


    submitLogin() {
        this.setInProgressState(true);
        this.props.route.tokenAPI.post({'login': this.state.login, 'password': this.state.password}).then(function (resp) {
            this.setInProgressState(false);
            if(resp.success && (resp.role == 'admin')) {
                this.cleanLogin();
                this.cleanPassword();

                localStorage.setItem('et_admin.token', resp.token);
                console.log("Successfully log in");

                const { location } = this.props
                if (location.state && location.state.nextPathname) {
                    this.props.router.replace(location.state.nextPathname)
                } else {
                    this.props.router.replace('/admin');
                }
            } else {
                this.cleanPassword();
                localStorage.removeItem('et_admin.token');
                console.error("Failed to log in");
                this.showAlert('Incorrect password','danger')
                // TODO: LOH - try again
            }
        }.bind(this)).catch(function(e) { console.log(e); });
    }

    cleanLogin() {
        this.setState( { login: '' });
    }

    cleanPassword() {
        this.setState( { password: '' });
    }

    // Handle changing input
    handleLoginChange(e) {
        this.setState({ login : e.target.value } );
    }

    handlePasswordChange(e) {
        this.setState({ password : e.target.value } );
    }

    // Disable controls
    setInProgressState(yes) {
        this.setState({ controlsDisabled : yes });
    }

    // Show error
    showAlert(text, style) {
        this.setState({ showAlert: true, alertStyle : style, alertText : text });
        window.setTimeout(function () {
            this.setState({ showAlert: false, alertStyle : 'info', alertText : 'Nothing happened' });
        }.bind(this), 5000);
    }


    render() {
        var alert = this.state.showAlert ? <Alert bsStyle={this.state.alertStyle}>{this.state.alertText}</Alert> : '';

        return (
            <div>
                <Row>
                    <Col sm={6} smOffset={3}> <h1 className="text-center">Effective Travel Admin tool</h1> </Col>
                </Row>
                <Row>
                    <Col sm={6} smOffset={3}>
                        <Panel header="Sign in" bsStyle="primary">
                            <Form horizontal>
                                <FormGroup controlId="login">

                                    <Col componentClass={ControlLabel} sm={2}>
                                        Login
                                    </Col>
                                    <Col sm={9}>
                                        <FormControl
                                            type="login"
                                            value={this.state.login}
                                            placeholder="Login"
                                            onChange={this.handleLoginChange}>
                                        </FormControl>
                                    </Col>
                                </FormGroup>

                                <FormGroup controlId="password">
                                    <Col componentClass={ControlLabel} sm={2}>
                                        Password
                                    </Col>
                                    <Col sm={9}>
                                        <FormControl
                                            type="password"
                                            value={this.state.password}
                                            placeholder="Password"
                                            onChange={this.handlePasswordChange}>
                                        </FormControl>
                                    </Col>
                                </FormGroup>

                                <FormGroup>
                                    <Col sm={9} smOffset={2}>
                                        <ButtonToolbar className="pull-right">
                                            <Button bsStyle="default" onClick={this.cleanInputs} disabled={this.state.controlsDisabled} >
                                                <Glyphicon glyph="remove" /> Clear
                                            </Button>
                                            <Button bsStyle="primary" onClick={this.submitLogin} disabled={this.state.controlsDisabled} >
                                                <Glyphicon glyph="ok" /> Submit
                                            </Button>
                                        </ButtonToolbar>
                                    </Col>
                                </FormGroup>
                            </Form>
                        </Panel>
                    </Col>
                </Row>
                <Row>
                    <Col sm={6} smOffset={3}> {alert} </Col>
                </Row>
            </div>
        )
    }
}