import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import { useEffect, useMemo, useState } from 'react';
import {loginUser, registerUser, saveToken, forgotPassword} from './api';
import { Alignment, Fit, Layout, useRive, useStateMachineInput } from '@rive-app/react-canvas';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faSun,faMoon} from "@fortawesome/free-solid-svg-icons";
import Background from './background/Background';
import Home from "./pages/Home";
import Attendance from "./pages/Attendance";
import MCQ from "./pages/MCQ";
import Coding from "./pages/Coding";
import Results from "./pages/Results";
import About from "./pages/About";
import Support from "./pages/Support";
import PortalLayout from "./pages/PortalLayout";
import "./pages/pages.css";

const RIVE_SRC = '/animation_login.riv';
const STATE_MACHINE = 'Login Machine';

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark"; 
  });
  const [loggedIn, setLoggedIn] = useState(() => {
    return !!(
      localStorage.getItem("token") ||
      sessionStorage.getItem("token")
    );
  });
  const [active, setActive] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');

  const [successMessage, setSuccessMessage] = useState('');

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');
  const [loginEmailTouched, setLoginEmailTouched] = useState(false);
  const [loginEmailInvalid, setLoginEmailInvalid] = useState(false);
  const [registerEmailTouched, setRegisterEmailTouched] = useState(false);
  const [registerEmailInvalid, setRegisterEmailInvalid] = useState(false);


  const layout = useMemo(
    () =>
      new Layout({
        fit: Fit.Contain,
        alignment: Alignment.Center,
      }),
    []
  );

  const { RiveComponent, rive } = useRive({
    src: RIVE_SRC,
    stateMachines: STATE_MACHINE,
    autoplay: true,
    layout,
  });

  const idle = useStateMachineInput(rive, STATE_MACHINE, 'idle');
  const closeEyes = useStateMachineInput(rive, STATE_MACHINE, 'isHandsUp');
  const isChecking = useStateMachineInput(rive, STATE_MACHINE, 'isChecking');
  const trigSuccess = useStateMachineInput(rive, STATE_MACHINE, 'trigSuccess');
  const trigFail = useStateMachineInput(rive, STATE_MACHINE, 'trigFail');
  const numLook = useStateMachineInput(rive, STATE_MACHINE, 'numLook');

  useEffect(() => {
    if (idle) idle.value = true;
  }, [idle]);

  useEffect(() => {
    if (numLook) numLook.value = loginEmail.trim().length;
  }, [loginEmail, numLook]);

  useEffect(() => {
    if (loginPassword.length === 0 && closeEyes) {
      closeEyes.value = false;
    }
  }, [loginPassword, closeEyes]);

  useEffect(() => {
    if (isChecking) isChecking.value = false;
    if (closeEyes) closeEyes.value = false;
  }, [active, isChecking, closeEyes]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);
  useEffect(() => {

    const handleLogout = () => {
      setLoggedIn(false);
    };

    window.addEventListener(
      "auth:logout",
      handleLogout
    );

    return () => {
      window.removeEventListener(
        "auth:logout",
        handleLogout
      );
    };

  }, []);

  const handleTextFocus = () => {
    if (isChecking) isChecking.value = true;
  };

  const handleTextBlur = () => {
    if (isChecking) isChecking.value = false;
  };

  const handlePasswordFocus = () => {
    if (isChecking) isChecking.value = false;
    if (closeEyes) closeEyes.value = true;
  };

  const handlePasswordBlur = () => {
    if (closeEyes) closeEyes.value = false;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    setLoginError('');
    setSuccessMessage('');

    if (isChecking) isChecking.value = false;
    if (closeEyes) closeEyes.value = false;

    setLoginLoading(true);

    try {
      const response = await loginUser(
        loginEmail.trim(),
        loginPassword
      );

      saveToken(response.token, rememberMe);

      if (trigSuccess) {
        trigSuccess.value = true;
      }

      setSuccessMessage(response.message || "Login successful");
      console.log("JWT token:", response.token);
      setLoggedIn(true);

    } catch (error) {
      if (trigFail) {
        trigFail.value = true;
      }

      setLoginError(error.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    setRegisterError('');
    setSuccessMessage('');
    setRegisterLoading(true);

    try {
      const response = await registerUser({
        name: registerUsername.trim(),
        email: registerEmail.trim(),
        password: registerPassword,
      });

      saveToken(response.token, rememberMe);

      setSuccessMessage(
        response.message || "Registration successful"
      );

      setRegisterUsername('');
      setRegisterEmail('');
      setRegisterPassword('');

      setLoggedIn(true);

      if (trigSuccess) {
        trigSuccess.value = true;
      }

      // Switch back to login if desired
      setActive(false);

    } catch (error) {
      setRegisterError(error.message);

      if (trigFail) {
        trigFail.value = true;
      }
    } finally {
      setRegisterLoading(false);
    }
  };
  if (loggedIn) {
    return (
      <BrowserRouter>

        <Routes>

          <Route
            path="/"
            element={<Navigate to="/home" replace />}
          />

          <Route
            element={<PortalLayout />}
          >

            <Route
              path="/home"
              element={<Home />}
            />

            <Route
              path="/attendance"
              element={<Attendance />}
            />

            <Route
              path="/mcq"
              element={<MCQ />}
            />

            <Route
              path="/coding"
              element={<Coding />}
            />

            <Route
              path="/results"
              element={<Results />}
            />

            <Route
              path="/about"
              element={<About />}
            />

            <Route
              path="/support"
              element={<Support />}
            />

          </Route>

        </Routes>

      </BrowserRouter>
    );
  }

  return (
    <>
    <div className=
    {`app ${
      theme==="system"
      ?window.matchMedia("(prefers-color-scheme: dark)").matches
      ?"dark"
      :"light"
      :theme
    }
    `}>

      <Background theme={theme} />

      <div className="theme-switcher">

        <div className={`switch-slider ${theme}`} />

          <button
            className={theme === "light" ? "active" : ""}
            onClick={() => setTheme("light")}
            aria-label="Light theme"
          >
            <FontAwesomeIcon icon={faSun} className="theme-icon"/>
          </button>

          <button
            className={theme === "dark" ? "active" : ""}
            onClick={() => setTheme("dark")}
            aria-label="Dark theme"
          >
            <FontAwesomeIcon icon={faMoon} className="theme-icon"/>
          </button>

        </div>

        <main className="page-stage">
          <div className="glass-frame">
            <div className="glass-filter"></div>
            <div className="glass-overlay"></div>
            <div className="glass-noise"></div>
            <div className="glass-specular"></div>
            <div className="glass-border"></div>
            <div className="login-wrapper">
              <div className="avatar-stage" aria-label="Animated login avatar">
                <div className="rive-shell">
                  <RiveComponent />
                </div>
              </div>

              <div className={`container${active ? " active" : ""}`}>
                <div className="curved-shape" />
                  <div className="curved-shape2" />
                    <div className="form-box Login">
                      <h2 className="animation" style={{ '--D': 0, '--S': 21 }}>
                        Login
                      </h2>
                      <form action="#" onSubmit={handleLoginSubmit}>
                      <div className={`input-box animation ${loginEmailInvalid ? 'invalid' : ''} ${loginEmail ? 'filled' : ''}`} style={{ '--D': 1, '--S': 22 }}>
                      <input
                        id="login-email"
                        name="loginEmail"
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => {
                          const value = e.target.value;
                          setLoginEmail(value);
                          if (numLook) numLook.value = value.trim().length;
                          if (loginEmailTouched) {
                            setLoginEmailInvalid(
                              !e.target.validity.valid &&
                                value.trim().length > 0
                            );
                          }
                        }}
                        onBlur={(e) => {
                          setLoginEmailTouched(true);
                          setLoginEmailInvalid(
                            !e.target.validity.valid &&
                            e.target.value.trim().length > 0
                          );
                          handleTextBlur();
                        }}
                        onFocus={handleTextFocus}
                      />
                      <label htmlFor="login-email">Email</label>
                      <i className="bx bxs-envelope" />
                    </div>
                    <div
                      className={`input-box animation ${loginPassword ? 'filled' : ''}`}
                      style={{ '--D': 2, '--S': 23 }}
                    >
                      <input
                        id="login-password"
                        name="loginPassword"
                        type="password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        onFocus={handlePasswordFocus}
                        onBlur={handlePasswordBlur}
                      />
                      <label htmlFor="login-password">Password</label>
                      <i className="bx bxs-lock-alt" />
                    </div>
                    {loginError && (
                      <p className="auth-error">
                        {loginError}
                      </p>
                    )}

                    {successMessage && (
                      <p className="auth-success">
                        {successMessage}
                      </p>
                    )}
                <div
                  className="remember-me animation"
                  style={{ '--D': 3, '--S': 24 }}
                >
                  <label className="remember-label" htmlFor="remember">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Remember me</span>
                  </label>

                  <a
                    href="#"
                    className="forgot-password"
                    onClick={(e) => {
                      e.preventDefault();

                      setForgotEmail(loginEmail);
                      setForgotError('');
                      setForgotMessage('');
                      setShowForgotPassword(true);
                    }}
                  >
                    Forgot Password?
                  </a>
                </div>
                <div
                  className="input-box animation"
                  style={{ '--D': 4, '--S': 25 }}
                >
                  <button
                    className="btn"
                    type="submit"
                    disabled={loginLoading}
                  >
                    {loginLoading ? "Logging in..." : "Login"}
                </button>
                </div>
                <div
                  className="regi-link animation"
                  style={{ '--D': 4, '--S': 25 }}
                >
                  <p>
                    Don't have an account?{" "}
                    <a
                      href="#"
                      className="SignUpLink"
                      onClick={(e) => {
                        e.preventDefault();
                        setLoginEmailInvalid(false);
                        setLoginEmailTouched(false);
                        setActive(true);
                      }}
                    >
                      Sign Up
                    </a>
                  </p>
                </div>
              </form>
            </div>

          <div className="info-content Login">
            <h2  className="animation"  style={{ '--D': 0, '--S': 20 }}>
              WELCOME BACK!
            </h2>

            <p  className="animation"  style={{ '--D': 1, '--S': 21 }}>
              Welcome to AI powered college website.
            </p>
          </div>

          <div className="form-box Register">
            <h2 className="animation" style={{ '--li': 17, '--S': 0 }}>
              Register
            </h2>
            <form action="#" onSubmit={handleRegisterSubmit}>
              <div  className={`input-box animation ${  registerUsername ? 'filled' : ''  }`}  style={{ '--li': 18, '--S': 1 }}>
                <input
                  id="register-username"
                  name="registerUsername"
                  type="text"
                  required
                  value={registerUsername}
                  onChange={(e) => {
                    setRegisterUsername(e.target.value);
                    if (numLook)
                      numLook.value = e.target.value.trim().length;
                  }}
                  onFocus={() => {
                    if (isChecking)
                      isChecking.value = true;

                    if (numLook)
                      numLook.value = 10;
                  }}
                  onBlur={handleTextBlur}/>

                  <label htmlFor="register-username">
                    Username
                  </label>

                <i className="bx bxs-user" />
              </div>

              <div  className={`input-box animation ${  registerEmailInvalid ? 'invalid' : ''  } ${registerEmail ? 'filled' : ''}`}  style={{ '--li': 19, '--S': 2 }}>
                <input
                  id="register-email"
                  name="registerEmail"
                  type="email"
                  required
                  value={registerEmail}
                  onChange={(e) => {
                    const value = e.target.value;

                    setRegisterEmail(value);

                    if (numLook)
                      numLook.value = value.trim().length;

                    if (registerEmailTouched) {
                      setRegisterEmailInvalid(!e.target.validity.valid &&value.trim().length > 0);
                    }
                  }}
                  onBlur={(e) => {
                    setRegisterEmailTouched(true);
                    setRegisterEmailInvalid(!e.target.validity.valid &&e.target.value.trim().length > 0);

                    handleTextBlur();
                  }}
                  onFocus={handleTextFocus}/>

                  <label htmlFor="register-email">
                    Email
                  </label>
                  <i className="bx bxs-envelope" />
                </div>

                <div  className={`input-box animation ${  registerPassword ? 'filled' : ''}`}  style={{ '--li': 20, '--S': 3 }}>
                  <input
                    id="register-password"
                    name="registerPassword"
                    type="password"
                    required
                    value={registerPassword}
                    onChange={(e) =>
                      setRegisterPassword(e.target.value)
                    }
                    onFocus={() => {
                      if (isChecking)
                        isChecking.value = false;

                      if (closeEyes)
                        closeEyes.value = true;
                    }}
                    onBlur={handlePasswordBlur}/>

                      <label htmlFor="register-password">
                        Password
                      </label>

                  <i className="bx bxs-lock-alt" />
                </div>
                {registerError && (
                  <p className="auth-error">
                   {registerError}
                  </p>
                )}

                <div  className="input-box animation"  style={{ '--li': 21, '--S': 4 }}>
                  <button
                    className="btn"
                    type="submit"
                    disabled={registerLoading}
                  >
                    {registerLoading ? "Creating account..." : "Register"}
                  </button>
                </div>

                <div  className="regi-link animation" style={{ '--li': 22, '--S': 5 }}>
                  <p>
                    Already have an account?{" "}
                    <a href="#"
                      className="SignInLink"
                      onClick={(e) => {
                        e.preventDefault();

                        setRegisterEmailInvalid(false);
                        setRegisterEmailTouched(false);

                        setActive(false);
                      }}>
                      Sign In
                    </a>
                  </p>
                </div>
              </form>
            </div>

            <div className="info-content Register">
              <h2 className="animation" style={{ '--li': 17, '--S': 0 }}>
                JOIN US TODAY!
              </h2>

              <p className="animation" style={{ '--li': 18, '--S': 1 }}>
                Create your account and start your AI-powered coding
                journey with Teddy.
              </p>
            </div>

          </div>
        </div>
      </div>

{showForgotPassword && (
  <div className="forgot-modal">
    <div className="forgot-modal-content">

      <h2>Forgot Password</h2>

      <p>
        Enter your email address and we'll generate
        a password reset token.
      </p>

      <input
        type="email"
        value={forgotEmail}
        onChange={(e) => setForgotEmail(e.target.value)}
        placeholder="Enter your email"
      />

      {forgotError && (
        <p className="auth-error">
          {forgotError}
        </p>
      )}

      {forgotMessage && (
        <p className="auth-success">
          {forgotMessage}
        </p>
      )}

      <button
        className="btn"
        disabled={forgotLoading}
        onClick={async () => {

          setForgotError('');
          setForgotMessage('');
          setForgotLoading(true);

          try {

            const token = await forgotPassword(
              forgotEmail.trim()
            );

            setForgotMessage(
              `Reset token: ${token}`
            );

          } catch (error) {

            setForgotError(error.message);

          } finally {

            setForgotLoading(false);

          }
        }}
      >
        {forgotLoading
          ? "Sending..."
          : "Generate Reset Token"}
      </button>

      <button
        type="button"
        className="btn"
        onClick={() => setShowForgotPassword(false)}
      >
        Close
      </button>

    </div>
  </div>
)}

      </main>
      </div>
    </>
  );
}