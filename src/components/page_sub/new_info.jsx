import { useState, useEffect } from "react";
import axios from "axios";

import {Container,Row,Col,Image} from 'react-bootstrap';
import { Link } from "react-router-dom";



function AppTeams() {
  const [artikelku, setArtikel] = useState([]);

  useEffect(() => {
    getArtikel();
  }, []);

  const getArtikel = async () => {
    const response = await api_url_satuadmin.get(
      apiurl+`backend_artikel`
    );
    setArtikel(response.data.result);
  };

  return (
    <section id="teams" className="block works-block">
      <Container fluid>
        <Row className='portfoliolist'>
          {
            artikelku.map((artikel,index) => {
              return (
                <>
                {
                    (() => {
                      if((index)===0) {
                        return (
                          <Col sm={6} key={artikel.id} className="mb-4">
                            <div className='new-info'>
                              <Link to={artikel.linked}>
                                <div className="overflow-hidden">
                                  <Image className="img-first" src={'../../assetku/images/'+artikel.images} />
                                 
                                </div>
                                <p className="category textsize12">{artikel.tag} </p>
                                <div className=''>
                                  <p className="textsize text-silver">{artikel.tanggal_update}</p>
                                
                                    
                                  <Link className="textsize14 font_weight600  height-10 text-black" to="">
          
          
                                  {
                                      (() => {
                                          if((artikel.title).length >=70) {
                                                  return (
                                                      (artikel.title).substring(0, 70)+"..."
                                                  )
                                              } else {
                                                  return (
                                                    (artikel.title)
                                                  )
                                              }
                                      })()  
                                  }  
          
                                  
                                  
                                    
                                    </Link>
                                  
                                  
                                </div>
                              </Link>
                              <p className="textsize12 text-silver">
                                {
                                    (() => {
                                        if((artikel.contents).length >=100) {
                                                return (
                                                    (artikel.contents).substring(0, 100)+"..."
                                                )
                                            } else {
                                                return (
                                                  (artikel.contents)
                                                )
                                            }
                                    })()  
                                }  
                              </p>
                            </div>
                          </Col>
                        )
                      }
                      
                    })()  
                }  
                
                </>
                
              );
            })
            

            
            
          }
          <Col sm={6} key={'bodyku'}>
            <Row>
              {
                artikelku.map((artikel2,index) => {
                  return (
                    <>
                    {
                        (() => {
                          if((index)>=1) {
                              return (
                                <Col sm={6} key={artikel2.id} className="mb-4">
                                  <div className='new-info'>
                                    <Link to={artikel2.linked}>
                                      <div className="overflow-hidden border-rad5">
                                        <Image className="img-item" src={'../../assetku/images/'+artikel2.images} />
                                      </div>
                                      <p className="category textsize10">{artikel2.tag} </p>
                                      <div className=''>
                                        <p className="textsize6 text-silver">{artikel2.tanggal_update}</p>
                                      
                                          
                                        <Link className="textsize12 font_weight600  height-10 text-black" to="">
                
                
                                        {
                                            (() => {
                                                if((artikel2.title).length >=50) {
                                                        return (
                                                            (artikel2.title).substring(0, 50)+"..."
                                                        )
                                                    } else {
                                                        return (
                                                          (artikel2.title)
                                                        )
                                                    }
                                            })()  
                                        }  
                
                                        
                                        
                                          
                                          </Link>
                                        
                                        
                                      </div>
                                    </Link>
                                  </div>
                                </Col>
                              )
                          }
                        })()  
                    }  
                    
                    </>
                    
                  );
                })
              }
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default AppTeams;
