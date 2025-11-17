import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { FcFeedback } from "react-icons/fc";
import { useNavigate} from "react-router-dom";

import Swal from 'sweetalert2';
import { MdErrorOutline } from "react-icons/md";
import api_url_satuadmin from "../../api/axiosConfig";


const portal = "Portal Satu Peta";

const FeedbackModal = () => {
    const [show, setShow] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [tujuan, setTujuan] = useState("");
    const [posisi, setPosisi] = useState("");
    const [temu, setTemu] = useState("");

    const [image1, setImage1] = useState("");
    const [image2, setImage2] = useState("");
    const [contents, setContents] = useState("");
    const [title, setTitle] = useState("");

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const navigate = useNavigate();

    
    
    useEffect(() => {
        getMenu();
    }, []);

    const getMenu = async () => {
        try {

        const response_image = await api_url_satuadmin.get('api/open-item/images_item', {
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

    const [validasi_tujuan, setvalidasi_tujuan] = useState(false);
    const [validasi_posisi, setvalidasi_posisi] = useState(false);
    const [validasi_temu, setvalidasi_temu] = useState(false);

    const handle_step = (event) => {
    if (tujuan.length<3) {setvalidasi_tujuan(true);}else{setvalidasi_tujuan(false);}
    if (posisi.length<3) {setvalidasi_posisi(true);}else{setvalidasi_posisi(false);}
    if (temu.length<3) {setvalidasi_temu(true);}else{setvalidasi_temu(false);}

    if(tujuan.length>=3 && posisi.length>=3 && temu.length>=3){
        handleSubmit();
    }
    };

    const handleSubmit = async () => {
        //e.preventDefault();
        const formData = new FormData();
        sweetsuccess();
        formData.append("tujuan", tujuan); // pastikan file diset dengan setFile()
        formData.append("posisi", posisi);
        formData.append("temu", temu);
        formData.append("feedback", feedback);

        try {
            await api_url_satuadmin.post( 'api/open-item/satupeta_feedback', formData);

            setShow(false);
            sweetsuccess();
        } catch (error) {
            sweeterror(error.response?.data?.msg || "Gagal menambah data");
        }
         handleClose();
    };

    function sweetsuccess(){
        Swal.fire({
            title: "Sukses",
            html: "Feedback Berhasil Dikirim",
            timer: 2000,
            icon: "success",
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading();
              
            },
            willClose: () => {
                navigate(0);
            }
          }).then((result) => {
        });
    };
    function sweeterror(error){
        Swal.fire({
            title: "Gagal",
            html: error,
            timer: 1500,
            icon: "error",
            timerProgressBar: true,
            didOpen: () => {
            Swal.showLoading();
            
            },
            willClose: () => {
            }
        }).then((result) => {
        });
    };

  return (
    <>
      {/* FAB Rotated */}
      <div className="shadow rotated-text-feedback textsize8 d-flex py-3" title="Kirim Feedback" onClick={handleShow}>
        <div className="icon-wrapper"><FcFeedback size={20} /></div>
        <p className="text-wrapper textsize12">Feedback</p>
      </div>

      {/* Modal */}
      <Modal show={show} onHide={handleClose} size="lg" centered>
        
        <Modal.Header closeButton>
            <div className="d-flex justify-content-center">
                <img 
                    src={image2} 
                    className='img-header'
                    style={{ width: "auto", height: "35px" }}  
                />
                
            </div>
          
          <Modal.Title className="text-red">Feedback</Modal.Title>

        </Modal.Header>
        <Form onSubmit={handleSubmit} className="px-2">
            <p className="text-center textsize12">Bantu kami meningkatkan layanan dengan feedback Anda.</p>
            <Modal.Body>
                <Form.Group controlId="formPurpose" className="mt-3">
                    <Form.Label className="font_weight600 textsize12">Tujuan mengunjungi situs Satu Peta? <span className="text-red">*</span></Form.Label>
                    <Form.Control
                        list="tujuanOptions"
                        className="bg-input textsize12"
                        value={tujuan}
                        onChange={(e) => setTujuan(e.target.value)}
                        placeholder="Contoh: Mencari data untuk riset..."
                        required
                    />
                    <datalist id="tujuanOptions">
                        <option value="Mencari data untuk riset" />
                        <option value="Mengambil data publik" />
                        <option value="Mengakses visualisasi data" />
                        <option value="Memantau kinerja pemerintah" />
                        <option value="Menulis artikel atau berita" />
                    </datalist>
                    {validasi_tujuan && <p className="transisi mb-0 textsize8 text-red d-flex italicku"><MdErrorOutline  className="mt-1 mx-2" />Pertanyaan belum dijawab.</p>}
                </Form.Group>
                <Form.Group controlId="formPurpose" className="mt-3">
                    <Form.Label className="font_weight600 textsize12">Posisi Anda sebagai apa? <span className="text-red">*</span></Form.Label>
                    <Form.Control
                        list="posisiOptions"
                        className="bg-input textsize12"
                        value={posisi}
                        onChange={(e) => setPosisi(e.target.value)}
                        placeholder="Contoh: Peneliti/Akademisi..."
                        required
                    />
                    <datalist id="posisiOptions">
                        <option value="Peneliti/Akademisi" />
                        <option value="Pemerintahan" />
                        <option value="Media" />
                        <option value="Industri/Bisnis" />
                        <option value="Organisasi non Profit / Sosial" />
                    </datalist>
                    {validasi_posisi && <p className="transisi mb-0 textsize8 text-red d-flex italicku"><MdErrorOutline  className="mt-1 mx-2" />Pertanyaan belum dijawab.</p>}
                </Form.Group>
                <Form.Group controlId="formPurpose" className="mt-3">
                    <Form.Label className="font_weight600 textsize12">Apakah Anda menemukan data yang dicari? <span className="text-red">*</span></Form.Label>
                    <Form.Control
                        list="temuOptions"
                        className="bg-input textsize12"
                        value={temu}
                        onChange={(e) => setTemu(e.target.value)}
                        placeholder="Contoh: Peneliti/Akademisi..."
                        required
                    />
                    <datalist id="temuOptions">
                        <option value="Iya" />
                        <option value="Tidak" />
                        <option value="Sebagian" />
                    </datalist>
                    {validasi_temu && <p className="transisi mb-0 textsize8 text-red d-flex italicku"><MdErrorOutline  className="mt-1 mx-2" />Pertanyaan belum dijawab.</p>}
                </Form.Group>
                <Form.Group controlId="formFeedbackText" className="mt-3">
                    <Form.Label className="font_weight600 textsize12">Berikan saran dan masukan Anda untuk Satu Peta agar kami dapat memberikan layanan lebih baik lagi</Form.Label>
                    <Form.Control
                        as="textarea"
                        className="bg-input textsize12"
                        rows={4}
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        required
                    />
                </Form.Group>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                Batal
                </Button>
                <Button variant="primary" type="button" onClick={handle_step}>
                Kirim
                </Button>
            </Modal.Footer>
            </Form>

      </Modal>
    </>
  );
};

export default FeedbackModal;
