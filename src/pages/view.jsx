import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import http from '../http';

export default function View(){
    const [inputs,setInputs] = useState({});

    const {id} = useParams();

    useEffect(()=>{
        fetchUser();
    },[]);

    const fetchUser= () =>{
        http.get('/users/'+id+'/edit').then((res)=>{
            console.log(res);
            setInputs({
                id: res.data.id,
                name:res.data.name,
                email:res.data.email,
            });
        });
    }
    
    return (
        <div className="row">
            <div className="col-lg-12 mx-auto" style={{width:'50%', paddingTop:'20px'}}>
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">User Details</h5>
                    </div>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">User Name :  {inputs.name || ''}</li>
                        <li className="list-group-item">User Name :  {inputs.email || ''}</li>
                    </ul>
                    <div className="card-body">
                        <Link className="card-link" to={{ pathname: "/edit/" + inputs.id }}>Edit This User</Link>&nbsp;
                        <Link className="card-link" to={{ pathname: "/" }}>View User List</Link>&nbsp;
                    </div>
                </div>
            </div>
        </div>        
    );
 }