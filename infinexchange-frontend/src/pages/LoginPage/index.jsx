// src/components/Login.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Form, Card, CardBody } from "reactstrap";
import logo from "../../logo.png";
import "./login.css";
import InputComponent from "../../CommonComponents/InputComponent";
import { InputAdornment, IconButton, TextField } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Index = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:9090/api/v1/oauth/token",
        {
          username,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // Access token ve refresh token'ları sakla
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      // Başarılı girişten sonra yönlendir
      navigate("/home"); // Veya başka bir sayfaya yönlendirme
    } catch (error) {
      console.error("Giriş başarısız:", error);

      setError("Kullanıcı adı veya şifre hatalı!");
    }
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  return (
    <div className="loginEkrani" style={{ height: "950px" }}>
      <Card>
        <CardBody>
          <img className="logo" src={logo}></img>
          <Form onSubmit={handleLogin}>
            <InputComponent
              id="username"
              label="Kullanıcı Adı"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={error ? error : undefined}
            />
            <TextField
              fullWidth
              id="password"
              label="Şifre"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={error ? error : undefined}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      edge="end"
                      onClick={handleClickShowPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {/* <InputField
              type="text"
              id="username"
              placeholder="Kullanıcı Adı"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            ></InputField> */}
            {/* <InputField
              type="password"
              id="password"
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></InputField> */}
            <div
              style={{
                width: "478px",
                height: "30px",
                textAlign: "right",
                cursor: "pointer"
              }}
              onClick={() => navigate('/forgot-password')}
            >
              <span
                style={{
                  fontFamily: "Inter",
                  fontSize: "14px",
                  fontWeight: "400",
                  lineHeight: "16.94px",
                  textAlign: "center",
                  color: "#102C57",
                }}
              >
                Şifremi Unuttum ?
              </span>
            </div>

            <div
              style={{
                width: "478px",
                gap: "0px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <p id="failure">{error}</p>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                className="loginButton"
                type="submit"
                color="primary"
                block
              >
                <span className="loginText">Giriş</span>
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};

export default Index;
