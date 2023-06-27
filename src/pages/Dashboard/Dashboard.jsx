import { useState, useEffect } from "react";
import http from '@/http';
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import '@/assets/css/style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelopeOpen, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons';

export function Dashboard() {
    const userAuthToken = localStorage.getItem("jwtAuthToken");
    //console.log(userAuthToken);

    const navigate = useNavigate();
    const [users, setUsers] = useState([]);

    const userid = localStorage.getItem("userid");

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const fetchAllUsers = async () => {

        const headers = {
            "Content-Type": "application/json",
            authorization: `Bearer ${userAuthToken}`,
        };

        try {
            setLoading(true);
            const { data: res } = await http.get('/api/users/', { headers });
            //console.log(res);
            setUsers(res.users);
        } catch (err) {
            console.error(err);
            Swal.fire({ title: 'Error', text: "Please login to access this page", icon: 'error' }).then(res => {
                navigate('/login');
            })
        } finally{
            setTimeout(() => {
                setLoading(false);
            }, 500);
        }
    }

    return (
        <div className="row mx-5 my-5">
            <div className="overlayer" style={{ 'display': (loading ? 'block' : 'none') }}>
                <div className="spinner"></div>
            </div>
            {users && users.map((user, index) => {
                if (user._id != userid) {

                    return <div className="col-lg-4 col-md-4" key={user._id}>
                        <div className="user-card">
                            <img src={user.profilePic} className="user-card-img-top" alt="..." />
                            <div className="user-card-body">
                                <h5 className="user-card-title">{user.fullname}</h5>
                                <div className="text-muted">
                                    <span className="user-info ml-2 pr-2"><FontAwesomeIcon icon={faEnvelopeOpen} style={{ "color": "#aa15db" }} /></span>
                                    <span style={{ "paddingLeft": "5px" }}><Link to={"mailto:{user.email}"} style={{ "textDecoration": "none" }}>{user.email}</Link></span>
                                </div>
                                <div className="text-muted">
                                    <span className="user-info ml-2 pr-2"><FontAwesomeIcon icon={faPhone} style={{ "color": "#aa15db" }} /></span>
                                    <span style={{ "paddingLeft": "5px" }}><Link to={"tel:{user.phone}"} style={{ "textDecoration": "none" }}>{user.phone}</Link></span>
                                </div>
                                <div className="my-3">
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
                                <Link to={"/view-user-exercise/"+ user._id} className="btn btn-primary know-more">Know More</Link>
                            </div>
                        </div>
                    </div>
                }
            })}
        </div>
    );
}

export default Dashboard;