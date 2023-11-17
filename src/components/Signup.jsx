import React, { useState } from 'react';
import algosdk,{ OnApplicationComplete } from "algosdk";
// import {PeraWalletConnect} from "@perawallet/connect"

import appspec from '../application.json'
import '../Signup.css';

function Signup({peraWallet,accountAddress}) {
  const [isDoctor, setIsDoctor] = useState(true);

  const toggleUserType = () => {
    setIsDoctor((prevIsDoctor) => !prevIsDoctor);
  };
  
  function peraWalletSigner(peraWallet){
    return async (txnGroup, indexesToSign) => {
      return await peraWallet.signTransaction([
        txnGroup.map((txn, index) => {
          if (indexesToSign.includes(index)) {
            return {
              txn,
              signers: [accountAddress],
            };
          }
  
          return {
            txn,
            signers: [],
          };
        }),
      ]);
    };
  }

async function ski() {
  console.log("hello");
const baseServer = 'https://testnet-algorand.api.purestake.io/ps2'
const port = '';
const token = {
    'X-API-Key': 'LFIoc7BZFY4CAAHfCC2at53vp5ZabBio5gAQ0ntL'
}
const algodclient = new algosdk.Algodv2(token, baseServer, port);
const suggestedParams = await algodclient.getTransactionParams().do();
console.log(algodclient);
const contract = new algosdk.ABIContract(appspec.contract);

const atc = new algosdk.AtomicTransactionComposer();

var name = document.getElementById("name").value;
var dob = document.getElementById("date").value;
var type = "";
if (isDoctor) {
  type = "DOCTOR";
}
else {
  type = "PATIENT";
}

atc.addMethodCall({
    appID:394681975,
    method:algosdk.getMethodByName(contract.methods, 'account_optin'),
    methodArgs: [name,type,dob],
    sender: accountAddress,
    suggestedParams:suggestedParams,
    signer: peraWalletSigner(peraWallet),
    onComplete: OnApplicationComplete.OptInOC
})
console.log(atc);

atc.execute(algodclient,4)
  .then(async result => {
    const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_add: accountAddress,
        }),
      });
      const responseData = await response.json();
      if ( responseData.statusCode === 302 ) {
        console.log(responseData);
        window.location.href = "/signup";
      }
      if ( responseData.statusCode === 200 ) {
        console.log(responseData);
        if(responseData.role === "DOCTOR"){
          window.location.href = "/doctorprofile";
        }
        else{
          window.location.href = "/patientprofile";
        }
      }
  })
  .catch(error => {
    // console.error(error);
    alert(error)
  });
}



  return (
    <div className="signup-container">
      <div className={`content ${isDoctor ? 'left' : 'right'}`}>
        <div className={`left-content ${isDoctor ? '' : 'blur'}`}>
          <img
            src="doctor-image.png"
            alt="Doctor"
            className="image"
          />
          <p className="label">Doctor</p>
        </div>
        <label className={`switch ${isDoctor ? 'left' : 'right'}`}>
          <input
            type="checkbox"
            className="toggle-button"
            onChange={toggleUserType}
            checked={!isDoctor}
          />
          <span className="slider"></span>
        </label>
        <div className={`right-content ${isDoctor ? 'blur' : ''}`}>
          <img
            src="patient-image.png"
            alt="Patient"
            className="image"
          />
          <p className="label">Patient</p>
        </div>
      </div>
      <div className="signup-form">
        <h2>Sign up as a {isDoctor ? 'Doctor' : 'Patient'}</h2>
        {/* Add your signup form fields here */}
        {/* Example: */}
        <form>
          <label>
            Username:
            <input id='name' type="name" />
          </label>
          <label>
            <input id='date' type='date' />
          </label>
          
        </form>
        <button type="submit" onClick={ski} className='btn1'>Sign Up</button>
      </div>
      <ul class="background">
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      </ul>
    </div>
  );
}

export default Signup;
