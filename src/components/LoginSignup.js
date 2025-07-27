import { useState, useEffect } from "react";
import "./LoginSignup.css";
import { auth, googleProvider } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { sendPasswordResetEmail } from "firebase/auth";

const LoginSignup = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [signinData, setSigninData] = useState({ email: "", password: "" });
  const [signupErrors, setSignupErrors] = useState({});
  const [signinErrors, setSigninErrors] = useState({});
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");

  const navigate = useNavigate();

  // useEffect(() => {
  //   const container = document.getElementById("container");
  //   if (container) {
  //     container.classList.toggle("right-panel-active", isRightPanelActive);
  //   }
  // }, [isRightPanelActive]);

  // document.getElementById("to-signup").addEventListener("click", () => {
  //   document.querySelector(".container").classList.add("vertical-panel-active");
  // });

  // document.getElementById("to-signin").addEventListener("click", () => {
  //   document
  //     .querySelector(".container")
  //     .classList.remove("vertical-panel-active");
  // });

  useEffect(() => {
    const toSignupBtn = document.getElementById("to-signup");
    const toSigninBtn = document.getElementById("to-signin");
    const container = document.querySelector(".container");

    if (toSignupBtn && container) {
      toSignupBtn.addEventListener("click", () => {
        container.classList.add("vertical-panel-active");
      });
    }

    if (toSigninBtn && container) {
      toSigninBtn.addEventListener("click", () => {
        container.classList.remove("vertical-panel-active");
      });
    }

    // Cleanup to prevent memory leaks
    return () => {
      if (toSignupBtn) {
        toSignupBtn.removeEventListener("click", () => {});
      }
      if (toSigninBtn) {
        toSigninBtn.removeEventListener("click", () => {});
      }
    };
  }, []);

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    if (!validateSignup()) return;

    try {
      await createUserWithEmailAndPassword(
        auth,
        signupData.email,
        signupData.password
      );

      Swal.fire({
        icon: "success",
        title: "Account Created",
        text: "You're all set! Redirecting...",
        timer: 2500,
        showConfirmButton: false,
      });

      setTimeout(() => {
        navigate("/");
      }, 2500);

      setSignupData({ name: "", email: "", password: "" });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text: error.message,
      });
    }
  };

  const handleEmailSignin = async (e) => {
    e.preventDefault();

    if (!validateSignin()) return;

    try {
      const result = await signInWithEmailAndPassword(
        auth,
        signinData.email,
        signinData.password
      );

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: `Welcome back, ${result.user.email}`,
        timer: 2500,
        showConfirmButton: false,
      });

      setTimeout(() => {
        navigate("/");
      }, 2500);

      setSigninData({ email: "", password: "" });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message,
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      Swal.fire({
        icon: "success",
        title: "Logged in with Google",
        text: `Hi ${result.user.displayName}! Redirecting to home...`,
        timer: 2500,
        showConfirmButton: false,
      });

      setTimeout(() => {
        navigate("/");
      }, 2500);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Google Login Failed",
        text: error.message,
      });
    }
  };

  const validateSignup = () => {
    const errors = {};
    if (!signupData.name.trim()) errors.name = "Name is required";
    if (!signupData.email.trim()) errors.email = "Email is required";
    if (!/\S+@\S+\.\S+/.test(signupData.email))
      errors.email = "Invalid email format";
    if (!signupData.password.trim()) errors.password = "Password is required";
    if (signupData.password.length < 8)
      errors.password = "Password must be at least 8 characters";
    setSignupErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateSignin = () => {
    const errors = {};
    if (!signinData.email.trim()) errors.email = "Email is required";
    if (!/\S+@\S+\.\S+/.test(signinData.email))
      errors.email = "Invalid email format";
    if (!signinData.password.trim()) errors.password = "Password is required";
    if (signinData.password.length < 8)
      errors.password = "Password must be at least 8 characters";
    setSigninErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!forgotEmail.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Missing Email",
        text: "Please enter your registered email.",
      });
      return;
    }

    try {
      await sendPasswordResetEmail(auth, forgotEmail);

      Swal.fire({
        icon: "success",
        title: "Email Sent",
        text: "Check your inbox for the password reset link.",
      });

      setShowForgotModal(false);
      setForgotEmail("");
      setForgotMessage("");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Request Failed",
        text: error.message,
      });
    }
  };

  return (
    <div className="login-signup-main">
      <div className="container" id="container">
        {/* Sign Up Form */}
        <div className="form-container sign-up-container">
          <form className="login-signup-form" onSubmit={handleEmailSignup}>
            <h1 className="login-signup-heading">Create Account</h1>
            <div className="login__authOption">
              <img
                className="login__googleAuth"
                src="https://media-public.canva.com/MADnBiAubGA/3/screen.svg"
                alt=""
              />
              <p onClick={handleGoogleLogin}>Continue With Google</p>
            </div>
            <span className="login-signup-span">
              or use your email for registration
            </span>

            <input
              className="login-signup-input"
              type="text"
              placeholder="Name"
              value={signupData.name}
              onChange={(e) =>
                setSignupData({ ...signupData, name: e.target.value })
              }
            />
            {signupErrors.name && (
              <p className="error-text">{signupErrors.name}</p>
            )}

            <input
              className="login-signup-input"
              type="email"
              placeholder="Email"
              value={signupData.email}
              onChange={(e) =>
                setSignupData({ ...signupData, email: e.target.value })
              }
            />
            {signupErrors.name && (
              <p className="error-text">{signupErrors.name}</p>
            )}

            <input
              className="login-signup-input"
              type="password"
              placeholder="Password"
              value={signupData.password}
              onChange={(e) =>
                setSignupData({ ...signupData, password: e.target.value })
              }
            />
            {signupErrors.name && (
              <p className="error-text">{signupErrors.name}</p>
            )}

            <button className="login-signup-button" type="submit">
              Sign Up
            </button>
          </form>

          <button
            type="button"
            className="toggle-form-btn"
            onClick={() => {
              document
                .querySelector(".container")
                ?.classList.remove("vertical-panel-active");
            }}
          >
            Switch to Sign In
          </button>
        </div>

        {/* Sign In Form */}
        <div className="form-container sign-in-container">
          <form className="login-signup-form" onSubmit={handleEmailSignin}>
            <h1 className="login-signup-heading">Sign in</h1>
            <div className="login__authOption">
              <img
                className="login__googleAuth"
                src="https://media-public.canva.com/MADnBiAubGA/3/screen.svg"
                alt=""
              />
              <p onClick={handleGoogleLogin}>Continue With Google</p>
            </div>
            <span className="login-signup-span">or use your account</span>

            <input
              className="login-signup-input"
              type="email"
              placeholder="Email"
              value={signinData.email}
              onChange={(e) =>
                setSigninData({ ...signinData, email: e.target.value })
              }
            />
            {signinErrors.email && (
              <p className="error-text">{signinErrors.email}</p>
            )}

            <input
              className="login-signup-input"
              type="password"
              placeholder="Password"
              value={signinData.password}
              onChange={(e) =>
                setSigninData({ ...signinData, password: e.target.value })
              }
            />
            {signinErrors.password && (
              <p className="error-text">{signinErrors.password}</p>
            )}

            <a
              className="login-signup-anchor"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowForgotModal(true);
              }}
            >
              Forgot your password?
            </a>

            <button className="login-signup-button" type="submit">
              Sign In
            </button>
          </form>

          <button
            type="button"
            className="toggle-form-btn"
            onClick={() => {
              document
                .querySelector(".container")
                ?.classList.add("vertical-panel-active");
            }}
          >
            Switch to Sign Up
          </button>
        </div>

        {/* Overlay Panel */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1 className="login-signup-heading">Welcome Back!</h1>
              <button
                className="ghost login-signup-button"
                onClick={() => setIsRightPanelActive(false)}
              >
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1 className="login-signup-heading">Hello, Friend!</h1>
              <button
                className="ghost login-signup-button"
                onClick={() => setIsRightPanelActive(true)}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>

      {showForgotModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Reset Password</h2>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
            />
            {forgotMessage && <p className="modal-message">{forgotMessage}</p>}
            <div className="modal-actions">
              <button onClick={handleForgotPassword}>Submit</button>
              <button
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotEmail("");
                  setForgotMessage("");
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginSignup;
