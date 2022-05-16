import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';

const logo = require('../../Media/RWH-LOGO-FINVWEB3.png');

interface myProps {
  isSignedIn: boolean;
  onRouteChange(route: string): void;
  user: {
    name: string;
  }
}

const NavBar: React.FC<myProps> = ({ onRouteChange, isSignedIn, user}) => {
	return(
		<Navbar style={{backgroundColor: '#1890ff'}} variant="dark">
			<Navbar.Brand>
				<img
					alt=""
					src={logo}
					onClick={() => {
						if (isSignedIn) {
							onRouteChange('home');
						}
					}}
					height="23"
					className="d-inline-block align-top"
					style={{marginLeft: '20px', marginRight: '10px', cursor: 'pointer'}}
				/>{' '}
					<div className='brand' style={{display: 'inline-block', cursor: 'default'}}>Web Developer Assessment</div>
			</Navbar.Brand>
			{
				isSignedIn
					? (
						<div className='ms-auto' style={{marginRight: '10px'}}>
							<Navbar.Toggle aria-controls="basic-navbar-nav" />
							<Navbar.Collapse id="basic-navbar-nav">
								<Nav>
									<NavDropdown
										align="end"
										title={
											<svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
												<path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"></path>
												<path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"></path>
											</svg>}
										id="basic-nav-dropdown"
									>
										<NavDropdown.ItemText className='text' >Welcome:<br/>{user.name}</NavDropdown.ItemText >
										<NavDropdown.Divider />
										<NavDropdown.Item className='text' onClick={() => onRouteChange('passwordreset')}>Password Reset</NavDropdown.Item>
										<NavDropdown.Divider />
										<NavDropdown.Item className='text' onClick={() => onRouteChange('logout')}>Log Out</NavDropdown.Item>
									</NavDropdown>
								</Nav>
							</Navbar.Collapse>
						</div>
						)
					: (
						<Button
							style={{backgroundColor: '#1890ff', borderColor: 'white', margin: '0 20px'}}
							className="btn ms-auto"
							type="button"
							onClick={() => onRouteChange('signin')}
						>
							Log In
						</Button>
						)
			}

		</Navbar>
	);
}

export default NavBar;

