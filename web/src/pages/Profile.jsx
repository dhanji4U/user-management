import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom'
import { getUserData } from '../store/slice/authSlice';
import { ErrorAlert } from '../utils/Common';

const Profile = () => {
    const dispatch = useDispatch();
    const userId = sessionStorage.getItem("UserID");

    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {

        try {

            // For fetch admin Details API
            dispatch(
                getUserData({ user_id: userId })
            ).then((res) => {
                if (res.payload?.code === 1) {

                    setUserDetails(res.payload.data);
                } else if (res.payload?.code === 0) {
                    ErrorAlert(res.payload.message);
                } else {
                    console.error('Payload got undefined in getUserData');
                }
            });

        } catch (error) {
            ErrorAlert(error);
            console.error('Error in getUserData:', error)
        }
    }, []);

    return (
        <>
            <div className='authentication'>
                <div className="container">
                    <div className="row justify-content-center align-items-center">
                        <div className='col-md-9'>
                            <div className="card p-4">
                                <h2 className='text-center pb-5'>Welcome {userDetails?.name}</h2>

                                <div class="card-body">
                                    <h5 class="card-title">{userDetails?.email}</h5>
                                    <p class="card-text">{userDetails?.about_me}</p>
                                </div>

                                    <div className='pt-4 d-flex justify-content-center gap-2'>
                                        <Link to={'/edit-profile'} className="btn btn-success">Edit Profile</Link>
                                        <Link to={'/logout'} className="btn btn-danger">Logout</Link>
                                    </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile
