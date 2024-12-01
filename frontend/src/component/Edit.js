import axios from "axios";
import React,{useState,useEffect} from "react";
import SocialHeader from './SocialHeader';
import {Link} from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const Edit = () => {
    const[id,setid] = useState(" ");
    const[q1,setq1] = useState("");
    const[q2,setq2] = useState("");
    const[q3,setq3] = useState("");
    const[q4,setq4] = useState("");
    const[q5,setq5] = useState("");
    const[q6,setq6] = useState("");
    const[q7,setq7] = useState("");
    const[q8,setq8] = useState("");
    const[q9,setq9] = useState("");
    const[q10,setq10] = useState("");

    const navigate = useNavigate();


    useEffect(() => {
        setid(localStorage.getItem("id"));
        setq1(localStorage.getItem("q1"));
        setq2(localStorage.getItem("q2"));
        setq3(localStorage.getItem("q3"));
        setq4(localStorage.getItem("q4"));
        setq5(localStorage.getItem("q5"));
        setq6(localStorage.getItem("q6"));
        setq7(localStorage.getItem("q7"));
        setq8(localStorage.getItem("q8"));
        setq9(localStorage.getItem("q9"));
        setq10(localStorage.getItem("q10"));
      
     },[])


     const handleUpdate = (e)=>{
      e.preventDefault();
      console.log("Id...",id);
      axios.put(`http://localhost:8070/Sroute/update/${id}`,
      {
        
        q1:q1,
        q2:q2,
        q3:q3,
        q4:q4,
        q5:q5,
        q6:q6,
        q7:q7,
        q8:q8,
        q9:q9,
        q10:q10
       
      }
      ).then(()=>{
        navigate("/view");
      });
  };

 

  const inputStyle = {
    display: "block",
            width:"100%",
            height:"36px",
            borderWidth: "0 0 2px 0",
            borderColor: "#5543ca",
            fontSize: "18px",
            fontWeight: "400",
            LineHeight: '26px',
  };
  
  const buttonStyle = {
    display: "inline-block",
    backgroundImage: "linear-gradient(125deg,#a72879,#064497)",
    color:"#fff",
    textTransform:"uppercase",
    letterSpacing:"2px",
    fontSize: "16px",
      width:"200px",
      height:"36px",
      border:"none",
      cursor: "pointer",
      
  };
  
  const lableStyle = { 
    color:"#064497"         
  };
  const lableStyle1 = { 
    color:"#064497" ,
    fontWeight: "500",  
       
  };
  
  const cardstyle ={
    overflow : "hidden",
    boxShadow:"0 2px 20px ",
    borderRadius: "$radius",
    transition: "transform 200ms ease-in",
    padding:"20px",
    backdropFilter: "blur(5px)",
    background: "linear-gradient(rgba(255, 255, 255, 0.7),rgba(255, 255, 255, 0.3))",
    width: "610px",
    marginLeft:"450px"
  }
  
   return(
  <>
    <div style={{backgroundImage:`url("./images/coffee-beans-2.jpg")`,
      backgroundRepeat:"no-repeat",
      backgroundSize:"cover",
      width: '100vw',
    height: '100vh'
      
}}>
  <SocialHeader/>
  <div style={{marginLeft:"630px"}}><br/><br/>
                    <label for="topic" style={lableStyle1}><h3>Update Sales</h3></label>
                    </div>
                    <div style={{marginTop:"10px",marginLeft:"860px"}}>
                        <Link to="/view">
                       
                            <button className="btn btn-secondary"  style={buttonStyle}> Back</button>
                           
                        </Link>
                       
                    </div>
   <br></br>
     <form onSubmit = {handleUpdate} >
     <div style={cardstyle}>
  <div className="form-group">
    <label for="q1" style={lableStyle} >q1</label>
    <input    type="text" className="form-control" id="q1"  placeholder="Enter itemNumber" style={inputStyle}
      value={q1}
      onChange={(e)=>{

        setq1(e.target.value);


      }}
    
    
    />
    
  </div>

  <div className="form-group">
    <label for="q2" style={lableStyle} >q2</label>
    <input type="text" className="form-control" id="q2"  placeholder="Enter itemName" style={inputStyle}
    value={q2}
    onChange={(e)=>{

        setq2(e.target.value);


      }}
      
      />
    
  </div>


  
    <div className="form-group">
    <label for="q3" style={lableStyle} >Price</label>
    <input type="text" className="form-control" id="q3"  placeholder="Enter price" style={inputStyle}
   value={q3}
    onChange={(e)=>{

        setq3(e.target.value);


      }}
     />
    
  </div>

  <div className="form-group">
    <label for="q4" style={lableStyle} >Quantity</label>
    <input type="text" className="form-control" id="q4"  placeholder="Enter quantity" style={inputStyle}
    value={q4}
    onChange={(e)=>{

        setq4(e.target.value);


      }}
      />
    
  </div>
  <div className="form-group">
    <label for="q5" style={lableStyle}  >Discount(Rs per item)</label>
    <input type="text" className="form-control" id="q5"  placeholder="Enter discount" style={inputStyle} 
    value={q5}
    onChange={(e) => {
        setq5(e.target.value);
    }}/>
   </div>

  <div className="form-group">
    <label for="q6" style={lableStyle} >Customer Type</label>
    <input className="form-control" id="q6" placeholder="q6" style={inputStyle}
    value={q6}
    onChange={(e)=>{

        setq6(e.target.value);


      }}
      />
  </div>

  <div className="form-group">
    <label for="q7" style={lableStyle} >Customer Type</label>
    <input className="form-control" id="q7" placeholder="q7" style={inputStyle}
    value={q7}
    onChange={(e)=>{

        setq7(e.target.value);


      }}
      />
  </div>

  <div className="form-group">
    <label for="q8" style={lableStyle} >Customer Type</label>
    <input className="form-control" id="q8" placeholder="q8" style={inputStyle}
    value={q8}
    onChange={(e)=>{

        setq8(e.target.value);


      }}
      />
  </div>

  <div className="form-group">
    <label for="q9" style={lableStyle} >Customer Type</label>
    <input className="form-control" id="q9" placeholder="q9" style={inputStyle}
    value={q9}
    onChange={(e)=>{

        setq9(e.target.value);


      }}
      />
  </div>

  <div className="form-group">
    <label for="q10" style={lableStyle} >Customer Type</label>
    <input className="form-control" id="q10" placeholder="q10" style={inputStyle}
    value={q10}
    onChange={(e)=>{

        setq10(e.target.value);


      }}
      />
  </div>

  <div >
  <button type="submit" class="btn btn-primary" style={buttonStyle}>update</button>
  </div>
  </div>
</form>
</div>   

</>
   )

}

export default Edit