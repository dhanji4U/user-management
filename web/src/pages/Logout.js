import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useDispatch } from "react-redux";
import { logout } from '../store/slice/authSlice';
import { ErrorAlert, removeLoginData, SuccessAlert } from '../utils/Common';

export default function Logout() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userId = sessionStorage.getItem("UserID");

    useEffect(() => {

        //For admin logout
        const userLogout = (request) => {

            try {

                dispatch(
                    logout(request)
                ).then((res) => {
                    if (res.payload?.code === 1) {

                        SuccessAlert(res.payload.message);
                        removeLoginData();
                        navigate("/");
                    } else if (res.payload?.code === 0) {
                        ErrorAlert(res.payload.message);
                    } else {
                        console.error('Payload got undefined');
                    }
                });
            } catch (error) {
                ErrorAlert(error);
                console.error('Error in logout:', error);
            }
        };

        userLogout({ user_id: userId });

    }, [navigate])
}