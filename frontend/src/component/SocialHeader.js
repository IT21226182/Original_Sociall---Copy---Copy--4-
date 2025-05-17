import React from "react";
import { Link } from "react-router-dom";

const SocialHeader =()=>{
  const lableStyle = { 
    color:"#1C325B",
    fontWeight: "500", 
    fontSize: "18px",        
  };

    

      
      return (
        <nav className="navbar navbar-expand-lg" style={{ backgroundColor: 'transparent' ,marginLeft:"20px"}}>
          <div className="container-fluid">
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link to="/" className="nav-link" style={lableStyle}>Questionnaire</Link>
                </li>
      
                <li className="nav-item">
                  <Link to="/view" className="nav-link" style={lableStyle}>View my response</Link>
                </li>
                <li className="nav-item">
                  <Link to="/pro" className="nav-link" style={lableStyle}>Progress Dashboard</Link>
                </li>

                <li className="nav-item">
                  <Link to="/simon" className="nav-link" style={lableStyle}>Improvement Activity</Link>
                </li>

                <br />
              </ul>
            </div>
          </div>
        </nav>
      );
      
}

export default SocialHeader;