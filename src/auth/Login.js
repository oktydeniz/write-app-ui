import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from 'network/AuthService';
import '../assets/style/main.scss';
import google from '../assets/img/google.svg';

const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        // odeniz  Aslankaplan77?
        login(identifier, password)
            .then(data => {
                localStorage.setItem('accessToken', data.response.accessToken);
                localStorage.setItem('refreshToken', data.response.refreshToken);
                localStorage.setItem('role', data.response.role);
                localStorage.setItem('userName', data.response.userName);
                localStorage.setItem('userId', data.response.userId);
                localStorage.setItem('email', data.response.email);
            navigate('/');
            })
            .catch(error => {
                setErrors("Invalid username or password");
                setTimeout(() => {
                    setErrors('');
                  }, 5000);
                setPassword('')
        });
    };

    const handleInputChange = (event) => {
        setIdentifier(event.target.value);
      };
    const handleInputPasswordChange = (event) => {
        setPassword(event.target.value);
    };

    
    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-flow">
                    <div className="login-left">
                        <div className="content-text">
                        <h2 className="mb15">Welcome 👋</h2>
                        <p>Today is a new day. It's your day. You shape it.</p>
                        <p>Sign in to start telling us something.</p>
                        <p id="errors"  className="errors"> 
                            {errors ? errors : null }
                        </p>
                        </div>
                        <div className="login-box">
                            <div className="input-div ">
                                <div className="input-span">Identifier</div>
                                <label htmlFor="identifier"/>
                                <input 
                                value={identifier}
                                onChange={handleInputChange}
                                type="text" className="form-input pir100" required placeholder="Username or email" name="identifier" id="identifier"/>
                            </div>
                            <div className="input-div">
                                <div className="input-span">Password</div>
                                <label htmlFor="password"/>
                                <input 
                                value={password}
                                onChange={handleInputPasswordChange}
                                type="password" className="form-input pir100" required name="password" id="password"/>
                            </div>
                            <div className="link alignEnd mt10 mb15">Forgot Password</div>
                            <div className="form-btn">
                                <button onClick={(e) => handleLogin()} className="app-btn primary-form-btn">Login</button>
                            </div>
                        </div>
                        <div className="login-or-area"> 
                            <hr className="hr-or"/>
                            <div className="or-txt">Or</div>
                        </div>
                        <div className="login-other-box">
                            <img src={google}/>
                            <span>Sign in with Google</span>
                        </div>
                        <div className="alignCenter mt20">Don't you have an account? <span onClick={(e) => {
                            navigate('/register')
                        }} className="link">Sign up</span></div>
                        <div className="info-right-reserved">© 2024 | WhitePulp Media | ALL RIGHTS RESERVED</div>
                    </div>
                </div>
            
            </div>

        </div>
    );
};

export default Login;