import { useState, useEffect } from "react";
import http from '@/http';
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import '@/assets/css/style.css';
import defaultProfilePic from '@/assets/images/avatar7.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faEnvelopeOpen, faPhone, faUser, faCamera } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { Button, Spinner } from 'reactstrap';

export function EditProfile() {
    const userAuthToken = localStorage.getItem("jwtAuthToken");
    const userid = localStorage.getItem("userid");
    //console.log(userid);

    const navigate = useNavigate();
    const initialUser = {
        fullname: "",
        username: "",
        email: "",
        phone: "",
        address: "",
        fbLink: "",
        twitterLink: "",
        instaLink: ""
    };
    const [user, setUsers] = useState(initialUser);

    const [isFirstRender, setIsFirstRender] = useState(true);

    const [profilePic, setProfilePic] = useState(null);
    const [currentProfilePic, setcurrentProfilePic] = useState(null);
    const [profilePicUrl, setprofilePicUrl] = useState(defaultProfilePic);

    const [isfileChanged, setFileChanged] = useState(false);

    const [selectedFiles, setSelectedFiles] = useState([]);

    const [loading, setLoading] = useState(false);

    const [btnDisabled, setbtnDisable] = useState(false);

    useEffect(() => {
        fetchUserDetails();
    }, []);

    useEffect(() => {
        if (!isFirstRender) {
            // Perform logic when profilePic state is updated
            if (isfileChanged) {
                uploadProfilePic();
            }
        } else {
            setIsFirstRender(false);
        }
    }, [profilePic]);

    // useEffect(() => {
    //     handleUploadFiles();
    // }, [selectedFiles]);

    const form = document.getElementById("editProfileForm");

    const handleChange = ({ currentTarget: input }) => {
        setUsers({ ...user, [input.name]: input.value });
    };

    const fetchUserDetails = async (res) => {

        const headers = {
            "Content-Type": "application/json",
            authorization: `Bearer ${userAuthToken}`,
        };

        try {
            setLoading(true);
            const { data: res } = await http.get('/api/users/' + userid, { headers });
            //console.log(res);
            const userData = res.user;

            setUsers({
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
            setcurrentProfilePic(res.currentProfilePic);
            setprofilePicUrl(userData.profilePic);
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

    const updateProfileHnadler = async (e) => {
        e.preventDefault();

        const headers = {
            "Content-Type": "application/json",
            authorization: `Bearer ${userAuthToken}`,
        };

        try {
            setLoading(true);
            setbtnDisable(true);
            let formData = new FormData(form);
            const { data: res } = await http.put('api/users/update', formData, { headers });
            //console.log(res);
            setTimeout(() => {
                Swal.fire({ title: 'Success', text: res.message, icon: 'success' }).then(res => {
                    fetchUserDetails();
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

    const handleProfilePicSelect = (event) => {
        if (event.target.files) {
            setFileChanged(true);
            setProfilePic(event.target.files[0]);
        } else {
            return false;
        }
    };

    const uploadProfilePic = async () => {

        if (profilePic == null)
            return;

        try {
            const headers = {
                authorization: `Bearer ${userAuthToken}`,
                'Content-Type': 'multipart/form-data'
            };

            const formData = new FormData()
            formData.append("profilePic", profilePic);
            formData.append("currentProfilePic", currentProfilePic);
            formData.append("userId", userid);

            const { data: response } = await http.put('api/users/updateprofilepic', formData, { headers })
            Swal.fire({ title: 'Success', text: response.message, icon: 'success' }).then(res => {
                setFileChanged(false);
                //console.log(response);
                setcurrentProfilePic(response.currentProfilePic);
                setprofilePicUrl(response.profilePic);
            })
        } catch (error) {
            Swal.fire({ title: 'Error', text: error.response.data.message, icon: 'error' }).then(res => {
                return false;
            })
        }
    };

    const handleFileSelect = (event) => {
        console.log(profilePic);
        const filesArray = Array.from(event.target.files);
        setSelectedFiles(filesArray);
    };

    const handleUploadFiles = async () => {

        try {
            const headers = {
                authorization: `Bearer ${userAuthToken}`,
                'Content-Type': 'multipart/form-data'
            };

            const formData = new FormData();

            selectedFiles.forEach((file) => {
                // Handle each file, e.g., send it to the server using Fetch or Axios
                formData.append('images', file);
            });

            const { data: res } = await http.put('api/users/uploadmultiplefiles', formData, { headers })
            //console.log(res);
            Swal.fire({ title: 'Success', text: res.message, icon: 'success' }).then(res => {
                setProfilePic(res.imgUrl);
            })
        } catch (error) {
            // Swal.fire({ title: 'Error', text: error.response.data.message, icon: 'error' }).then(res => {
            //     return false;
            // })
        }
    };

    const resetFilesInput = (e) => {
        e.preventDefault();

        document.getElementById('files').value = null;

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
                                        <div className="camera_bg_cr">
                                            <FontAwesomeIcon icon={faCamera} />
                                        </div>
                                        <div className="uplk">
                                            <input type="file" name="update-img" onChange={handleProfilePicSelect} />
                                        </div>
                                        <img src={profilePicUrl || ''} id="profilePicSrc" alt="Maxwell Admin" />

                                    </div>
                                    <h5 className="user-name">{user.fullname || ''}</h5>
                                    {/* <div className="text-muted">
                                        <span className="user-info ml-2 pr-2"><FontAwesomeIcon icon={faUser} style={{ "color": "#aa15db" }} /></span>
                                        <span style={{ "paddingLeft": "5px" }}>{user.username || ''}</span>
                                    </div> */}
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
                    <div className="card mb-3">
                        <div className="card-header">
                            About Yourself
                        </div>
                        <div className="card-body">
                            <p className="card-text">{user.about || ''}</p>
                            <div className="edit-profile-btn">
                                <Link to={"/"} className="btn btn-primary"><FontAwesomeIcon icon={faUsers} /> View Other Users</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12">
                {/* <div className="card mb-3">
                    <div className="card-header d-flex justify-content-between">
                        <span>Upload Multiple Images</span>
                        <Link to={"/dashboard"}><FontAwesomeIcon icon={faUsers} /> View Other Users</Link>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-12">
                                <input type="file" id="files" name="files[]" className="form-control" onChange={handleFileSelect} multiple />
                                <button className="btn btn-danger btn-sm mt-2" onClick={resetFilesInput}>Reset File Input</button>
                                <button className="btn btn-primary btn-sm mt-2" onClick={handleUploadFiles} style={{ marginLeft: "5px" }}>Upload</button>
                            </div>
                        </div>
                    </div>
                </div> */}
                <div className="sticky-sidebar">
                    <div className="card">
                        <div className="card-body">
                            <div className="overlayer" style={{ 'display': (loading ? 'block' : 'none') }}>
                                <div className="spinner"></div>
                            </div>
                            <form id="editProfileForm" onSubmit={updateProfileHnadler}>
                                <input type="hidden" name="userid" value={user.id || ''} />
                                <div className="row gutters">
                                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                        <h6 className="mb-2 text-primary">Personal Details</h6>
                                    </div>
                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                        <div className="form-group">
                                            <label htmlFor="fullName">Full Name</label>
                                            <input type="text" className="form-control" id="fullName" name="fullname" placeholder="Enter full name" value={user.fullname || ''} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                        <div className="form-group">
                                            <label htmlFor="username">User Name</label>
                                            <input type="text" className="form-control" id="username" name="username" placeholder="Enter user name" value={user.username || ''} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mt-3">
                                        <div className="form-group">
                                            <label htmlFor="email">Email</label>
                                            <input type="email" className="form-control" id="email" name="email" placeholder="Enter email ID" value={user.email || ''} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mt-3">
                                        <div className="form-group">
                                            <label htmlFor="phone">Phone</label>
                                            <input type="text" className="form-control" id="phone" name="phone" placeholder="Enter phone number" value={user.phone || ''} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 mt-3">
                                        <div className="form-group">
                                            <label htmlFor="address">Address</label>
                                            <input type="text" className="form-control" id="address" name="address" placeholder="Enter your address" value={user.address || ''} onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row gutters">
                                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 mt-3">
                                        <h6 className="mt-3 mb-2 text-primary">Social Media Settings</h6>
                                    </div>
                                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                        <div className="form-group">
                                            <label htmlFor="fbLink">Facebook Link</label>
                                            <input type="url" className="form-control" id="fbLink" name="fbLink" placeholder="Enter Your Facebook URL" value={user.fbLink || ''} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 mt-3">
                                        <div className="form-group">
                                            <label htmlFor="twitterLink">Twitter Link</label>
                                            <input type="url" className="form-control" id="twitterLink" name="twitterLink" placeholder="Enter Your Twitter URL" value={user.twitterLink || ''} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 mt-3">
                                        <div className="form-group">
                                            <label htmlFor="instaLink">Instagram Link</label>
                                            <input type="url" className="form-control" id="instaLink" name="instaLink" placeholder="Enter Your Instagram URL" value={user.instaLink || ''} onChange={handleChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row gutters">
                                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 mt-3">
                                        <h6 className="mt-3 mb-2 text-primary">About Yourself</h6>
                                    </div>
                                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                        <div className="form-group">
                                            <label htmlFor="about">About Yourself</label>
                                            <textarea className="form-control" name="about" id="about" placeholder="About Yourself" rows="5" defaultValue={user.about || ''} onChange={handleChange}></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="row gutters">
                                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 mt-3">
                                        <div className="d-flex justify-content-between">
                                            <button type="button" id="cancel" className="btn btn-secondary">Cancel</button>
                                            {/* <button type="submit" id="submit" name="submit" className="btn btn-success">Update</button> */}
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
    );
}

export default EditProfile;