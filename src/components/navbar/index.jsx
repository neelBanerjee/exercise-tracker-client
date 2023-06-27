import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import SiteLogo from '../../assets/images/logo.png';
import styles from "./styles.module.css";

export function Navbar() {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  const navigate = useNavigate();

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  }; 

  useEffect(() => {
    const handleRouteChange = () => {
      // Perform any initialization logic here
      //console.log('Route changed');
    };

    const unmountCleanup = () => {
      // Perform any cleanup logic here
      setIsNavbarOpen(false);
    };

    //console.log(isNavbarOpen);
    
    return () => {
      // Perform any cleanup logic here
      handleRouteChange();
      unmountCleanup();
    };

  }, [navigate]);
  
  const handleLogout = (e) => {
    e.preventDefault();
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out from the system!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Go ahead!'
    }).then(async (result) => {
        if (result.isConfirmed) {
          localStorage.removeItem("jwtAuthToken");
          navigate('/login');
        }  
    })   
  };

  const userAuthToken = localStorage.getItem("jwtAuthToken");
  console.log(userAuthToken);

  const navRoutes = [
    {
      name: "Dashboard",
      path: "/",
      eventType: null,
      callback : null,
    },
    {
      name: "Edit Profile",
      path: "/edit-profile",
      eventType: null,
      callback : null,
    },
    {
      name: "Exercises",
      path: "/manage-exercise",
      eventType: null,
      callback : null,
    }
];

  return (
      <nav className={styles.navbar}>
        {/* <div className={styles.logo}><img src={SiteLogo}/></div> */}
        <div className={styles.logo}>Mern Exercise Tracker</div>

        <ul className={styles.nav_links}>

          <input type="checkbox" id="checkbox_toggle" checked={isNavbarOpen} onChange={toggleNavbar}/>
          <label htmlFor="checkbox_toggle" className={styles.hamburger}>&#9776;</label>

          <div className={styles.menu}>
           {navRoutes.map(({ name, path, eventType, callback }, key ) => (  
              <li key={key}>
                <NavLink to={path != null ? path : {}} className={({ isActive }) => (isActive ? styles.active : '')}>
                  {name}
                </NavLink>
              </li> 
           ))} 
            {/* <li className={styles.services}>
              <Link to={"/"}>Services</Link>

              <ul className={styles.dropdown}>
                <li><Link to={"/"}>Dropdown 1 </Link></li>
                <li><Link to={"/"}>Dropdown 2</Link></li>
                <li><Link to={"/"}>Dropdown 2</Link></li>
                <li><Link to={"/"}>Dropdown 3</Link></li>
                <li><Link to={"/"}>Dropdown 4</Link></li>
              </ul>styles.active

            </li> */}

            <li><NavLink onClick={handleLogout}>Logout</NavLink></li>
          </div>
        </ul>
      </nav>
  );
}

export default Navbar;