import React from 'react';
import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import CreateVoting from './routes/create-voting';
import ProcessVoting from './routes/process-voting';
import Connect from './components/connect';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useEthers } from '@usedapp/core';

function App() {
  const { account } = useEthers();

  return (
    <div className="App">
      <ToastContainer/>
      <BrowserRouter>
        <header className="p-3 text-bg-dark">
          <div className="container">
            <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
            <img src='https://yarchain.org/img/yar_logo.svg' alt='' style={{ width: '15%' }} />
              <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                <li>
                  <NavLink className="nav-link px-2 text-white" to="/">
                    Votings
                  </NavLink>
                </li>
              </ul>
              { 
                account ? <NavLink aria-disabled to="/create" className='btn btn-success'>Create Voting</NavLink> : 
                <button className='btn btn-success' disabled>Create Voting</button> 
              }
              <Connect/>
            </div>
          </div>
        </header>
        <div className="container main-content">
          <Routes>
            <Route path="/create" element={<CreateVoting/>}></Route>
            <Route path="/" element={<ProcessVoting/>}></Route>
          </Routes>
        </div>
        <footer className='text-bg-dark'>
          <div className="footer-title">
            © 2023, made by IZZZIO
          </div>
        </footer>
      </BrowserRouter>
    </div>
  );
}
export default App;
