import React from 'react';
import '../Profile.css'; // Import the CSS file

const DoctorProfile = ({accountAddress, name, dob,specialization,experience, isBlurred }) => {
  const profileClass = isBlurred ? 'profile-section ps blurred' : 'profile-section ps';

  return (
    <div className={profileClass}>
      <div class="tools">
                <div class="circle">
                  <span class="red box"></span>
                </div>
                <div class="circle">
                  <span class="yellow box"></span>
                </div>
                <div class="circle">
                  <span class="green box"></span>
                </div>
      </div>
      <i className="profile-pic fa-solid fa-user fa-2xl"></i>
      <div className="profile-info">
        <p style={{overflow:"scroll"}}><b>Address:</b> {accountAddress}</p>
        <p><b>Name: </b>{name}</p>
        <p><b>Date of Birth:</b> {dob}</p>
        <p><b>Specialization:</b> {specialization}</p>
        <p><b>Experience:</b> {experience} Years</p>
      </div>
    </div>
  );
};

export default DoctorProfile;
