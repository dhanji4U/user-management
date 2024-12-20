import { axiosClient } from "./apiClient";

//================================================ Auth APIs Starts ===================================================
export function signup(data) {
    return axiosClient.post('auth/signup', data);
}
export function login(data) {
    return axiosClient.post('auth/login', data);
}
export function logout(data) {
    return axiosClient.post('auth/logout', data);
}
export function getUserDetails(data) {
    return axiosClient.post('auth/user_details', data);
}
export function editProfile(data) {
    return axiosClient.post('auth/edit_profile', data);
}
//================================================ Auth APIs Ends ======================================================
