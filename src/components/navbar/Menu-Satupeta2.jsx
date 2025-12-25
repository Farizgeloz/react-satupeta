import { useState, useEffect } from "react";
import axios from "axios";
import {Container ,Nav,Navbar,NavDropdown, NavLink} from 'react-bootstrap';
import '../styles/style_font.css';
import { Link } from "react-router-dom";
import Toogle_Mode from "../page_web/Themes_Mode";
import { api_url_satuadmin } from "../../api/axiosConfig";


const portal = "Portal Satu Peta";

function MenuItem({title,submenu,linked}){
    const [menuku2, setMenu2] = useState([]);
    
    useEffect(() => {
      getMenu();
    }, []);

    const [color2,setColor2] = useState(false);
      const changeColor =() =>{
        if (window.scrollY >=90){
          setColor2(true);
        }else{
          setColor2(false);
        }
      }
      window.addEventListener('scroll', changeColor)

    
    const getMenu = async () => {
      try {
        const response = await api_url_satuadmin.get("openitem/menu-satupeta2", {
          params: title ? { categoryku: title } : {}
        });

        setMenu2(response.data);

      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    const semuaKosong = menuku2?.every(
      (item) => !item.sub_menu || item.sub_menu.trim() === ""
    );

    const linkedFinal = semuaKosong ? menuku2?.[0]?.linked : linked;

    if (menuku2 !== null && !semuaKosong) {
      return(
        <div className="nav-link textsize10 font_weight600 text-black nav-item dropdown">
          <Link aria-expanded="false" role="button" className='dropdown-toggle nav-link textsize12 font_weight600 text-light' to="#">{title}</Link>
          <div data-bs-popper="static" className="dropdown-menu" aria-labelledby="">
            {
              menuku2.map((item,index)=>(
                 <Link key={index} to={item.linked} className="nav-link">{item.sub_menu}</Link>
              ))
             }
          </div>
        </div>
        
      );
    }else{
      return(
        <Link className='text-white-a mx-1 textsize10 px-4 bg-border4 btn-overlay-white' to={linkedFinal}>{title}</Link>
      );
    }
}
function Menu({ bgku, namelinkkku }) {
  const [menuku, setMenu] = useState([]);
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [contents, setContents] = useState("");
  const [title, setTitle] = useState("");

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    getMenu();
  }, []);

  const getMenu = async () => {
    try {
      const response = await api_url_satuadmin.get(`openitem/menu-satupeta`);

      // Cek apakah response.data itu array atau object
      const payload = Array.isArray(response.data) ? response.data : response.data.datas;

      setMenu(payload);

     const response_image = await api_url_satuadmin.get('openitem/images_item', {
        params: {
          portal:portal
        }
      });
      const data_image = response_image.data.image_logo;
      setImage1(data_image.presignedUrl1);
      setImage2(data_image.presignedUrl2);
      setTitle(data_image.title);
      setContents(data_image.contents);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const [color,setColor] = useState(false);
  const changeColor =() =>{
    if (window.scrollY >=90){
      setColor(true);
    }else{
      setColor(false);
    }
  }
  window.addEventListener('scroll', changeColor)

  return (
    <>
     
    <header 
      className={`header2 header-fixed w-100 text-[15px] inset-0`}  
      style={{
        backgroundColor: bgku
      }}
      fixed="top" 
    >
        <Navbar expand="lg" className="w-100">
        
        <Container style={{maxWidth:'95%'}}>
          <Navbar.Brand href="#home" className='d-flex text-blue margin-logo' style={{width:"40vh"}}>
            <img
              src={isMobile ? image1 : (color ? image1 : image1)}
              className="img-header rad10"
              style={{ width: "40vh", height: "auto" }}
            />
            
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="btn-toggle text-white" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            style={{
              maxWidth: 'calc(100% - 40vh)', // lebar 100% minus 250px
              flex: '1 1 auto',
              whiteSpace: 'nowrap',
              position: 'relative',
            }}
          >
            <Nav className="ms-auto">
              {
                menuku.map((menu,index) => {
                  return (
                    <MenuItem key={index} title={menu.category} submenu={menu.sub_menu} linked={menu.linked}/>
                    
                  );
                })
              
              }
              <Toogle_Mode />
              
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
    </>
  )
}

export default Menu
