const authModel = require('../models/auth_model');
const CODES = require('../../../config/status_code');
const middleware = require('../../../middleware/header_validator');
const validationRules = require('../validation_rules');

/*
** Function to login
*/
const login = async (req, res) => {

    const request = await middleware.decryption(req);
    const valid = await middleware.checkValidationRules(request, validationRules.loginValidation);

    if (valid.status) {
        return authModel.login(request, res);
    }

    return middleware.sendResponse(req, res, CODES.SUCCESS_STATUS, CODES.ERROR_CODE, { keyword: 'rest_keywords_validation_error', components: { error: valid.error } }, null);
};

/*
** Function to login
*/
const signup = async (req, res) => {

    const request = await middleware.decryption(req);
    const valid = await middleware.checkValidationRules(request, validationRules.registerValidation);

    if (valid.status) {
        return authModel.signup(request, res);
    }

    return middleware.sendResponse(req, res, CODES.SUCCESS_STATUS, CODES.ERROR_CODE, { keyword: 'rest_keywords_validation_error', components: { error: valid.error } }, null);
};


/*
** Function to get user details
*/
const userDetails = async (req, res) => {

    const request = await middleware.decryption(req);
    
    const userData = await authModel.authDetails({ _id: request.user_id, is_active: 1, is_deleted: 0 });

    const statusCode = (userData !== null) ? CODES.SUCCESS_STATUS : CODES.NOT_FOUND;
    const responseCode = (userData !== null) ? CODES.SUCCESS_CODE : CODES.NODATA_CODE;
    const responseMessage = (userData !== null)
        ? { keyword: 'rest_keywords_admin_data_successfound', components: {} }
        : { keyword: 'rest_keywords_admindetails_not_found', components: {} };

    return middleware.sendResponse(request, res, statusCode, responseCode, responseMessage, userData);
};

/*
** Function to edit profile
*/
const editProfile = async (req, res) => {

    const request = await middleware.decryption(req);
    const valid = await middleware.checkValidationRules(request, validationRules.editProfileValidation);

    if (valid.status) {
        return authModel.editProfile(request, res);
    }

    return middleware.sendResponse(req, res, CODES.SUCCESS_STATUS, CODES.ERROR_CODE, { keyword: 'rest_keywords_validation_error', components: { error: valid.error } }, null);
};

/*
** Function to logout
*/
const logout = async (req, res) => {

    const request = await middleware.decryption(req);

    return authModel.logout(request, res);
};

module.exports = {
    login,
    signup,
    userDetails,
    editProfile,
    logout,
};
