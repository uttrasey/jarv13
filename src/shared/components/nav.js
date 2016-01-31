import React from 'react';

import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

/**
 * Navigation bar for the application
 */
export default class HarvesterNav extends React.Component {

  render () {
    return <Navbar inverse={true}>
        <Navbar.Header>
            <Navbar.Brand>
                <LinkContainer to={{ pathname: '/' }}>
                    <span>Home</span>
                </LinkContainer>
            </Navbar.Brand>
            <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
            <Nav>
                <LinkContainer to={{ pathname: '/about' }}>
                    <NavItem eventKey={1}>About</NavItem>
                </LinkContainer>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
  }

}
