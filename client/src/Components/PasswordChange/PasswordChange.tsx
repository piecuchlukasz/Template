import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const side_picture = require('../../Media/side_picture.png');

interface myProps {
	onRouteChange(route: string): void;
}

const PasswordChange: React.FC<myProps> = ({ onRouteChange }) => {
	const [userPasswordOld, setUserPasswordOld] = useState<string>('');
	const [userPasswordNew, setUserPasswordNew] = useState<string>('');
	const [userSecPasswordNew, setUserSecPasswordNew] = useState<string>('');

	const userPasswordCompare = (): boolean => {
		if (userPasswordNew !== userSecPasswordNew) {
			return false;
		} else {
			return true;
		}
	}

	const userPasswordValidation = (): boolean => {
   	const pattern = /^(?=.*[A-Za-z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{10,}$/;
   	if (!pattern.test(userPasswordNew) || !pattern.test(userSecPasswordNew)) {
   		return false;
   	} else {
   		return true;
   	}
  }

	const formValidation = (): boolean => {
		const passwordNewForm = document.getElementById('passwordNewForm');
		const passwordOldForm = document.getElementById('passwordOldForm');
		const secPasswordNewForm = document.getElementById('secPasswordNewForm');
		const errPass = document.getElementById('errPass');
		const errPass2 = document.getElementById('errPass2');

		if ( !userPasswordOld || !userPasswordCompare() || !userPasswordValidation() ) {
			if (!userPasswordOld) {
				if (passwordOldForm) {
					passwordOldForm.style.border = '1px solid red';
				}
			} else {
				if (passwordOldForm) {
					passwordOldForm.style.border = '1px solid #ced4da';
				}
			}
			if (!userPasswordCompare()) {
				if (passwordNewForm && secPasswordNewForm && errPass) {
					passwordNewForm.style.border = '1px solid red';
					secPasswordNewForm.style.border = '1px solid red';
					errPass.innerHTML = 'Passwords do not match';
				}
			} else {
				if (passwordNewForm && secPasswordNewForm && errPass) {
					passwordNewForm.style.border = '1px solid #ced4da';
					secPasswordNewForm.style.border = '1px solid #ced4da';
					errPass.innerHTML = '';
				}
			}
			if (!userPasswordValidation()) {
				if (passwordNewForm && secPasswordNewForm && errPass2) {
					passwordNewForm.style.border = '1px solid red';
					secPasswordNewForm.style.border = '1px solid red';
					errPass2.innerHTML = 'Password MUST include at least: 1 capital letter, 1 special character and be minimum 10 characters long';
				}
			} else if (userPasswordCompare()) {
				if (passwordNewForm && secPasswordNewForm && errPass2) {
					passwordNewForm.style.border = '1px solid #ced4da';
					secPasswordNewForm.style.border = '1px solid #ced4da';
					errPass2.innerHTML = '';
				}
			}
			return false;
		} else {
			if (passwordOldForm && secPasswordNewForm && passwordNewForm) {
				passwordOldForm.style.border = '1px solid #ced4da';
				passwordNewForm.style.border = '1px solid #ced4da';
				secPasswordNewForm.style.border = '1px solid #ced4da';
			}
			return true;
		}
	}

   const onResetBtnClick = (): void => {
		const err = document.getElementById('err');
   	if (formValidation()) {
   		fetch('http://86.2.58.131:3003/passwordChange', {
				method: 'put',
				credentials: 'include',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					userPasswordOld: userPasswordOld,
					userPasswordNew: userPasswordNew
				})
			})
				.then(response => response.json())
				.then(data => {
					if (data === 'Success') {
						onRouteChange('signin');
					} else {
						if (err) {
							err.innerHTML = data;
						}
					}
				})
   	}
   }

	return(
		<Container fluid>
			<Row>
				<Col xs={12} md={7} >
					<img src={side_picture} width='99%' alt='side_picture' />
				</Col>
				<Col xs={12} md={4}>
					<h3 style={{margin: '25px 0'}}>Password Reset</h3>
					<Form>
						<Form.Group className="mb-3" controlId="passwordOldForm">
							<Form.Label className="mb-0">Old Password</Form.Label>
							<Form.Control type="password" placeholder="Password" onChange={(event) => setUserPasswordOld(event.target.value)} />
						</Form.Group>
						<Form.Group className="mb-3" controlId="passwordNewForm">
							<Form.Label className="mb-0">New Password</Form.Label>
							<Form.Control type="password" placeholder="Password" onChange={(event) => setUserPasswordNew(event.target.value)} />
						</Form.Group>
						<Form.Group className="mb-3" controlId="secPasswordNewForm">
							<Form.Label className="mb-0">Confirm New Password</Form.Label>
							<Form.Control type="password" placeholder="Password" onChange={(event) => setUserSecPasswordNew(event.target.value)} />
							<p style={{color: 'red'}} id='errPass'></p>
							<p style={{color: 'red'}} id='errPass2'></p>
						</Form.Group>
						<Button style={{backgroundColor: '#1890ff'}} type="button" onClick={onResetBtnClick} >
							Reset
						</Button>
						<p style={{color: 'red'}} id='err'></p>
					</Form>
				</Col>
			</Row>
		</Container>
	);
}

export default PasswordChange;