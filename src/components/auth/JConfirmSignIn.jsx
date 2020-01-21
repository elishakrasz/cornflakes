import React, { Component } from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import { Auth, Logger, JS } from 'aws-amplify';

const logger = new Logger('JConfirmSignIn');

class JConfirmSignIn extends Component {
  constructor(props) {
    super(props);
    this.confirmSignIn = this.confirmSignIn.bind(this);
    this.checkContact = this.checkContact.bind(this);
    this.changeState = this.changeState.bind(this);
    this.inputs = {};
    this.state = { error: '' }
  }
  changeState(state, data) {
    const { onStateChange } = this.props;
    if (onStateChange) {
      onStateChange(state, data);
    }
  }

  confirmSignIn() {
    const user = this.props.authData;
    const { code } = this.inputs;
    logger.info('confirm sign in with ' + code);
    const mfaType = user.challengeName === 'SOFTWARE_TOKEN_MFA'
      ? 'SOFTWARE_TOKEN_MFA'
      : null;
    Auth.confirmSignIn(user, code, mfaType)
      .then(() => this.confirmSuccess(user))
      .catch(err => this.confirmError(err));
  }

  confirmSuccess(user) {
    logger.info('confirm sign in success', user);
    this.setState({ error: '' });

    this.checkContact(user);
  }

  confirmError(err) {
    logger.info('confirm sign in error', err);
    this.setState({ error: err.message || err });
  }

  checkContact(user) {
    Auth.verifiedContact(user)
      .then(data => {
        logger.info('verified contacts', data);
        if (!JS.isEmpty(data.verified)) {
          this.changeState('signedIn', user);
        } else {
          user = Object.assign(user, data);
          this.changeState('verifyContact', user);
        }
      })
      .catch(err => {
        logger.info('check verified contact error', err);
      });
  }
  render() {
    const { authState } = this.props;
    if (authState !== 'confirmSignIn') { return null; }

    const { error } = this.state;

    return (
      <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h2' color='teal' textAlign='center'>
            <Image src='/logo.png' /> Confirm Sign In
          </Header>
          <Form size='large'>
            <Segment stacked>
              <Form.Input 
                fluid icon='user' 
                iconPosition='left' 
                placeholder="Code"
                onChange={e => this.inputs.code = e.target.value} 
                />
    
              <Button
                href='/#/login' 
                color='teal' 
                fluid size='large'
                preventDefault 
                onClick={() => this.changeState('signIn')}
                >
                Return to Login
              </Button>
            </Segment>
          </Form>
          {/* <Message>
            Return to Log In<a href='/#/login'
              preventDefault onClick={() => this.changeState('signIn')}
            >Log In</a>
          </Message> */}
        </Grid.Column>
      </Grid>
    )
  }
}

export default JConfirmSignIn


// import React, { Component } from 'react';
// import { BDiv, Form, Button, Alert, Row, Col, BA } from 'bootstrap-4-react';
// import { Auth, Logger, JS } from 'aws-amplify';

// const logger = new Logger('JConfirmSignIn');

// export default class JConfirmSignIn extends Component {
//   constructor(props) {
//     super(props);
//     this.confirmSignIn = this.confirmSignIn.bind(this);
//     this.checkContact = this.checkContact.bind(this);
//     this.changeState = this.changeState.bind(this);
//     this.inputs = {};
//     this.state = { error: '' }
//   }

//   changeState(state, data) {
//     const { onStateChange } = this.props;
//     if (onStateChange) {
//       onStateChange(state, data);
//     }
//   }

//   confirmSignIn() {
//     const user = this.props.authData;
//     const { code } = this.inputs;
//     logger.info('confirm sign in with ' + code);
//     const mfaType = user.challengeName === 'SOFTWARE_TOKEN_MFA'
//       ? 'SOFTWARE_TOKEN_MFA'
//       : null;
//     Auth.confirmSignIn(user, code, mfaType)
//       .then(() => this.confirmSuccess(user))
//       .catch(err => this.confirmError(err));
//   }

//   confirmSuccess(user) {
//     logger.info('confirm sign in success', user);
//     this.setState({ error: '' });

//     this.checkContact(user);
//   }

//   confirmError(err) {
//     logger.info('confirm sign in error', err);
//     this.setState({ error: err.message || err });
//   }

//   checkContact(user) {
//     Auth.verifiedContact(user)
//       .then(data => {
//         logger.info('verified contacts', data);
//         if (!JS.isEmpty(data.verified)) {
//           this.changeState('signedIn', user);
//         } else {
//           user = Object.assign(user, data);
//           this.changeState('verifyContact', user);
//         }
//       })
//       .catch(err => {
//         logger.info('check verified contact error', err);
//       });
//   }

//   render() {
//     const { authState } = this.props;
//     if (authState !== 'confirmSignIn') { return null; }

//     const style = {
//       width: '20rem',
//       links: { fontSize: '0.9em' },
//       button: { width: '100%' },
//       alert: { fontSize: '0.8em' }
//     }

//     const { error } = this.state;

//     return (
//       <BDiv display="flex" flex="column" alignItems="center">
//         <Form style={style} preventDefault>
//           <Form.Input
//             type="text"
//             placeholder="Code"
//             onChange={event => this.inputs.code = event.target.value}
//             autoFocus
//           />
//           <Row my="2" style={style.links}>
//             <Col text="left">
//               <BA href="#" preventDefault onClick={() => this.changeState('signIn')}>
//                 Back to sign in
//               </BA>
//             </Col>
//             <Col text="right">
//             </Col>
//           </Row>
//           <Button
//             primary
//             mt="3"
//             style={style.button}
//             onClick={this.confirmSignIn}
//           >
//             Confirm
//           </Button>
//           { error && <Alert warning mt="3" text="left" style={style.alert}>{error}</Alert> }
//         </Form>
//       </BDiv>
//     )
//   }
// }
