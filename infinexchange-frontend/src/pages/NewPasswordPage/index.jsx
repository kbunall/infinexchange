import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Form, Card, CardBody } from "reactstrap";
import logo from "../../logo.png";
import {
  InputAdornment,
  IconButton,
  TextField,
  FormControl,
  FormHelperText,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "./newpassword.css";
import { CustomAlert } from "../../utils/alert";

const Index = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({}); // Hata mesajlarını saklamak için state
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const handleSubmit = async (event) => {
    event.preventDefault(); // Formun varsayılan submit davranışını engeller
    setErrors({}); // Her submit öncesi mevcut hataları temizleyin

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Şifreler eşleşmiyor." });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:9090/api/v1/oauth/password/reset",
        {
          token: token, // Token'ı gönderin
          newPassword: password,
        }
      );
      console.log(response);
      CustomAlert("Şifre başarılı bir şekilde değiştirildi.", "success");
      // Başarı durumunda herhangi bir hata mesajı olmamalı
      setPassword("");
      setConfirmPassword("");
      navigate("/"); // Veya başka bir sayfaya yönlendirme
    } catch (error) {
      console.error("Error:", error.response.data.errors.newPassword);

      // Hata mesajlarını state'e atayın
      const errorMessages = error.response.data.errors;
      const newErrors = {};
      newErrors.password = error.response.data.errors.newPassword;
      newErrors.confirmPassword = error.response.data.errors.newPassword;
      setErrors(newErrors);
    }
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  return (
    <div className="loginEkrani" style={{ height: "950px" }}>
      <Card>
        <CardBody>
          <h3>Yeni Şifre Oluştur</h3>
          <img className="logo" src={logo} alt="Logo"></img>
          <Form onSubmit={handleSubmit}>
            <FormControl
              fullWidth
              style={{ marginBottom: 20 }}
              error={!!errors.password}
            >
              <TextField
                id="new-password-password"
                label="Şifre"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

              <div className="form-helper-text-container">
                <FormHelperText>{errors.password}</FormHelperText>
              </div>
            </FormControl>
            <FormControl fullWidth error={!!errors.confirmPassword}>
              <TextField
                id="new-password-confirmpassword"
                label="Şifre Tekrar"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              <div className="form-helper-text-container">
                <FormHelperText>{errors.confirmPassword}</FormHelperText>
              </div>
            </FormControl>
            <br></br>
            <br></br>
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
                <span className="loginText">Oluştur</span>
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};

export default Index;
