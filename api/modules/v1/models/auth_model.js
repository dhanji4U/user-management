const randtoken = require('rand-token').generator();
const moment = require('moment');
const cryptoLib = require('cryptlib');

const common = require('../../../config/common');
const CODE = require('../../../config/status_code');
const userSchema = require('../../schema/user_schema');
const middleware = require('../../../middleware/header_validator');
const logger = require('../../../logger');
const GLOBALS = require('../../../config/constants');
const userModel = require('../../schema/user_schema');
const shaKey = cryptoLib.getHashSha256(GLOBALS.KEY, 32);

const authModel = {

    /*
    ** Function to get details for users
    */
    async authDetails(condition) {

        try {
            const userDetails = await common.getSingleDetails(userSchema, condition);

            return userDetails;
        } catch (error) {
            logger.error(error);
        }
    },


    /*
    ** Function to get details for users
    */
    async updateUser(condition, params) {

        try {

            const updateDetails = await userSchema.findOneAndUpdate(condition, { $set: params }, { returnDocument: 'after' });

            return (updateDetails != null) ? updateDetails : null;

        } catch (error) {
            logger.error(error);
        }
    },

    /*---------------------------------------- Unique Check Starts ------------------------------------------ */

    /*
    ** Function for check unique field for users
    */
    async checkUniqueFields(user_id, request) {
        try {
            const emailResult = await authModel.checkUniqueEmail(user_id, request);
            return emailResult;
        } catch (error) {
            logger.error(error);
            return { code: CODE.ERROR_CODE, message: { keyword: 'rest_keywords_somethingwrong_check_uniquefields', components: {}, }, unique: false };
        }
    },

    /*
    ** Function to check email uniqueness
    */
    async checkUniqueEmail(user_id, request) {
        try {
            if (request.email !== undefined && request.email !== '') {

                const query = { email: request.email, is_deleted: 0 };

                if (user_id != undefined && user_id != '' && user_id) {
                    query._id = { $ne: user_id };
                }

                const authprofile = await userSchema.findOne(query);

                return authprofile !== null
                    ? { code: CODE.ERROR_CODE, message: { keyword: 'rest_keywords_duplicate_email', components: {} }, unique: false }
                    : { code: CODE.SUCCESS_CODE, message: { keyword: 'rest_keywords_success', components: {} }, unique: true };

            } else {
                return { code: CODE.SUCCESS_CODE, message: 'rest_keywords_success', unique: true };
            }
        } catch (error) {
            // console.log(error, "in checkUniqueEmail catch");

            logger.error(error);
            return { code: CODE.ERROR_CODE, message: { keyword: 'rest_keywords_failed_to_check_duplicate_email', components: {}, }, unique: false };
        }
    },



    /*---------------------------------------- Unique Check Ends ------------------------------------------ */

    /*
    ** Function to signup for users
    ** 03-01-2024
    */
    async signup(request, result) {

        try {

            const checkUniqueFields = await authModel.checkUniqueFields('', request);

            if (checkUniqueFields.unique) {

                const encPass = await cryptoLib.encrypt(request.password, shaKey, GLOBALS.IV);
                request.password = encPass;

                request.insert_time = moment.utc(new Date()).format(GLOBALS.FULL_DATE);
                request.update_time = moment.utc(new Date()).format(GLOBALS.FULL_DATE);

                const newUser = new userSchema(request);

                await newUser.validate(); // Validate the user data

                const response = await newUser.save(); // Save user data to MongoDB

                if (response && response._id) {

                    return middleware.sendResponse(request, result, CODE.SUCCESS_STATUS, CODE.SUCCESS_CODE, { keyword: 'rest_keywords_user_signup_success', components: {} }, response);

                } else {
                    // Handle the case where the response is unexpected or falsy
                    return middleware.sendResponse(request, result, CODE.INTERNAL_ERROR, CODE.ERROR_CODE, { keyword: 'rest_keywords_user_signup_failed', components: {} }, null);
                }
            } else {
                return middleware.sendResponse(request, result, CODE.NOT_FOUND, checkUniqueFields.code, checkUniqueFields.message, null);
            }
        } catch (error) {
            logger.error(error);
            return middleware.sendResponse(request, result, CODE.INTERNAL_ERROR, CODE.ERROR_CODE, { keyword: 'rest_keywords_user_signup_failed', components: {} }, null);
        }
    },

    /*
    ** Function to check login details of users
    ** 02-06-2024
    */
    async login(request, result) {

        try {

            const condition = { email: request.email, is_deleted: 0 };

            const authProfile = await authModel.authDetails(condition);

            if (authProfile !== null) {

                const encPass = await cryptoLib.encrypt(request.password, shaKey, GLOBALS.IV);

                if (authProfile.password !== encPass) {

                    return middleware.sendResponse(request, result, CODE.SUCCESS_STATUS, CODE.ERROR_CODE, { keyword: 'rest_keywords_invalid_password', components: {} }, null);

                } else if (authProfile.is_active === 0) {

                    return middleware.sendResponse(request, result, CODE.SUCCESS_STATUS, CODE.ACCOUNT_INACTIVE, { keyword: 'rest_keywords_inactive_accountby_admin', components: {} }, null);

                } else {
                    const token = randtoken.generate(64, '0123456789abcdefghijklnmopqrstuvwxyz');

                    const loginParams = {
                        token: token,
                        login_status: "Online",
                        last_login: moment.utc(new Date()).format(GLOBALS.LONG_DATE),
                        updated_at: moment.utc(new Date()).format(GLOBALS.FULL_DATE)
                    };

                    const updateDetails = await authModel.updateUser({ _id: authProfile._id }, loginParams);

                    return middleware.sendResponse(request, result, CODE.SUCCESS_STATUS, CODE.SUCCESS_CODE, { keyword: 'rest_keywords_user_login_success', components: {} }, updateDetails);
                }
            } else {

                return middleware.sendResponse(request, result, CODE.SUCCESS_STATUS, CODE.NODATA_CODE, { keyword: 'rest_keywords_invalid_logindetails', components: {} }, null);
            }
        } catch (error) {
            logger.error(error);
            return middleware.sendResponse(request, result, CODE.INTERNAL_ERROR, CODE.ERROR_CODE, { keyword: 'rest_keywords_resend_otp_failed', components: {} }, null);
        }
    },

    /*
    ** Function to edit profile for users
    ** 06-06-2024
    */
    async editProfile(request, result) {

        try {

            const condition = { _id: request.user_id, is_active: 1, is_deleted: 0 };

            const authProfile = await authModel.authDetails(condition);

            if (authProfile != null) {

                const checkUniqueFields = await authModel.checkUniqueFields(request.user_id, request);

                if (checkUniqueFields.unique) {

                    const editProfile = {
                        name: request.name,
                        updated_at: moment.utc(new Date()).format(GLOBALS.FULL_DATE),
                        ...(request.email !== undefined && request.email !== '' && { email: request.email }),
                        ...(request.about_me !== undefined && request.about_me !== '' && { about_me: request.about_me }),
                    };

                    if (request.password !== undefined && request.password !== '') {
                        const encPass = await cryptoLib.encrypt(request.password, shaKey, GLOBALS.IV);
                        editProfile.password = encPass;
                    }

                    const updateDetails = await authModel.updateUser({ _id: request.user_id }, editProfile);

                    return middleware.sendResponse(request, result, CODE.SUCCESS_STATUS, CODE.SUCCESS_CODE, { keyword: 'rest_keywords_profile_update_success', components: {} }, updateDetails);

                } else {

                    return middleware.sendResponse(request, result, CODE.SUCCESS_STATUS, checkUniqueFields.code, checkUniqueFields.message, null);
                }
            } else {

                return middleware.sendResponse(request, result, CODE.SUCCESS_STATUS, CODE.NODATA_CODE, { keyword: 'rest_keywords_user_doesnot_exist', components: {} }, null);
            }
        } catch (error) {
            logger.error(error);
            return middleware.sendResponse(request, result, CODE.INTERNAL_ERROR, CODE.ERROR_CODE, { keyword: 'rest_keywords_profile_update_failed', components: {} }, null);
        }
    },

    /*
    ** Function to logout for users
    ** 04-06-2024
    */
    async logout(request, result) {

        try {

            const condition = { _id: request.user_id, is_active: 1, is_deleted: 0 };

            const authProfile = await authModel.authDetails(condition);

            if (authProfile != null) {

                const logoutParams = {
                    login_status: 'Offline',
                    token: '',
                    updated_at: moment.utc(new Date()).format(GLOBALS.FULL_DATE),
                };

                const updateDetails = await authModel.updateUser({ _id: request.user_id }, logoutParams);

                const statusCode = (updateDetails !== null) ? CODE.SUCCESS_STATUS : CODE.INTERNAL_ERROR;
                const responseCode = (updateDetails !== null) ? CODE.SUCCESS_CODE : CODE.ERROR_CODE;
                const responseMessage = (updateDetails !== null)
                    ? { keyword: 'rest_keywords_userlogout_success', components: {} }
                    : { keyword: 'rest_keywords_userlogout_failed', components: {} };

                return middleware.sendResponse(request, result, statusCode, responseCode, responseMessage, null);

            } else {

                return middleware.sendResponse(request, result, CODE.SUCCESS_CODE, CODE.NODATA_CODE, { keyword: 'rest_keywords_user_doesnot_exist', components: {} }, null);
            }
        } catch (error) {
            logger.error(error);
            return middleware.sendResponse(request, result, CODE.INTERNAL_ERROR, CODE.ERROR_CODE, { keyword: 'rest_keywords_profile_update_failed', components: {} }, null);
        }
    },
};

module.exports = authModel;