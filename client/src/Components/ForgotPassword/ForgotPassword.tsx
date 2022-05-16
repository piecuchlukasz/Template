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

const ForgotPassword: React.FC<myProps> = ({ onRouteChange }) => {
	const [userEmail, setUserEmail] = useState<string>('');	

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

	const formValidation = (): boolean => {
		const emailForm = document.getElementById('emailForm');
		if ( !emailValidation() ) {			
			if (emailForm) {
				emailForm.style.border = '1px solid red';
			}			
			return false;
		} else {
			if (emailForm) {
				emailForm.style.border = '1px solid #ced4da';
			}			
			return true;
		}
	}

	const onLoginBtnClick = (): void => {
		const err = document.getElementById('err');
		if (formValidation()) {
			fetch('http://86.2.58.131:3003/forgotPassword', {
				method: 'put',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					userEmail: userEmail
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
					<h3 style={{margin: '25px 0'}}>Forgot Password</h3>
					<Form>
						<Form.Group className="mb-3" controlId="emailForm">
							<Form.Label className="mb-0">Email address</Form.Label>
							<Form.Control type="email" placeholder="Email address" onChange={(event) => setUserEmail(event.target.value.toLowerCase())} />
						</Form.Group>
						<Button style={{backgroundColor: '#1890ff'}} type="button" onClick={onLoginBtnClick} >
							Reset
						</Button>
						<p style={{color: 'red'}} id='err'></p>
					</Form>
				</Col>
			</Row>
		</Container>
	);
}

export default ForgotPassword;