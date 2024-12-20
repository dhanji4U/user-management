import React from 'react'
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../store/slice/authSlice';
import { useDispatch } from 'react-redux';
import { addLoginData, ErrorAlert, SuccessAlert } from '../utils/Common';


const Login = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Please write proper email address')
            .required('Please enter your email'),
        password: Yup.string()
            .required('Please enter your password')
    });

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
    });
    const onSubmit = async (data) => {
        try {
            const params = {
                email: data.email,
                password: data.password,
            }

            dispatch(
                login(params)
            ).then((res) => {
                if (res.payload?.code === 1) {

                    // Show success alert
                    SuccessAlert(res.payload.message);
                    
                    // Store login data
                    addLoginData(res.payload.data);
   
                    navigate("/profile");
                } else if (res.payload?.code === 2 || res.payload?.code === 0) {
                    ErrorAlert(res.payload.message);
                } else {
                    console.error('Payload got undefined');
                }
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <div className='authentication'>
                <div className="container">
                    <div className="row justify-content-center align-items-center">
                        <div className='col-md-6'>
                            <div className="card p-4">
                                <h2 className='text-center pb-5'>Login</h2>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="form-group py-2">
                                        <label htmlFor="email">Email</label>
                                        <input type="email" className="form-control" id="email" placeholder="Enter email" {...register('email')} />
                                        <span className="validation_error">{errors.email?.message}</span>
                                    </div>
                                    <div className="form-group py-2">
                                        <label htmlFor="password">Password</label>
                                        <input type="password" className="form-control" id="password" placeholder="Enter password" {...register('password')} />
                                        <span className="validation_error">{errors.password?.message}</span>
                                    </div>
                                    <div className='pt-4 d-flex justify-content-center gap-2'>
                                        <button type="submit" className="btn btn-primary">Login</button>
                                        <Link to={'/register'} className="btn btn-success">Register</Link>
                                    </div>
                                </form >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login
