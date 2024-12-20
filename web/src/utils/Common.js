import Swal from "sweetalert2";

export function ErrorAlert(data, msg) {
    Swal.fire({
        position: "top-end",
        icon: "error",
        title: data || msg,
        toast: true,
        showConfirmButton: false,
        timer: 2500,
    });
}

export function SuccessAlert(data, msg) {
    Swal.fire({
        position: "top-end",
        icon: "success",
        title: data || msg,
        toast: true,
        showConfirmButton: false,
        timer: 1500,
    });
}

export function SimpleAlert(data, msg) {
    Swal.fire({
        position: "top-end",
        icon: "info",
        title: data || msg,
        toast: true,
        showConfirmButton: false,
        timer: 2500,
    });
}

export function removeLoginData() {
    sessionStorage.removeItem("UserIsLogin");
    sessionStorage.removeItem("UserToken");
    sessionStorage.removeItem("UserName");
    sessionStorage.removeItem("UserID");
    sessionStorage.removeItem("UserEmail");
    sessionStorage.removeItem("UserData");
}

export function addLoginData(data) {
    sessionStorage.setItem("UserIsLogin", true);
    sessionStorage.setItem("UserToken", data.token);
    sessionStorage.setItem("UserName", data.name);
    sessionStorage.setItem("UserID", data._id);
    sessionStorage.setItem("UserEmail", data.email);
    sessionStorage.setItem("UserData", data);
}