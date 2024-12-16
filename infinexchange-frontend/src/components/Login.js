// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Input, Form, FormGroup, Label, Card, CardBody, CardTitle } from 'reactstrap';
import InputField from './InputField';
import logo from '../logo.png'; 
import './login.css'
const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:9090/api/v1/oauth/token', {
                username,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Access token ve refresh token'ları sakla
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);

            // Başarılı girişten sonra yönlendir
            navigate('/home'); // Veya başka bir sayfaya yönlendirme

        } catch (error) {
            console.error('Giriş başarısız:', error);

            setError('Kullanıcı adı veya şifre hatalı!')

        }
    };

    return (
        <div className='loginEkrani'> 
            <Card>
                <CardBody >
                    <img className='logo' src={logo}></img>
                    <Form onSubmit={handleLogin}>
                    <InputField 
                        type="text"
                        id="username"         
                        placeholder="Kullanıcı Adı"   
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}>
                    </InputField>
                    <div style={{
                        width: '478px',
                        height: '30px',
                        textAlign: 'right'
                    }}>
                        <a href='#' style={{
                            textAlign: 'right',
                        }}><span style={{
                            fontFamily: 'Inter',
                            fontSize: '14px',
                            fontWeight: '400',
                            lineHeight: '16.94px',
                            textAlign: 'center',
                            color: '#102C57',

                        }}>
                            Şifremi Unuttum ?
                        </span></a>
                    </div>
                    <InputField 
                    type="password"
                    id="password"
                    placeholder="Şifre"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}>
                    </InputField>
                    <div  style={{
                            width: '478px',
                            gap: '0px',
                            display: 'flex',
                            justifyContent: 'center',
                        }}>
                        <p id='failure'>{error}</p>
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}>
                    <Button className='loginButton' type='submit' color="primary" block
                        ><span className='loginText'>Giriş</span></Button>
                    </div>
                    </Form>
                </CardBody>
            </Card>
        </div>
    );
};

export default Login;
