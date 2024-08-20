import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from 'network/AuthService';
import '../assets/style/main.scss';
import google from '../assets/img/google.svg';
import loginArt from '../assets/img/login_art.png';

const Register = () => {
    const [fullName, setFullName] = useState('');
    const [userAppName, setUserAppName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [passwordVerify, setPasswordVerify] = useState('');
    const [errors, setErrors] = useState('');
    const navigate = useNavigate();
    const [isTeamOrOrganization, setIsTeamOrOrganization] = useState(false);

    const handleRegister = async () => {
        const formData = {
            "username":fullName,
            "userAppName":userAppName,
            "email":email,
            "phoneNumber":phone,
            "password":password,
            "passwordVerify":passwordVerify,
            "role":isTeamOrOrganization ? 1 : 2
        };

        register(formData)
            .then(data => {
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
                localStorage.setItem('role', data.role);
                localStorage.setItem('userName', data.userName);
                localStorage.setItem('userId', data.userId);
                localStorage.setItem('email', data.email);
            navigate('/?welcome');
            })
            .catch(error => {
                console.error('Registration failed:', error.message);
                setErrors(error.message);
                setTimeout(() => {
                    setErrors('');
                  }, 5000);
                setPassword('')
                setPasswordVerify('')
        });
    };

    const handleCheckboxChange = () => {
        setIsTeamOrOrganization(!isTeamOrOrganization);
    };

    const handleInputChange = (event) => {
        setFullName(event.target.value);
      };
    const handleInputUserNameChange = (event) => {
    setUserAppName(event.target.value);
    };
    const handleInputEmailChange = (event) => {
        setEmail(event.target.value);
      };
    const handleInputPasswordChange = (event) => {
        setPassword(event.target.value);
    };
    const handleInputPasswordVerifyChange = (event) => {
        setPasswordVerify(event.target.value);
    };
    const handleInputNumberChange = (event) => {
        setPhone(event.target.value);
    };
    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-flow">
                    <div className="login-left">
                        <div className="content-text">
                        <h2 className="mb15">Welcome 👋</h2>
                        <p id="errors"  className="errors"> 
                            {errors ? errors : null }
                        </p>
                        </div>
                        <div className="login-box">
                            <div className="input-div ">
                                <div className="input-span">Full Name</div>
                                <label htmlFor="fullName"/>
                                <input 
                                value={fullName}
                                onChange={handleInputChange}
                                type="text" className="form-input pir100" required placeholder="Your full name" name="fullName" id="fullName"/>
                            </div>
                            <div className="input-div ">
                                <div className="input-span">App UserName</div>
                                <label htmlFor="appName"/>
                                <input 
                                value={userAppName}
                                onChange={handleInputUserNameChange}
                                type="text" className="form-input pir100" required placeholder="Generate a unique name" name="appName" id="appName"/>
                            </div>
                            <div className="input-div ">
                                <div className="input-span">Email</div>
                                <label htmlFor="email"/>
                                <input 
                                value={email}
                                onChange={handleInputEmailChange}
                                type="email" className="form-input pir100" required placeholder="Generate a unique name" name="email" id="email"/>
                            </div>
                            <div className="input-div ">
                                <div className="input-span">Phone Number</div>
                                <label htmlFor="phone"/>
                                <input 
                                value={phone}
                                onChange={handleInputNumberChange}
                                type="phone" className="form-input pir100" required placeholder="Phone Number" name="phone" id="phone"/>
                            </div>
                            <div className="input-div">
                                <div className="input-span">Password</div>
                                <label htmlFor="password"/>
                                <input 
                                value={password}
                                onChange={handleInputPasswordChange}
                                type="password" className="form-input pir100" required name="password" id="password"/>
                            </div>
                            <div className="input-div">
                                <div className="input-span">Verify Password</div>
                                <label htmlFor="passwordVerify"/>
                                <input 
                                value={passwordVerify}
                                onChange={handleInputPasswordVerifyChange}
                                type="password" className="form-input pir100" required name="passwordVerify" id="passwordVerify"/>
                            </div>
                            <div className="input-div">
                            <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={isTeamOrOrganization}
                                        onChange={handleCheckboxChange}
                                        className="checkbox-input"
                                    />
                                    Register as a team or organization
                                </label>
                            </div>
                            <div className="form-btn">
                                <button onClick={(e) => handleRegister()} className="app-btn primary-form-btn">Register</button>
                            </div>
                        </div>
                        <div className="login-or-area"> 
                            <hr className="hr-or"/>
                            <div className="or-txt">Or</div>
                        </div>
                        <div className="login-other-box">
                            <img src={google}/>
                            <span>Sign up with Google</span>
                        </div>
                        <div className="alignCenter mt20">Yes i have an account? <span onClick={(e) => navigate("/login")} className="link">Login</span></div>
                        <div className="info-right-reserved">© 2024 | WhitePulp Media | ALL RIGHTS RESERVED</div>
                    </div>
                </div>
            
            </div>
            <div className="login-art">
                    <img src={loginArt}/>
                </div>


        </div>
    );
};

export default Register;