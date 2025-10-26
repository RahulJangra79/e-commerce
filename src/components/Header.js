import { useState, useEffect, useRef } from "react";
import "./Header.css";
import { Link, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import {
  onAuthStateChanged,
  signOut,
  reauthenticateWithCredential,
  updatePassword,
  EmailAuthProvider,
} from "firebase/auth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function Header() {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const dropdownRef = useRef(null);
  const hamburgerRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }

      if (
        hamburgerRef.current &&
        menuRef.current &&
        !hamburgerRef.current.contains(event.target) &&
        !menuRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Swal.fire({
        icon: "success",
        title: "Logged out",
        text: "You have been signed out.",
      });
      setIsDropdownOpen(false);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Logout Failed",
        text: error.message,
      });
    }
  };

  const handleChangePassword = async () => {
    if (!currentUser || !currentPassword || !newPassword) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill all fields.",
      });
      return;
    }

    if (newPassword.length < 8) {
      Swal.fire({
        icon: "warning",
        title: "Weak Password",
        text: "New password must be at least 8 characters.",
      });
      return;
    }

    const credential = EmailAuthProvider.credential(
      currentUser.email,
      currentPassword
    );

    try {
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);

      Swal.fire({
        icon: "success",
        title: "Password Changed",
        text: "Your password has been updated successfully.",
      });

      setShowChangeModal(false);
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.message,
      });
    }
  };

  return (
    <div className="header-main">
      <div className="header-logo" onClick={() => navigate("/")}></div>

      <div
        className={`hamburger-icon ${isMenuOpen ? "open" : ""}`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        ref={hamburgerRef}
      >
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>

      <div className={`header-nav ${isMenuOpen ? "open" : ""}`} ref={menuRef}>
        <ul>
          <li>
            <Link
              to="/"
              className={location.pathname === "/" ? "active-link" : ""}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/women"
              className={location.pathname === "/women" ? "active-link" : ""}
              onClick={() => setIsMenuOpen(false)}
            >
              Women
            </Link>
          </li>
          <li>
            <Link
              to="/men"
              className={location.pathname === "/men" ? "active-link" : ""}
              onClick={() => setIsMenuOpen(false)}
            >
              Men
            </Link>
          </li>
          <li>
            <Link
              to="/allproducts"
              className={
                location.pathname === "/allproducts" ? "active-link" : ""
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={location.pathname === "/about" ? "active-link" : ""}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
          </li>
        </ul>
        <ul>
          <li className="user-dropdown">
            {currentUser ? (
              <div className="dropdown" ref={dropdownRef}>
                <button
                  className="user-button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {currentUser.displayName || currentUser.email}
                  <i className="fa-solid fa-caret-down"></i>
                </button>
                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    <button onClick={() => navigate(`/my-orders`)}>My Orders</button>
                    <button onClick={() => setShowChangeModal(true)}>
                      Change Password
                    </button>
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <button className="login-button">Login</button>
              </Link>
            )}
          </li>
          <li>
            <Link to="/cart" onClick={() => setIsMenuOpen(false)}>
              <i className="fa-solid fa-bag-shopping"></i>
            </Link>
          </li>
        </ul>
      </div>

      {showChangeModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Change Password</h2>
            <input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <div className="modal-actions">
              <button onClick={handleChangePassword}>Submit</button>
              <button
                onClick={() => {
                  setShowChangeModal(false);
                  setCurrentPassword("");
                  setNewPassword("");
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
}

export default Header;
