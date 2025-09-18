import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
 

interface User {
  accessRole: string;
}

const useRedirectToAdminPage = (page: string): void => {
  const navigate = useNavigate();
  const [ user,setUser ] = useState({accessRole : "",id : 0});

  useEffect(() => {
    const storedUser = JSON.parse(JSON.stringify(localStorage.getItem("user")));
    //console.log(storedUser);
    setUser(storedUser);
 
      if (storedUser != null)  {
        navigate(`/${page}`);
      }  else {
        navigate("/login");
      }
    
  }, [user, navigate]);
};

export default useRedirectToAdminPage;