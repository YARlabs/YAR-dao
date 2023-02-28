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

function App() {
  return (
    <div className="App">
      <ToastContainer/>
      <BrowserRouter>
        <header className="p-3 text-bg-dark">
          <div className="container">
            <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
              <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                <li>
                  <NavLink className="nav-link px-2 text-white" to="/">Voting Process</NavLink>
                </li>
                <li>
                  <NavLink className="nav-link px-2 text-white" to="/create">Create Voting</NavLink>
                </li>
              </ul>
              <Connect/>
            </div>
          </div>
        </header>
        <div className="container">
          <Routes>
            <Route path="/create" element={<CreateVoting/>}></Route>
            <Route path="/" element={<ProcessVoting/>}></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}
export default App;
