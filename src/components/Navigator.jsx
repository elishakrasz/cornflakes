import React, { Component } from 'react';
import { Menu, Image } from 'semantic-ui-react'
// import { Navbar, Nav, BSpan } from 'bootstrap-4-react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { Logger } from 'aws-amplify';

import store from '../store';
import { JSignOut } from './auth';

const TopDeloitteImg = '../TopImage.png'

const HomeItems = props => (
  <React.Fragment>
  <Menu
    inverted
    style={{
      height: '50px',
    }}
  >
    <Menu.Item href="#/">
        <Image src={TopDeloitteImg} size='tiny' />
    </Menu.Item>
    <Menu.Item href="#/profile">
        Profile
    </Menu.Item>
    <Menu.Item href="#/login">
      Login
    </Menu.Item>
  </Menu>
  </React.Fragment>
)
const LoginItems = props => (
  <React.Fragment>
  <Menu
    inverted 
    style={{
      height: '50px',

    }}
  >
    <Menu.Item href="#/">
      <Image src={TopDeloitteImg} size='tiny' />
    </Menu.Item>
    <Menu.Item href="#/profile">
        Profile
    </Menu.Item>
    <Menu.Item href="#/login">
      Login
    </Menu.Item>
  </Menu>
  </React.Fragment>
)
const ProfileItems = props => (
  <React.Fragment>
  <Menu
    inverted
    style={{
      height: '50px',
    }}
  >
    <Menu.Item href="#/">
      <Image src={TopDeloitteImg} size='tiny' />
    </Menu.Item>
    <Menu.Item href="#/profile">
        Profile
    </Menu.Item>
    <Menu.Item href="#/login">
      Login
    </Menu.Item>
  </Menu>
  </React.Fragment>
)

// const HomeItems = props => (
//   <React.Fragment>
//     <Nav.ItemLink href="#/" active>
//       Home
//       <BSpan srOnly>(current)</BSpan>
//     </Nav.ItemLink>
//     <Nav.ItemLink href="#/profile">
//       Profile
//     </Nav.ItemLink>
//     <Nav.ItemLink href="#/login">
//       Login
//     </Nav.ItemLink>
//   </React.Fragment>
// )

// const LoginItems = props => (
//   <React.Fragment>
//     <Nav.ItemLink href="#/">
//       Home
//     </Nav.ItemLink>
//     <Nav.ItemLink href="#/profile">
//       Profile
//     </Nav.ItemLink>
//     <Nav.ItemLink href="#/login" active>
//       Login
//       <BSpan srOnly>(current)</BSpan>
//     </Nav.ItemLink>
//   </React.Fragment>
// )

// const ProfileItems = props => (
//   <React.Fragment>
//     <Nav.ItemLink href="#/">
//       Home
//     </Nav.ItemLink>
//     <Nav.ItemLink href="#/profile" active>
//       Profile
//       <BSpan srOnly>(current)</BSpan>
//     </Nav.ItemLink>
//     <Nav.ItemLink href="#/login">
//       Login
//     </Nav.ItemLink>
//   </React.Fragment>
// )

const logger = new Logger('Navigator');

export default class Navigator extends Component {
  constructor(props) {
    super(props);

    this.storeListener = this.storeListener.bind(this);

    this.state = { user: null, profile: null }
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  componentDidMount() {
    this.unsubscribeStore = store.subscribe(this.storeListener);
  }

  componentWillUnmount() {
    this.unsubscribeStore();
  }

  storeListener() {
    logger.info('redux notification');
    const state = store.getState();
    this.setState({ user: state.user, profile: state.profile });
  }

  render() {
    const { user } = this.state;
    const profile = this.state.profile || {};
    const { activeItem } = this.state;

    return (
      <Menu 
        inverted
      style={{
        height: '50px',
      }}>
        <Menu.Item
          color='green'
          href="#"
        >
          Deloitte
        </Menu.Item>
        <Menu.Item>
        <HashRouter>
              <Switch>
                <Route exact path="/" component={HomeItems} />
                <Route exact path="/profile" component={ProfileItems} />
                <Route exact path="/login" component={LoginItems} />
              </Switch>
            </HashRouter>
        </Menu.Item>
        <Menu.Menu position='right'>
          <Menu.Item>
            { user? 'Hi ' + (profile.given_name || user.username) : <h4>Please sign in</h4> }
          </Menu.Item>
            { user && <JSignOut /> }
        </Menu.Menu>
        
        {/* <Menu.Item
          name='reviews'
          active={activeItem === 'reviews'}
          onClick={this.handleItemClick}
        >
          Reviews
        </Menu.Item>

        <Menu.Item
          name='upcomingEvents'
          active={activeItem === 'upcomingEvents'}
          onClick={this.handleItemClick}
        >
          Upcoming Events
        </Menu.Item> */}
      </Menu>
    )

    // return (
    //   <Navbar expand="md" dark bg="dark" fixed="top">
    //     <Navbar.Brand href="#">Journal</Navbar.Brand>
    //     <Navbar.Toggler target="#navbarsExampleDefault" />

    //     <Navbar.Collapse id="navbarsExampleDefault">
    //       <Navbar.Nav mr="auto">
    //         <HashRouter>
    //           <Switch>
    //             <Route exact path="/" component={HomeItems} />
    //             <Route exact path="/profile" component={ProfileItems} />
    //             <Route exact path="/login" component={LoginItems} />
    //           </Switch>
    //         </HashRouter>
    //       </Navbar.Nav>
    //       <Navbar.Text mr="2">
    //         { user? 'Hi ' + (profile.given_name || user.username) : 'Please sign in' }
    //       </Navbar.Text>
    //       { user && <JSignOut /> }
    //     </Navbar.Collapse>
    //   </Navbar>
    // )
  }
}
