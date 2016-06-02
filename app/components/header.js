import React, { Component } from 'react';
import { connect } from 'react-redux';
import { IndexLink } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, Navbar, MenuItem, NavItem, NavDropdown } from 'react-bootstrap';

class Header extends Component {

  render() {
    const { authenticated, user } = this.props;
    const color = {
      color: '#8D5A97'
    };

    return (
      <Navbar className="navbar" fixedTop inverse>

        <Navbar.Header>
          <Navbar.Brand>
            <IndexLink to="/" activeStyle={{color: '#8D5A97'}}>
              <div className='brand'/>
              <span>Modulo</span>
            </IndexLink>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>

        <Navbar.Collapse>
          <Nav navbar>
            {authenticated && <LinkContainer to="/dashboard">
                <NavItem eventKey={1}>Dashboard</NavItem>
            </LinkContainer>}

          </Nav>
          {user &&
            <h4 style={color} className='navbar-text'>Hello <strong>{ user }</strong>.</h4>}
          <Nav pullRight>
            {!authenticated && <LinkContainer to="/signin">
              <NavItem eventKey={1}>SignIn</NavItem>
            </LinkContainer>}
            {!authenticated && <LinkContainer to="/signup">
              <NavItem eventKey={2}>SignUp</NavItem>
            </LinkContainer>}
            {authenticated && <LinkContainer to="/signout">
              <NavItem eventKey={3} className="logout-link">
                Logout
              </NavItem>
            </LinkContainer>}
          </Nav>

        </Navbar.Collapse>

      </Navbar>
    );
  }
}

function mapStateToProps (state) {
  return {
    authenticated : state.auth.authenticated,
    user: state.auth.user
  };
}

export default connect(mapStateToProps)(Header);
