import React, { useState,useEffect } from 'react';
import '../DoctorDetails.css';
import { Navigate,Link } from 'react-router-dom';
import algosdk,{ OnApplicationComplete } from "algosdk";
import appspec from '../application.json'
import { Buffer } from 'buffer';

const PatientAccept = ({handleDisconnectWalletClick,restapi,peraWallet,accountAddress}) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [data, setData] = useState([]);

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

  async function ski(obj) {
    const baseServer = 'https://testnet-algorand.api.purestake.io/ps2'
    const port = '';
    const token = {
        'X-API-Key': 'LFIoc7BZFY4CAAHfCC2at53vp5ZabBio5gAQ0ntL'
    }
    const algodclient = new algosdk.Algodv2(token, baseServer, port);
    const suggestedParams = await algodclient.getTransactionParams().do();
    const contract = new algosdk.ABIContract(appspec.contract);
    const atc = new algosdk.AtomicTransactionComposer();
    console.log("ac add",accountAddress);
    
    atc.addMethodCall({
        appID:394681975,
        method:algosdk.getMethodByName(contract.methods, 'add_access_hash'),
        methodArgs: [obj.current_hash],
        note: new Uint8Array(Buffer.from(JSON.stringify(obj).length<1024?JSON.stringify(obj):'')),
        sender: accountAddress,
        suggestedParams:suggestedParams,
        signer: peraWalletSigner(peraWallet),
        onComplete: OnApplicationComplete.NoOpOC
    })
    console.log(atc);

    atc.execute(algodclient,4)
      .then(async result => {
        console.log(result);
        const response = await restapi.post("/update_access_hash",JSON.stringify({
              obj: obj,
            }),
            {headers: {
              "Content-Type": "application/json",
            }}
          );
          const responseData = response.data;
          if ( responseData.statusCode === 302 ) {
    
            console.log(responseData);
            window.location.href = "/";
          }
          if ( responseData.statusCode === 200 ) {
            console.log(responseData);
            alert(responseData.notify);
            window.location.reload();
          }
          else{
            alert(responseData.notify);
          }
      })
      .catch(error => {
        // console.error(error);
        alert(error)
      });
    }

    async function handleButtonClick(index,btn_val){
      console.log(index,btn_val);
      let row=data[index];
      let access_status = btn_val;
      let request_hash=row['request_hash'];

      var response = await restapi.post('/generate_access_hash',JSON.stringify({
        access_status:access_status,
        request_hash:request_hash,
      }),{headers:{
        "Content-Type": "application/json",
      }})
      var responseData = response.data
      console.log(responseData);
      if(responseData.statusCode===200){
        console.log(responseData.obj);
        await ski(responseData.obj)
      }
      else if(responseData.statusCode==500 || responseData.statusCode==403){
        alert(responseData.notify);
      }
      else{
        window.location.href="/";
      }
    }

  useEffect(() => {
    console.log("useeffect");
    // when page loads for the first time send a request to the server to get the data
    async function sendRequest() {
      try {
        const response = await restapi.get("/get_request_log");
        const responseData =  response.data;
        if (responseData.statusCode === 200) {
          setData(responseData.data);
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

  function handleSelectedRow(index){
    setSelectedRow(index);
    const selectedData = data[selectedRow];
  }


  const renderTable = () => {
      return (
        <div className={`tablecard ${blur_class}`}>
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
        <table className="table content-table">
          <thead>
            <tr>
              <th>SNum</th>
              <th>Date</th>
              <th>Doctor Name</th>
              <th>Note</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} >
                <td>{row.sno}</td>
                <td>{row.date}</td>
                <td>{row.doctor_name}</td>
                <td>{row.note}</td>
                <td>{row.access_status==-1?<><button onClick={()=>handleButtonClick(index,1)} className='button1'>Accept</button><span> </span><button onClick={()=>handleButtonClick(index,0)} className='button1'>Decline</button></>:(row.access_status===1)?'Access Given on '+row.access_given_on:'Access Declined on '+row.access_given_on}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      );
  };
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsBlurred(!isBlurred); // Toggle the blur effect when the menu is opened/closed
  };
  const hamburger_class = isMenuOpen ? 'hamburger hamburger--spring is-active' : 'hamburger hamburger--spring';
  const blur_class = isBlurred ? 'blur' : '';

  return (
    <div className="navbar-container patientaccept-body">
      <nav className="navbar"> {/* Use the class name directly */}
        <div className="logo">
          <img src="logo.png" alt="Medisafe Logo" />
          <span className='nav-heading'>MEDISAFE</span>
        </div>
        <div className="profile">
          <a href="/patientprofile">
            <img src="profile.png" alt="Profile Pic" />
          </a>
          {/* <span>Hello, {userName}</span> */}
          <button class={hamburger_class} type="button" onClick={toggleMenu}>
            <span class="hamburger-box">
              <span class="hamburger-inner"></span>
            </span>
          </button>  
        </div>
      </nav>
    <div className='doctor-details-container'>
      <h1 className="center-heading">Request Logs</h1>
      {renderTable()}
    </div>
      
    <div className={`dropdown-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className='dropdown-box'>
          <Link className='button' to="/patient_logs">Request Logs</Link>
          <Link className='button' to="/patient_contacts">Contacts</Link>
          <Link className='button' to="/patient_reports">Reports</Link>
          <Link className='button' to="/patient_add">Add Data</Link> 
          <Link className='button' to="/patient_qr">QR Scan</Link>
        </div>
        <div className='dropdown-box'>
        <hr />
        <button className='button' onClick={handleDisconnectWalletClick}>Logout</button>
        <div className="social-icons">
          <i className="fab fa-facebook"></i>
          <i className="fab fa-twitter"></i>
          <i className="fab fa-instagram"></i>
        </div>
        </div>
      </div>
    </div>
  );
};

export default PatientAccept;
