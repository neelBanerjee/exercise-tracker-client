import React from "react";
import { useState, useEffect } from "react";
import http from '@/http';
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import '@/assets/css/style.css';
import defaultProfilePic from '../../assets/images/avatar7.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressBook, faEdit, faEnvelopeOpen, faEye, faPhone, faPlusCircle, faTrash, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export function UserExercise(args) {
    const userAuthToken = localStorage.getItem("jwtAuthToken");
    const userid = localStorage.getItem("userid");
    //console.log(userAuthToken);

    const navigate = useNavigate();
    const [user, setUser] = useState([]);
    const [profilePicUrl, setprofilePicUrl] = useState(defaultProfilePic);
    const [exercises, setExercise] = useState([]);
    const [exercise, setExerciseData] = useState({
        logid: '',
        exerciseid: '',
        duration: 0,
        description: '',
    });

    const [date, setDate] = useState(new Date());

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUserDetails();
        fetchUserExercises();
    }, []);

    const formatDateToUTC = (dateIso) => {
        let b = dateIso.split(/\D+/);
        return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
    };

    const fetchUserExercises = async () => {

        const headers = {
            "Content-Type": "application/json",
            authorization: `Bearer ${userAuthToken}`,
        };

        try {
            setLoading(true);
            const { data: res } = await http.get('/api/userexerciselog/' + userid, { headers });
            //console.log(res);
            setExercise(res.exercises);
        } catch (err) {
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

    const fetchUserDetails = async () => {

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

    const viewExerciseDetails = async (logId) => {

        const headers = {
            "Content-Type": "application/json",
            authorization: `Bearer ${userAuthToken}`,
        };

        try {
            const { data: res } = await http.get('/api/userexerciselog/fetchsinglelog/' + logId, { headers });

            const exerciseDetails = res.exercise[0];
            //console.log(exerciseDetails);

            setExerciseData({
                logid: exerciseDetails._id,
                user: exerciseDetails.user[0].fullname,
                exercise: exerciseDetails.exercise[0].exercise,
                duration: exerciseDetails.duration,
                description: exerciseDetails.description,
            });

            //Setting Date to State
            const exerciseDate = formatDateToUTC(exerciseDetails.date).toLocaleDateString('en-GB');
            setDate(exerciseDate);

            //Open Exercise Details Modal
            setModal(true);
        } catch (error) {
            //console.error(err);
            Swal.fire({ title: 'Error', text: "Please login to access this page", icon: 'error' }).then(res => {
                navigate('/login');
            })
        }
    }

    const deleteExerciseLog = async (logId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    setLoading(true);
                    const headers = {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${userAuthToken}`,
                    };

                    const { data: res } = await http.delete('/api/userexerciselog/delete/' + logId, { headers });
                    //console.log(res);
                    
                    setTimeout(() => {
                        Swal.fire({ title: 'Success', text: res.message, icon: 'success' }).then(res => {
                            fetchUserExercises();
                        })
                    },500);    
                } catch (error) {
                    Swal.fire({ title: 'Error', text: error.response.data.message, icon: 'error' }).then(res => {
                        return false;
                    })
                } finally{
                    setTimeout(() => {
                        setLoading(false);
                    }, 500);
                }

                // http.delete('/users/' + id).then(res => {
                //     Swal.fire({ title: 'Success', text: res.data, icon: 'success' }).then(res => {
                //         fetchAllUsers();
                //     })
                // })
            }
        })
    };

    const ExerciseDetailsModal = () => {
        return (
            <Modal isOpen={modal} toggle={toggle} {...args}>
                <ModalHeader toggle={toggle}>Exercise Log Details</ModalHeader>
                <ModalBody>
                    <div className="row border-bottom pb-3 mb-3">
                        <div className="col-lg-12 col-md-12 col-sm-12">
                            <label><strong>User:</strong> {exercise.user || ''}</label>
                        </div>
                    </div>

                    <div className="row border-bottom pb-3 mb-3">
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <label><strong>Date:</strong> {date || ''}</label>
                        </div>

                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <label><strong>Duration:</strong> {exercise.duration || ''} Minutes</label>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-sm-12">
                            <label><strong>Description:</strong></label>
                            <p className="mt-2">{exercise.description || ''}</p>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Link to={"/edit-exercise-log/" + exercise.logid}>
                        <Button color="primary" onClick={toggle}><FontAwesomeIcon icon={faEdit} /> Edit this Log</Button>
                    </Link>
                    <Button color="danger" onClick={toggle}>
                        Close
                    </Button>
                </ModalFooter>
            </Modal>
        );
    };

    return (
        <div className="row gutters mx-5 my-5">
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
                                    {/* <div className="text-muted">
                                        <span className="user-info ml-2 pr-2"><FontAwesomeIcon icon={faAddressBook} style={{ "color": "#aa15db" }} /></span>
                                        <span style={{ "paddingLeft": "5px" }}>{user.address || ''}</span>
                                    </div> */}
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
                {/* <div className="card mb-3">
                    <div className="card-header d-flex justify-content-between">
                        <span>About Yourself</span>
                        <Link to={"/dashboard"}><FontAwesomeIcon icon={faUsers} /> View Other Users</Link>
                    </div>
                    <div className="card-body">
                        <p className="card-text">{user.about || ''}</p>
                    </div>
                </div> */}
                <div className="card">
                    <div className="card-header d-flex justify-content-between">
                        <span>Your Exercise</span>
                        <Link to={"/create-exercise-log"}><FontAwesomeIcon icon={faPlusCircle} /> Add Exercise Log</Link>
                    </div>
                    <div className="card-body">
                        <div className="overlayer" style={{ 'display': (loading ? 'block' : 'none') }}>
                            <div className="spinner"></div>
                        </div>
                        <table className="table table-bordered">
                            <thead>
                                <tr className="text-center">
                                    <th scope="col">#</th>
                                    <th scope="col">Exercise</th>
                                    <th scope="col">Duration</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(exercises && exercises.length > 0) ?
                                    exercises.map((exercise, index) => (
                                        <tr key={exercise._id}>
                                            <td className="text-center">{index + 1}</td>
                                            <td className="text-center">{exercise.exercise[0].exercise}</td>
                                            <td className="text-center">{exercise.duration} Minutes</td>
                                            <td className="text-center" style={{ "width": "30%" }}>
                                                {exercise.description.substr(0, 20)}
                                                <Link onClick={() => { viewExerciseDetails(exercise._id) }}>...Read More</Link>
                                            </td>
                                            <td className="text-center">{new Date(exercise.date).toLocaleDateString('en-GB')}</td>
                                            <td className="text-center">
                                                <button type="button" className="btn btn-success btn-sm" onClick={() => { viewExerciseDetails(exercise._id) }}>
                                                    <FontAwesomeIcon icon={faEye} /> View
                                                </button>
                                                <Link to={"/edit-exercise-log/" + exercise._id}>
                                                    <button type="button" className="btn btn-primary btn-sm mcl-5">
                                                        <FontAwesomeIcon icon={faEdit} /> Edit
                                                    </button>
                                                </Link>
                                                <button type="button" className="btn btn-danger btn-sm mcl-5" onClick={() => { deleteExerciseLog(exercise._id) }}>
                                                    <FontAwesomeIcon icon={faTrash} /> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={'4'} className="text-center">No exercise found!</td>
                                        </tr>
                                    )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <ExerciseDetailsModal />
        </div>
    );
}

export default UserExercise;