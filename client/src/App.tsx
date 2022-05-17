import React, {} from 'react';
import NavBar from './Components/NavBar/NavBar';
import SignIn from './Components/SignIn/SignIn';
import Register from './Components/Register/Register';
import ForgotPassword from './Components/ForgotPassword/ForgotPassword';
import PasswordChange from './Components/PasswordChange/PasswordChange';
import Spinner from 'react-bootstrap/Spinner';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

type myState = {
  route: string;
  isSignedIn: boolean;
  refreshed: boolean;
  registerEmailSent: boolean;
  user: {
    name: string;
  }
}

const initalState = {
  route: 'signin',
  isSignedIn: false,
  refreshed: false,
  registerEmailSent: false,
  user: {
    name: ''
  },
}

class App extends React.Component<{  }, myState> {
  state = initalState;

  onRouteChange = (route: string): void => {
    if (route === 'logout') {
      fetch('http://86.2.58.131:3003/logout', {
        method: 'post',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'}
      })
      this.setState(initalState);
      this.onRefresh(true);
    } else if (this.state.isSignedIn) {
      fetch('http://86.2.58.131:3003/route', {
        method: 'post',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          route: route
        })
      })
    }
    this.setState({ route: route });
  }

  onSignIn = (data: boolean): void => {
    this.setState({ isSignedIn: data })
  }

  onRefresh = (data: boolean): void => {
    this.setState({ refreshed: data })
  }

  loadUser = (data: string): void => {
    this.setState({ user: {
      name: data,
    }});
  }

  onEmailSent = (data: boolean): void => {
    this.setState({ registerEmailSent: data })
  }

  isSignIn = (): void => {
    fetch('http://86.2.58.131:3003/signin', {
      method: 'get',
      credentials: 'include',
      headers: {'Content-Type': 'application/json'}
    })
    .then(response => response.json())
    .then(data => {
      if (data.isSignIn) {
        this.onSignIn(true);
        this.loadUser(data.username);
        this.setState({ route: data.route });
        this.onRefresh(true);
      } else {
        this.onRefresh(true);
      }
    })
  }

  componentDidMount() {
    this.isSignIn();
  }

  render() {
    const { route, isSignedIn, user, refreshed, registerEmailSent } = this.state;

    return (
      <div>
          <NavBar isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} user={user} />
          {
            (!refreshed)
            ?  <div className='d-flex justify-content-center align-items-center' style={{ width: '100vw', height: '98vh' }}>
                <Spinner animation="border" role="status" style={{ width: '5rem', height: '5rem' }}>
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            : (
                (route === 'home')
                ? <div>
                    <iframe 
                    title="currsel"
                    src="https://sense-demo.qlik.com/sso/single/?appid=cd840389-f841-4477-86be-532fb0b13775&sheet=aLvPhq&opt=ctxmenu,currsel" 
                    style={{ border: 'none', width: '100vw', height: '90vh' }}
                    />
                  </div>
                : (route === 'signin')
                  ? <SignIn onRouteChange={this.onRouteChange} onSignIn={this.onSignIn} loadUser={this.loadUser} registerEmailSent={registerEmailSent}/>
                  : ( route === 'register')
                    ? <Register onRouteChange={this.onRouteChange} onEmailSent={this.onEmailSent} />
                    : ( route === 'passwordreset')
                      ? <PasswordChange onRouteChange={this.onRouteChange} />
                      : ( route === 'logout')
                        ?  <SignIn onRouteChange={this.onRouteChange} onSignIn={this.onSignIn} loadUser={this.loadUser} />
                        :  <ForgotPassword onRouteChange={this.onRouteChange} />
            )
          }        
      </div>
    );
  }
}

export default App;