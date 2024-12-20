import axios from "axios";
import cryptojs from 'crypto-js';
import { useNavigate } from 'react-router-dom';
import * as Common from '../utils/Common.js';

const key = cryptojs.enc.Utf8.parse(process.env.REACT_APP_KEY);
const iv = cryptojs.enc.Utf8.parse(process.env.REACT_APP_IV);

const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
        'accept-language': 'en',
        'Content-Type': 'text/plain'
    }
});

// Body Encryption Request to API
axiosClient.interceptors.request.use(function (request) {

    request.data = bodyEncryption(request.data, true);

    if (sessionStorage.getItem("UserToken") !== undefined || sessionStorage.getItem("UserToken") !== null) {
        request.headers['token'] = bodyEncryption(sessionStorage.getItem("UserToken"), false)
    }
    console.log("Final Request", request.data);
    return request;
});

// Response interceptor
axiosClient.interceptors.response.use(

    function (response) {

        response = bodyDecryption(response.data);

        let respData = JSON.parse(response);

        // console.log(respData, "respData");

        if (respData.code === -1) {
            const navigate = useNavigate();
            navigate('/logout');
        } else if (respData.code === 0) {
            Common.ErrorAlert(respData.message);
            return respData;
        } else {
            return respData;
        }
    },

    function (error) {

        let res = error.response;

        // console.log("Decrypt Data else response", res);

        if (res !== undefined && res.status === 401) {
            console.log("---------------------- 401 ----------------------")
            const navigate = useNavigate();
            navigate('/');
        } else if (res !== undefined && res.status === 400) {
            const response = bodyDecryption(res.data);
            return response;
        } else {
            // console.error("Looks like there was a problem. Status Code: " + error);
            // return Promise.reject(error);
        }
    }
);

function bodyEncryption(request, isStringify) {
    console.log("Encryption Request", request)

    let new_request = (isStringify) ? JSON.stringify(request) : request;
    let encrypted = cryptojs.AES.encrypt(new_request, key, { iv: iv });

    return encrypted.toString();
}

function bodyDecryption(request) {
    let decrypted = cryptojs.AES.decrypt(request.toString(), key, { iv: iv });
    console.log("Decrypt Data", decrypted)

    return decrypted.toString(cryptojs.enc.Utf8);
}

export { axiosClient };