import React, { useState, useEffect} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const side_picture = require('../../Media/side_picture.png');

interface myProps {
	onRouteChange(route: string): void;
	onSignIn(data: boolean): void;
	loadUser(data: string): void;
	registerEmailSent?: boolean;
}

const SignIn: React.FC<myProps> = ({ onRouteChange, onSignIn, loadUser, registerEmailSent }) => {
	const [userName, setUserName] = useState<string>('');
  const [userPassword, setUserPassword] = useState<string>('');	

	const formValidation = (): boolean => {
		const userNameForm = document.getElementById('userNameForm');
		const passwordForm = document.getElementById('passwordForm');
		if ( !userName || !userPassword ) {
			if (!userName) {				
				if (userNameForm) {
					userNameForm.style.border = '1px solid red';
				}				
			} else {
				if (userNameForm) {
					userNameForm.style.border = '1px solid #ced4da';
				}
			}

			if (!userPassword) {
				if (passwordForm) {
					passwordForm.style.border = '1px solid red';
				}			
			} else {
				if (passwordForm) {
					passwordForm.style.border = '1px solid #ced4da';
				}				
			}
			return false;
		} else {
			if (userNameForm && passwordForm) {
				userNameForm.style.border = '1px solid #ced4da';
				passwordForm.style.border = '1px solid #ced4da';
			}
			return true;
		}
	}

	const onLoginBtnClick = () => {
		const userNameForm = document.getElementById('userNameForm');
		const passwordForm = document.getElementById('passwordForm');
		const loginbtn = document.getElementById('loginbtn');
		const err  = document.getElementById('err');
		if (formValidation()) {
			if (loginbtn) {
				loginbtn.innerHTML = 'Loging...';
			}			
			fetch('http://86.2.58.131:3003/signin', {
				method: 'post',
				credentials: 'include',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					userName: userName,
					userPassword: userPassword
				})
			})
			.then(response => response.json())
			.then(data => {
				if (data.isSignIn) {						
					onRouteChange('home');
					onSignIn(true);
					loadUser(data.username);
				} else {
					if (loginbtn && err && passwordForm && userNameForm) {
						passwordForm.style.border = '1px solid red';
						userNameForm.style.border = '1px solid red';
						loginbtn.innerHTML = 'Log in';
						err.innerHTML = data;
					}
				}
			})
		}
	}

  useEffect(() => {
    const listener = (event: { code: string; preventDefault: () => void; }): void => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        onLoginBtnClick();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  });

	return(
		<Container fluid>
			<Row>
				<Col xs={12} md={7} >
					<img src={side_picture} width='99%' alt='side_picture' />
				</Col>
				<Col xs={12} md={4}>
					<h3 style={{margin: '25px 0'}}>Log in</h3>
					<Form>
						<Form.Group className="mb-3" controlId="userNameForm">
							<Form.Label className="mb-0">User Name</Form.Label>
							<Form.Control type="text" placeholder="User Name" onChange={(event) => setUserName(event.target.value)} />
						</Form.Group>
						<Form.Group className="mb-3" controlId="passwordForm">
							<Form.Label className="mb-0">Password</Form.Label>
							<Form.Control type="password" placeholder="Password" onChange={(event) => setUserPassword(event.target.value)} />
							<p style={{cursor: 'pointer', marginTop: '5px', color: '#1cc792'}} onClick={() => onRouteChange('forgotpassword')}>Forgot Password ?</p>
						</Form.Group>
						<p style={{color: 'red'}} id='err'></p>
						<Button id='loginbtn' style={{backgroundColor: '#1890ff'}}  type="button" onClick={onLoginBtnClick} >
							Log in
						</Button>
					</Form>
					<div className="lh-copy mt3">
						<p style={{cursor: 'pointer', color: '#1cc792', margin: '15px 0'}} onClick={() => onRouteChange('register')}>Or Register a new user</p>
					</div>
					<div>
						{
							(registerEmailSent)
								? (
									<div>
										<p className='brand' style={{ margin: '35px 0 15px 0'}}>Confirmation email has been sent, please check your email box</p>
									</div>
									)
								: null
						}
					</div>
				</Col>
			</Row>
		</Container>
	);
}

export default SignIn;