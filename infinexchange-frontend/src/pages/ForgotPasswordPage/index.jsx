// src/components/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Card, CardBody } from "reactstrap";
import logo from "../../logo.png";
import InputComponent from "../../CommonComponents/InputComponent";
import "./forgotpassword.css";
import { CustomAlert } from "../../utils/alert";
import axios from "axios";
import { Box, Link } from "@mui/material";

const Index = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (username === "") {
      alert("username boş değer olamaz.");
      return;
    }
    try {
      CustomAlert(
        "E-mail Doğrulama",
        "success",
        "Kullanıcı adınız sistemde kayıtlı ise hesabınla ilişkilendirilmiş e-posta  adresine yeni şifre oluşturma bağlantısı iletilmiştir."
      );
      const response = await axios.post(
        "http://localhost:9090/api/v1/oauth/password/forgot",
        {
          username,
        }
      );

      setUsername("");
      navigate("/"); // Veya başka bir sayfaya yönlendirme
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="loginEkrani" style={{ height: "950px" }}>
      <Card>
        <CardBody>
          <img className="logo" src={logo}></img>
          <h3>Şifremi Unuttum</h3>
          <br></br>
          <Form>
            <InputComponent
              id="forgot-password-email"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <div
              style={{
                width: "478px",
                gap: "0px",
                display: "flex",
                justifyContent: "center",
              }}
            ></div>
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
                onClick={handleSubmit}
              >
                <span className="loginText">Gönder</span>
              </Button>
            </div>
          </Form>
          <Box sx={{ display: "flex", justifyContent: "flex-end", padding: 2 }}>
            <Link href="/" color="primary" underline="hover">
              Giriş Yap'a dön.
            </Link>
          </Box>
        </CardBody>
      </Card>
    </div>
  );
};

export default Index;
