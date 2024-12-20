import React from 'react'
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signup } from '../store/slice/authSlice';
import { ErrorAlert, SuccessAlert } from '../utils/Common';


const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required('Please enter name'),
        email: Yup.string()
            .email('Please write proper email address')
            .required('Please enter your email'),
        password: Yup.string()
            .required('Please enter your password'),
        about_me: Yup.string()
            .required('Please enter about me'),
    });

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
    });
    const onSubmit = async (data) => {
        try {
            const params = {
                name: data.name,
                email: data.email,
                password: data.password,
                about_me: data.about_me,
            }

            dispatch(
                signup(params)
            ).then((res) => {
                if (res.payload?.code === 1) {

                    // Show success alert
                    SuccessAlert(res.payload.message);

                    navigate("/");
                } else if (res.payload?.code === 0) {
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
                                <h2 className='text-center pb-5'>Register</h2>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="form-group py-2">
                                        <label htmlFor="name">Full Name</label>
                                        <input type="text" className="form-control" id="name" placeholder="Enter name" {...register('name')} />
                                        <span className="validation_error">{errors.name?.message}</span>
                                    </div>
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
                                    <div className="form-group py-2">
                                        <label htmlFor="about_me">About Me</label>
                                        <textarea className="form-control" name="about_me" id="about_me" rows="3" placeholder="Enter about yourself" {...register('about_me')}></textarea>
                                        <span className="validation_error">{errors.about_me?.message}</span>
                                    </div>
                                    <div className='pt-4 d-flex justify-content-center gap-2'>
                                        <button type="submit" className="btn btn-primary">Sign Up</button>
                                        <Link to={'/'} className="btn btn-secondary">Back to Login</Link>
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

export default Register
