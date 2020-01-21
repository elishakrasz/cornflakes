import React, { Component } from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import { Auth, Logger, JS } from 'aws-amplify';

const logger = new Logger('JSignIn');
const DeloitteImg = '../../DeloitteIcon.png'

class JSignIn extends Component {
    constructor(props) {
        super(props);
        this.signIn = this.signIn.bind(this);
        this.checkContact = this.checkContact.bind(this);
        this.changeState = this.changeState.bind(this);
        this.inputs = {};
        this.state = { error: '' }
    }

    changeState (state, data) {
        const { onStateChange } = this.props;
        if (onStateChange) {
            onStateChange(state, data);
        }
    }

    signIn () {
        const { username, password } = this.inputs;
        logger.info('sign in with ' + username);
        Auth.signIn(username, password)
            .then(user => this.signInSuccess(user))
            .catch(err => this.signInError(err));
    }

    signInSuccess (user) {
        logger.info('sign in success', user);
        this.setState({ error: '' });

        // There are other sign in challenges we don't cover here.
        // SMS_MFA, SOFTWARE_TOKEN_MFA, NEW_PASSWORD_REQUIRED, MFA_SETUP ...
        if (user.challengeName === 'SMS_MFA' || user.challengeName === 'SOFTWARE_TOKEN_MFA') {
            this.changeState('confirmSignIn', user);
        } else {
            this.checkContact(user);
        }
    }

    signInError (err) {
        logger.info('sign in error', err);
        /*
          err can be in different structure:
            1) plain text message;
            2) object { code: ..., message: ..., name: ... }
        */
        this.setState({ error: err.message || err });
    }

    checkContact (user) {
        Auth.verifiedContact(user)
            .then(data => {
                if (!JS.isEmpty(data.verified)) {
                    this.changeState('signedIn', user);
                } else {
                    user = Object.assign(user, data);
                    this.changeState('verifyContact', user);
                }
            });
    }
    render() {

        const { authState, authData } = this.props;
        if (!['signIn', 'signedOut', 'signedUp'].includes(authState)) { return null; }

        const { error } = this.state;

        return (
            <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as='h2' color='green' textAlign='center'>
                        <Image src={DeloitteImg} size='big' /> Log in to your Account
                    </Header>
                    <Form size='large'>
                        <Segment stacked>
                            <Form.Input 
                                fluid icon='user' 
                                iconPosition='left' 
                                placeholder='E-mail address'
                                defaultValue={authData || '' } 
                                onChange={e => this.inputs.username = e.target.value}
                                />
                            <Form.Input
                                fluid
                                icon='lock'
                                iconPosition='left'
                                placeholder='Password'
                                type='password'
                                onChange={e => this.inputs.password = e.target.value}
                            />

                            <Button 
                                color='green' 
                                fluid size='large'
                                onClick={this.signIn}
                                >
                                Login
                    </Button>
                        </Segment>
                    </Form>
                    <Message>
                        New to us? <a 
                            href='/#/login'
                            // preventDefault
                            onClick={() => this.changeState('signUp')}
                            style={{
                                color: 'green',
                                // fontStyle: 'bold',
                                // fontSize: '16px'
                            }}
                        >Sign Up</a>{' '}
                        Forgot Password <a 
                            href='/#/login'
                            // preventDefault
                            onClick={() => this.changeState('forgotPassword')}
                            style={{
                                color: 'green'
                            }}
                        >Click Here</a> 
                    </Message>
                </Grid.Column>
            </Grid>
        )
    }
}

export default JSignIn;

// import React, { Component } from 'react';
// import { Auth, Logger, JS } from 'aws-amplify';

// export default class JSignIn extends Component {
//     constructor(props) {
//         super(props);
//         this.signIn = this.signIn.bind(this);
//         this.checkContact = this.checkContact.bind(this);
//         this.changeState = this.changeState.bind(this);
//         this.inputs = {};
//         this.state = { error: '' }
//     }

//     changeState(state, data) {
//         const { onStateChange } = this.props;
//         if (onStateChange) {
//             onStateChange(state, data);
//         }
//     }

//     signIn() {
//         const { username, password } = this.inputs;
//         logger.info('sign in with ' + username);
//         Auth.signIn(username, password)
//             .then(user => this.signInSuccess(user))
//             .catch(err => this.signInError(err));
//     }

//     signInSuccess(user) {
//         logger.info('sign in success', user);
//         this.setState({ error: '' });

//         // There are other sign in challenges we don't cover here.
//         // SMS_MFA, SOFTWARE_TOKEN_MFA, NEW_PASSWORD_REQUIRED, MFA_SETUP ...
//         if (user.challengeName === 'SMS_MFA' || user.challengeName === 'SOFTWARE_TOKEN_MFA') {
//             this.changeState('confirmSignIn', user);
//         } else {
//             this.checkContact(user);
//         }
//     }

//     signInError(err) {
//         logger.info('sign in error', err);
//         /*
//           err can be in different structure:
//             1) plain text message;
//             2) object { code: ..., message: ..., name: ... }
//         */
//         this.setState({ error: err.message || err });
//     }

//     checkContact(user) {
//         Auth.verifiedContact(user)
//             .then(data => {
//                 if (!JS.isEmpty(data.verified)) {
//                     this.changeState('signedIn', user);
//                 } else {
//                     user = Object.assign(user, data);
//                     this.changeState('verifyContact', user);
//                 }
//             });
//     }

//     render() {
//         const { authState, authData } = this.props;
//         if (!['signIn', 'signedOut', 'signedUp'].includes(authState)) { return null; }

//         const style = {
//             width: '20rem',
//             input: { borderRadius: '0' },
//             links: { fontSize: '0.9em' },
//             button: { width: '100%' },
//             alert: { fontSize: '0.8em' }
//         }

//         const { error } = this.state;

//         return (
//             <BDiv display="flex" flex="column" alignItems="center">
//                 <Form style={style} preventDefault>
//                     <Form.Input
//                         type="text"
//                         placeholder="Username"
//                         rounded="top"
//                         border="bottom-0"
//                         style={style.input}
//                         defaultValue={authData || ''}
//                         onChange={event => this.inputs.username = event.target.value}
//                         autoFocus
//                     />
//                     <Form.Input
//                         type="password"
//                         placeholder="Password"
//                         rounded="bottom"
//                         onChange={event => this.inputs.password = event.target.value}
//                         style={style.input}
//                     />
//                     <Row my="2" style={style.links}>
//                         <Col text="left">
//                             New to us?{' '}
//                             <BA href="#" preventDefault onClick={() => this.changeState('signUp')}>
//                                 Sign up
//               </BA>
//                         </Col>
//                         <Col text="right">
//                             <BA href="#" preventDefault onClick={() => this.changeState('forgotPassword')}>
//                                 Forgot password
//               </BA>
//                         </Col>
//                     </Row>
//                     <Button
//                         primary
//                         mt="3"
//                         style={style.button}
//                         onClick={this.signIn}
//                     >
//                         Sign In
//           </Button>
//                     <Federated federated={federated_data} onStateChange={this.changeState} />
//                     {error && <Alert warning mt="3" text="left" style={style.alert}>{error}</Alert>}
//                 </Form>
//             </BDiv>
//         )
//     }
// }
