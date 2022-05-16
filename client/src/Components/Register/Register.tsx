import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const side_picture = require('../../Media/side_picture.png');

interface myProps {
	onRouteChange(route: string): void;
	onEmailSent(data: boolean): void;
}

const Register: React.FC<myProps> = ({ onRouteChange, onEmailSent }) => {
	const [userName, setUserName] = useState<string>('');
	const [userEmail, setUserEmail] = useState<string>('');
	const [userPassword, setUserPassword] = useState<string>('');
	const [userSecPassword, setUserSecPassword] = useState<string>('');	

	const emailValidation = (): boolean | undefined => {
		if (typeof userEmail !== "undefined") {
			let lastAtPos = userEmail.lastIndexOf("@");
			let lastDotPos = userEmail.lastIndexOf(".");

			if (
				!(
					lastAtPos < lastDotPos &&
					lastAtPos > 0 &&
					userEmail.indexOf("@@") === -1 &&
					lastDotPos > 2 &&
					userEmail.length - lastDotPos > 2
				)
			) {
				//Email NOT valid
				return false;
			} else {
				return true;
			}
		}
	}

  const userPasswordCompare = (): boolean => {
		if (userPassword !== userSecPassword) {
			return false;
		} else {
			return true;
		}
	}

	const userPasswordValidation = (): boolean => {
		const pattern = /^(?=.*[A-Za-z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{10,}$/;
		if (!pattern.test(userPassword) || !pattern.test(userSecPassword)) {
			return false;
		} else {
			return true;
		}
	}

	const formValidation = (): boolean => {
		const userNameForm = document.getElementById('userNameForm');
		const emailForm = document.getElementById('emailForm');
		const passwordForm = document.getElementById('passwordForm');
		const secPasswordNewForm = document.getElementById('secPasswordNewForm');
		const errPass = document.getElementById('errPass');
		const errPass2 = document.getElementById('errPass2');

		if ( !userName || !userPasswordCompare() || !userPasswordValidation() ) {
			if (!userName && userNameForm) {
				userNameForm.style.border = '1px solid red';
			}
			else {
				if (userNameForm) {
					userNameForm.style.border = '1px solid #ced4da';
				}
			}

			if (!emailValidation() ) {
				if (emailForm) {
					emailForm.style.border = '1px solid red';
				}
			} else {
				if (emailForm) {
					emailForm.style.border = '1px solid #ced4da';
				}
			}

			if (!userPasswordCompare()) {
				if (passwordForm && secPasswordNewForm && errPass) {
					passwordForm.style.border = '1px solid red';
					secPasswordNewForm.style.border = '1px solid red';
					errPass.innerHTML = 'Passwords do not match';
				}
			} else {
				if (passwordForm && secPasswordNewForm && errPass) {
					passwordForm.style.border = '1px solid #ced4da';
					secPasswordNewForm.style.border = '1px solid #ced4da';
					errPass.innerHTML = '';
				}
			}

			if (!userPasswordValidation()) {
				if (passwordForm && secPasswordNewForm && errPass2) {
					passwordForm.style.border = '1px solid red';
					secPasswordNewForm.style.border = '1px solid red';
					errPass2.innerHTML = 'Password MUST include at least: 1 capital letter, 1 special character and be minimum 10 characters long';
				}
			} else if (userPasswordCompare()) {
				if (passwordForm && secPasswordNewForm && errPass2) {
					passwordForm.style.border = '1px solid #ced4da';
					secPasswordNewForm.style.border = '1px solid #ced4da';
					errPass2.innerHTML = '';
				}
			}
			return false;
		} else {
			if (userNameForm && emailForm && passwordForm) {
				userNameForm.style.border = '1px solid #ced4da';
				emailForm.style.border = '1px solid #ced4da';
				passwordForm.style.border = '1px solid #ced4da';
			}
			return true;
		}
	}

	const onRegisterBtnClick = (): void => {
		const registerbtn = document.getElementById('registerbtn');
		const err = document.getElementById('err');
		if (formValidation()) {
			if (registerbtn) {
				registerbtn.innerHTML = 'Registering...';
			}
			fetch('http://86.2.58.131:3003/register', {
				method: 'post',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					userName: userName,
					userEmail: userEmail,
					userPassword: userPassword
				})
			})
			.then(response => response.json())
			.then(data => {
				if (data === 'Success') {
					onRouteChange('signin');
					onEmailSent(true);
				} else {
					if (registerbtn && err) {
						registerbtn.innerHTML = 'Register';
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
        onRegisterBtnClick();
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
					<h3 style={{margin: '25px 0'}}>Register a new user</h3>
					<Form>
						<Form.Group className="mb-3" controlId="userNameForm">
							<Form.Label className="mb-0">User Name</Form.Label>
							<Form.Control type="text" placeholder="User Name" onChange={(event) => setUserName(event.target.value)} />
						</Form.Group>
						<Form.Group className="mb-3" controlId="emailForm">
							<Form.Label className="mb-0">Email address</Form.Label>
							<Form.Control type="email" placeholder="Email address" onChange={(event) => setUserEmail(event.target.value.toLowerCase())} />
						</Form.Group>
						<Form.Group className="mb-3" controlId="passwordForm">
							<Form.Label className="mb-0">Password</Form.Label>
							<Form.Control type="password" placeholder="Password" onChange={(event) => setUserPassword(event.target.value)} />
						</Form.Group>
						<Form.Group className="mb-3" controlId="secPasswordNewForm">
							<Form.Label className="mb-0">Confirm New Password</Form.Label>
							<Form.Control type="password" placeholder="Password" onChange={(event) => setUserSecPassword(event.target.value)} />
							<p style={{color: 'red'}} id='errPass'></p>
							<p style={{color: 'red'}} id='errPass2'></p>
						</Form.Group>
						<Button id='registerbtn' style={{backgroundColor: '#1890ff'}} className='button-color' type="button" onClick={onRegisterBtnClick} >
							Register
						</Button>
						<p style={{color: 'red', margin: '15px 0'}} id='err'></p>
					</Form>
					<div className="lh-copy mt3">
						<p style={{cursor: 'pointer', color: '#1cc792', margin: '15px 0'}} onClick={() => onRouteChange('signin')}>Log in</p>
					</div>
				</Col>
			</Row>
		</Container>
	);
}

export default Register;