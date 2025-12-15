import React from "react"; 
import { useAuth } from "./AuthContext";

function Profile (){
  const { user} = useAuth();
  return(
    <div>
   <div>
      <h2>My Profile</h2>
    </div>

    <div>
      <button className="btn btn-primary ">edit Profile</button>
    </div>
    </div>
   
  )
}

export default Profile;