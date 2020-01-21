import React, { Component } from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import { Auth, Logger } from 'aws-amplify';

const logger = new Logger('JSignUp');
const DeloitteImg = '../../DeloitteIcon.png'

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.signUp = this.signUp.bind(this);
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
    
      signUp () {
        const { username, password, email, phone_number } = this.inputs;
        logger.info('sign up with ' + username);
        Auth.signUp(username, password, email, phone_number)
          .then(() => this.signUpSuccess(username))
          .catch(err => this.signUpError(err));
      }
    
      signUpSuccess (username) {
        logger.info('sign up success with ' + username);
        this.setState({ error: '' });
    
        this.changeState('confirmSignUp', username);
      }
    
      signUpError (err) {
        logger.info('sign up error', err);
        let message = err.message || err;
        if (message.startsWith('Invalid phone number')) {
          // reference: https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-attributes.html
          message = 'Phone numbers must follow these formatting rules: A phone number must start with a plus (+) sign, followed immediately by the country code. A phone number can only contain the + sign and digits. You must remove any other characters from a phone number, such as parentheses, spaces, or dashes (-) before submitting the value to the service. For example, a United States-based phone number must follow this format: +14325551212.'
        }
        this.setState({ error: message });
      }

    render() {

        const { authState } = this.props;
            if (authState !== 'signUp') { return null; }

        return (
            <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
              <Grid.Column style={{ maxWidth: 450 }}>
                <Header as='h2' color='teal' textAlign='center'>
                  <Image src={DeloitteImg} size='large' /> Sign Up
                </Header>
                <Form size='large'>
                  <Segment stacked>
                    <Form.Input 
                        fluid icon='user' 
                        type='text'
                        iconPosition='left' 
                        placeholder='Username/E-mail address'
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
                    <Form.Input 
                        fluid icon='user' 
                        iconPosition='left' 
                        placeholder='E-mail address' 
                        onChange={e => this.inputs.email = e.target.value}
                    />
                    <Form.Input
                      fluid
                      icon='lock'
                      iconPosition='left'
                      placeholder='Phone Number'
                      onChange={e => this.inputs.phone_number = e.target.value}
                    />
          
                    <Button 
                        color='teal' 
                        fluid size='large'
                        onClick={this.signUp}
                        >
                      Sign Up
                    </Button>
                  </Segment>
                </Form>
                <Message>
                 Already have an account? <a href='/#/login' preventdefault='true' onClick={() => this.changeState('signIn')}>Sign In</a>
                </Message>
              </Grid.Column>
            </Grid>
          )
    }
} 

export default SignUp;






