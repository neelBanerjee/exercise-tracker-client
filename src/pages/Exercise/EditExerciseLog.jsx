import { useState, useEffect } from "react";
import http from '@/http';
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from 'sweetalert2';
import '@/assets/css/style.css';
import defaultProfilePic from '@/assets/images/avatar7.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faEnvelopeOpen, faPhone, faUser, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Button, Spinner, Alert, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export function EditExerciseLog() {
    const userAuthToken = localStorage.getItem("jwtAuthToken");
    const userid = localStorage.getItem("userid");
    //console.log(userid);  

    const { id: _exerciseid } = useParams();

    const navigate = useNavigate();
    const [user, setUser] = useState([]);
    const [profilePicUrl, setprofilePicUrl] = useState(defaultProfilePic);
    const [exercises, setExercise] = useState([]);
    const [newExercise, setnewExercise] = useState('');
    const [exercise, setExerciseData] = useState({
        _id: _exerciseid,
        userid: userid,
        exerciseid: '',
        duration: 0,
        description: '',
    });

    const [date, setDate] = useState(new Date());

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    const [loading, setLoading] = useState(false);
    const [btnDisabled, setbtnDisable] = useState(false);

    useEffect(() => {
        fetchUserDetails();
        fetchAllExercises();
        fetchExerciseDetails();
        document.getElementById('exerciseDate').value = date;
    }, []);

    const formExerciseLog = document.getElementById("editExerciseForm");
    const formNewExercise = document.getElementById("addNewExerciseForm");

    const handleChange = ({ currentTarget: input }) => {
        setExerciseData({ ...exercise, [input.name]: input.value });
        //console.log(exercise);
    };

    const formatDateToUTC = (dateIso) => {
        let b = dateIso.split(/\D+/);
        return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
    };

    const onChangeDate = (date) => {
        //const formattedDate = new Date(date).toLocaleDateString('en-GB');
        setDate(date);
        document.getElementById('exerciseDate').value = date;
        //console.log(formattedDate);
    };

    const showAddExerciseForm = (e) => {
        //Open Creaet Exercise Modal
        setModal(true);
    };

    const handleExerciseInputChange = (e) => {
        setnewExercise(e.target.value);
    };

    const fetchUserDetails = async (res) => {

        const headers = {
            "Content-Type": "application/json",
            authorization: `Bearer ${userAuthToken}`,
        };

        try {
            const { data: res } = await http.get('/api/users/' + userid, { headers });
            //console.log(res);
            const userData = res.user;

            setUser({
                id: userData._id,
                fullname: userData.fullname,
                username: userData.username,
                email: userData.email,
                phone: userData.phone,
                address: userData.address,
                fbLink: userData.social != null ? userData.social.facebook : '',
                twitterLink: userData.social != null ? userData.social.twitter : '',
                instaLink: userData.social != null ? userData.social.instagram : '',
                about: userData.about
            });
            setprofilePicUrl(userData.profilePic);
        } catch (error) {
            //console.error(err);
            Swal.fire({ title: 'Error', text: "Please login to access this page", icon: 'error' }).then(res => {
                navigate('/login');
            })
        }
    }

    const fetchExerciseDetails = async (res) => {

        const headers = {
            "Content-Type": "application/json",
            authorization: `Bearer ${userAuthToken}`,
        };

        try {
            setLoading(true);
            const { data: res } = await http.get('/api/userexerciselog/logdetails/' + _exerciseid, { headers });
            //console.log(res);
            const exerciseDetails = res.exercise;

            setExerciseData({
                _id: exerciseDetails._id,
                userid: exerciseDetails.userid,
                exerciseid: exerciseDetails.exerciseid,
                duration: exerciseDetails.duration,
                description: exerciseDetails.description,
            });

            const exerciseDate = formatDateToUTC(exerciseDetails.date);

            setDate(exerciseDate);
            document.getElementById('exerciseDate').value = exerciseDate;
        } catch (error) {
            //console.error(err);
            Swal.fire({ title: 'Error', text: "Please login to access this page", icon: 'error' }).then(res => {
                navigate('/login');
            })
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 500);
        }
    }

    const fetchAllExercises = async () => {

        const headers = {
            "Content-Type": "application/json",
            authorization: `Bearer ${userAuthToken}`,
        };

        try {
            const { data: res } = await http.get('/api/exercises', { headers });
            //console.log(res);
            setExercise(res.exercises);
        } catch (err) {
            //console.error(err);
            Swal.fire({ title: 'Error', text: "Please login to access this page", icon: 'error' }).then(res => {
                navigate('/login');
            })
        }
    }

    const addNewExerciseHandler = async (e) => {
        e.preventDefault();

        const userAuthToken = localStorage.getItem("jwtAuthToken");

        const headers = {
            "Content-Type": "application/json",
            authorization: `Bearer ${userAuthToken}`,
        };

        try {
            setLoading(true);
            setbtnDisable(true);
            //console.log(newExercise);return false; 
            let formData = new FormData(formNewExercise);
            const { data: res } = await http.post('api/exercises/add', formData, { headers });
            //console.log(res);
            setTimeout(() => {
                Swal.fire({ title: 'Success', text: res.message, icon: 'success' }).then(res => {
                    setModal(false);
                    fetchAllExercises();
                })
            }, 500);
        } catch (error) {
            Swal.fire({ title: 'Error', text: error.response.data.message, icon: 'error' }).then(res => {
                return false;
            })
        } finally {
            setTimeout(() => {
                setLoading(false);
                setbtnDisable(false);
            }, 500);
        }
    };

    const updateExerciseHandler = async (e, req, res) => {
        e.preventDefault();

        const userAuthToken = localStorage.getItem("jwtAuthToken");

        const headers = {
            "Content-Type": "application/json",
            authorization: `Bearer ${userAuthToken}`,
        };

        try {
            setLoading(true);
            setbtnDisable(true);
            exercise.date = date;
            //console.log(exercise);return false; 
            let formData = new FormData(formExerciseLog);
            const { data: res } = await http.post('api/userexerciselog/update', formData, { headers });
            //console.log(res);
            setTimeout(() => {
                Swal.fire({ title: 'Success', text: res.message, icon: 'success' }).then(res => {
                    navigate('/manage-exercise');
                })
            }, 500);
        } catch (error) {
            Swal.fire({ title: 'Error', text: error.response.data.message, icon: 'error' }).then(res => {
                return false;
            })
        } finally {
            setTimeout(() => {
                setLoading(false);
                setbtnDisable(false);
            }, 500);
        }
    };

    return (
        <>
            <div className="row gutters mx-5 my-5">
                <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader toggle={toggle}>Create New Exercise</ModalHeader>
                    <form id="addNewExerciseForm" onSubmit={addNewExerciseHandler}>
                        <ModalBody>
                            <div className="overlayer" style={{ 'display': (loading ? 'block' : 'none') }}>
                                <div className="spinner"></div>
                            </div>
                            <div className="row">
                                <div className="col-lg-12 col-md-12 col-sm-12">
                                    <label><strong>Exercise Name:</strong></label>
                                    <input type="text" className="form-control" name="exercise" value={newExercise} onChange={handleExerciseInputChange} />
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button type="submit" color="primary" disabled={btnDisabled}>
                                {btnDisabled ? (<><Spinner size="sm"></Spinner><span>{' '}Saving</span></>) :
                                    (<><FontAwesomeIcon icon={faSave} /> Create Exercise</>)}
                            </Button>
                            <Button color="danger" onClick={toggle}>
                                Close
                            </Button>
                        </ModalFooter>
                    </form>
                </Modal>
                <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
                    <div className="sticky-sidebar">
                        <div className="card">
                            <div className="card-body">
                                <div className="account-settings">
                                    <div className="user-profile">
                                        <div className="user-avatar">
                                            <img src={profilePicUrl || ''} alt="Maxwell Admin" />
                                        </div>
                                        <h5 className="user-name">{user.fullname || ''}</h5>
                                        <div className="text-muted">
                                            <span className="user-info ml-2 pr-2"><FontAwesomeIcon icon={faUser} style={{ "color": "#aa15db" }} /></span>
                                            <span style={{ "paddingLeft": "5px" }}>{user.username || ''}</span>
                                        </div>
                                        <div className="text-muted">
                                            <span className="user-info ml-2 pr-2"><FontAwesomeIcon icon={faEnvelopeOpen} style={{ "color": "#aa15db" }} /></span>
                                            <span style={{ "paddingLeft": "5px" }}><Link to={"mailto:{user.email}"} style={{ "textDecoration": "none" }}>{user.email || ''}</Link></span>
                                        </div>
                                        <div className="text-muted">
                                            <span className="user-info ml-2 pr-2"><FontAwesomeIcon icon={faPhone} style={{ "color": "#aa15db" }} /></span>
                                            <span style={{ "paddingLeft": "5px" }}><Link to={"tel:{user.phone}"} style={{ "textDecoration": "none" }}>{user.phone || ''}</Link></span>
                                        </div>

                                        <div className="mt-3">
                                            <button type="button" className="btn btn-outline-primary btn-floating">
                                                <FontAwesomeIcon icon={faFacebook} />
                                            </button>
                                            <button type="button" className="btn btn-outline-primary btn-floating pl-2">
                                                <FontAwesomeIcon icon={faTwitter} />
                                            </button>
                                            <button type="button" className="btn btn-outline-primary btn-floating pl-2">
                                                <FontAwesomeIcon icon={faInstagram} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12">
                    <Alert color="warning">
                        <div className="d-flex justify-content-between">
                            <strong>If you coudn't find your exercise then you can add your exercise by clicking the add button</strong>
                            <button className="btn btn-success btn-sm" onClick={showAddExerciseForm}>
                                <span style={{ "color": "#fff" }}>
                                    <FontAwesomeIcon icon={faPlusCircle}/> Add your exercise
                                </span>        
                            </button>
                        </div>    
                    </Alert>
                    <div className="sticky-sidebar">
                        <div className="card">
                            <div className="card-body">
                                <div className="overlayer" style={{ 'display': (loading ? 'block' : 'none') }}>
                                    <div className="spinner"></div>
                                </div>
                                <form id="editExerciseForm" onSubmit={updateExerciseHandler}>
                                    <input type="hidden" name="_exerciseid" value={_exerciseid || exercise.id} />
                                    <input type="hidden" name="userid" value={user.id || ''} />
                                    <div className="row gutters">
                                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                            <h6 className="mb-2 text-primary">Edit Exercise Log Details</h6>
                                        </div>
                                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                            <div className="form-group">
                                                <label htmlFor="fullName">Select Exercise</label>
                                                <select name="exerciseid" value={exercise.exerciseid || 0} className="form-control" onChange={handleChange}>
                                                    <option value={0} disabled>Please select an exercise from dropdown</option>
                                                    {(exercises && exercises.length > 0) ?
                                                        exercises.map((item, index) => (
                                                            <option value={item._id} key={index}>{item.exercise}</option>
                                                        )) : (
                                                            <option value={0} disabled>No exercise found</option>
                                                        )}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mt-3">
                                            <div className="form-group">
                                                <label htmlFor="username">Exercise Duration</label>
                                                <input type="text" className="form-control" id="duration" name="duration" placeholder="Enter exercise duration" value={exercise.duration
                                                    || ''} onChange={handleChange} />
                                            </div>
                                        </div>
                                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mt-3">
                                            <div className="form-group">
                                                <input type="hidden" name="date" id="exerciseDate" />
                                                <label htmlFor="email">Exercise Date</label>
                                                <div>
                                                    <DatePicker className="form-control"
                                                        selected={date}
                                                        peekNextMonth
                                                        showMonthDropdown
                                                        showYearDropdown
                                                        dropdownMode="select"
                                                        onChange={onChangeDate}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 mt-3">
                                            <div className="form-group">
                                                <label htmlFor="about">Exercise Description</label>
                                                <textarea className="form-control" name="description" id="description" placeholder="Exercise Description" rows="5" defaultValue={exercise.description || ''} onChange={handleChange}></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row gutters">
                                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 mt-3">
                                            <div className="d-flex justify-content-between">
                                                <Link to={'/manage-exercise'}><button type="button" id="cancel" className="btn btn-secondary">Cancel</button></Link>
                                                {/* <button type="submit" id="submit" name="submit" className="btn btn-success" disabled={btnDisabled}>Update</button> */}
                                                <Button color="success" disabled={btnDisabled}>
                                                    {btnDisabled ? (<><Spinner size="sm"></Spinner><span>{' '}Saving</span></>) : ('Update')}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EditExerciseLog;