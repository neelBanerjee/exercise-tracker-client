import { useState } from "react";
//import http from '../http';
import axios from "axios";
import { Link,useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import styles from "./styles.module.css";

export function Signup() {
    const [data, setData] = useState({
		fullname: "",
		username: "",
		email: "",
        phone: "",
		password: "",
	});
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = "http://localhost:8080/api/register";
			const { data: res } = await axios.post(url, data);
            console.log(res.message);
            Swal.fire({ title: 'Success', text: res.message,icon: 'success'}).then(res=>{
				navigate('/login');
			}) 
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
			}
		}
	};

    return (
        <div className={styles.signup_container}>
            <div className={styles.signup_form_container}>
                <div className={styles.left}>
                    <h1>Welcome Back</h1>
                    <Link to="/login">
                        <button type="button" className={styles.white_btn}>
                            Sing in
                        </button>
                    </Link>
                </div>
                <div className={styles.right}>
                    <form className={styles.form_container} onSubmit={handleSubmit}>
                        <h1>Create Account</h1>
                        <input
                            type="text"
                            placeholder="Full Name"
                            name="fullname"
                            onChange={handleChange}
                            value={data.fullname}
                            required
                            className={styles.input}
                        />
                        <input
                            type="text"
                            placeholder="User Name"
                            name="username"
                            onChange={handleChange}
                            value={data.username}
                            required
                            className={styles.input}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            onChange={handleChange}
                            value={data.email}
                            required
                            className={styles.input}
                        />
                        <input
                            type="text"
                            placeholder="Phone"
                            name="phone"
                            onChange={handleChange}
                            value={data.phone}
                            required
                            className={styles.input}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            onChange={handleChange}
                            value={data.password}
                            required
                            className={styles.input}
                        />
                        {error && <div className={styles.error_msg}>{error}</div>}
                        <button type="submit" className={styles.green_btn}>
                            Sign Up
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Signup;