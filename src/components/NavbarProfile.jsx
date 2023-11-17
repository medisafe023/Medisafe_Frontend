import React, { useState,useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import '../Profile.css'; // Import the CSS file
import DoctorProfile from './DoctorProfile.jsx';

const NavbarProfile = ({accountAddress,restapi,loggedIn,handleDisconnectWalletClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false);
  const [role, setRole] = useState('');
  const [dob,setDob] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    // when page loads for the first time send a request to the server to get the data
    async function sendRequest() {
      try {
        const response = await restapi.get("/user_info", {
          method: "GET",
        });
        const responseData = response.data;
        if (responseData.statusCode === 200) {
          console.log(responseData.data);
          setRole(responseData.data.local_state.role);
          setName(responseData.data.local_state.name);
          setDob(responseData.data.local_state.DOB);
        }
        else{
          <Navigate to="/" />
        }
      } catch (error) {
        console.log(error);
      }
    }
    sendRequest();
  }
  , []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsBlurred(!isBlurred); // Toggle the blur effect when the menu is opened/closed
  };
  const hamburger_class = isMenuOpen ? 'hamburger hamburger--spring is-active' : 'hamburger hamburger--spring';
  if(loggedIn===true){
  return (
    
    <div className="navbar-container profile-body">
      
      <nav className="navbar"> {/* Use the class name directly */}
        <div className="logo">
          <img src="logo.png" alt="Medisafe Logo" />
          <span className='nav-heading'>MEDISAFE</span>
        </div>
        <div className="profile">
          <img src="profile.png" alt="Profile Pic" />
          {/* <span>Hello, {userName}</span> */}
          <button class={hamburger_class} type="button" onClick={toggleMenu}>
            <span class="hamburger-box">
              <span class="hamburger-inner"></span>
            </span>
          </button>  
        </div>
      </nav>
    <DoctorProfile
        accountAddress={accountAddress}
        name={name}
        dob={dob}
        specialization={'Cardiology'}
        experience={6}
        isBlurred={isBlurred} // Pass the blur state to the Profile component
      />
    <div className={`dropdown-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="dropdown-box">
        <Link className="button" to="/doctor_access">Patients dealed</Link>        
        <Link className="button" to="/profile_qr">QR Scan</Link>
        </div>
        <div className="dropdown-box">
        <hr />
        <button className="button" onClick={handleDisconnectWalletClick}>Logout</button>
        <div className="social-icons">
          <i className="fab fa-facebook"></i>
          <i className="fab fa-twitter"></i>
          <i className="fab fa-instagram"></i>
        </div>
        </div>
      </div>
    
    </div>
    
  )}
  else{
    return(<Navigate to='/'/>)
  };
};

export default NavbarProfile;
