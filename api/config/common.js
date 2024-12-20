const con = require('./database');
const moment = require('moment');
const logger = require('../logger');
const GLOBALS = require('./constants');
const CODE = require('./status_code');
const nodemailer = require('nodemailer');
const common = {
    
    /*
    ** Function to perform multiple document insertion
    */
    async multipleInsert(params, Schema) {
        try {
            // Use insertMany to insert an array of documents
            const insertData = await Schema.insertMany(params);

            // Check if documents were inserted successfully
            if (insertData && insertData.length > 0) {
                return insertData;
            } else {
                return null; // Return null if no documents were inserted
            }
        } catch (error) {
            console.error("Error in multipleInsert:", error);
            logger.error(error);
            return null; // Return null in case of an error
        }
    },

    /*
    ** Function to perform single document insertion
    */
    async singleInsert(params, Schema) {
        try {
            // Use create to insert a single document
            const insertData = await Schema.create(params);

            // Check if the document was inserted successfully
            if (insertData) {
                return insertData;
            } else {
                return null; // Return null if the document was not inserted
            }

        } catch (error) {
            console.error("Error in singleInsert:", error);
            logger.error(error);
            return null; // Return null in case of an error
        }
    },

    /*
    ** Function to update multiple documents based on a condition
    */
    async updateData(condition, params, Schema) {
        try {
            let options = { multi: true, runValidators: true }; // Set options for updating multiple documents
            // Use updateMany to update multiple documents based on a condition
            const updateData = await Schema.updateMany(condition, params, options);

            console.log(updateData);

            // Check if documents were updated successfully
            if (updateData && updateData.modifiedCount > 0) {
                return updateData;
            } else {
                return null; // Return null if no documents were updated
            }
        } catch (error) {
            console.error("Error in updateData:", error);
            logger.error(error);
            return null; // Return null in case of an error
        }
    },

    /*
    ** Function to update multiple documents based on a condition
    */
    async singleUpdate(condition, params, Schema) {
        try {

            const options = {
                new: true, // Return the updated document
                runValidators: true // Run schema validators
            };

            // Use updateMany to update single documents based on a condition and return updated document
            const updateData = await Schema.findOneAndUpdate(condition, { $set: params }, options);

            // Check if documents were updated successfully
            return (updateData != null) ? updateData : null;// Return null if no documents were updated

        } catch (error) {
            console.error("Error in updateData:", error);
            logger.error(error);
            return null; // Return null in case of an error
        }
    },

    /*
    ** Function to retrieve multiple documents based on a condition
    */
    async getDetails(Schema, condition, sortOptions = {}) {
        try {
            // Use find to retrieve multiple documents based on a condition
            const getData = await Schema.find(condition).sort(sortOptions);

            // Check if documents were retrieved successfully
            return (getData && getData.length > 0) ? getData : null; // Return null if no documents were retrieved

        } catch (error) {
            console.error("Error in getDetails:", error);
            logger.error(error);
            return null; // Return null in case of an error
        }
    },

    /*
    ** Function to retrieve multiple documents based on a condition
    */
    async getMultiDetails(Schema, condition, sortOptions = {}, skip = null, limit = null) {
        try {
            // Use find to retrieve multiple documents based on a condition
            const getData = await Schema.find(condition).sort(sortOptions).skip(skip).limit(limit);

            // Check if documents were retrieved successfully
            return (getData && getData.length > 0) ? getData : null; // Return null if no documents were retrieved

        } catch (error) {
            console.error("Error in getDetails:", error);
            logger.error(error);
            return null; // Return null in case of an error
        }
    },


    /*
    ** Function to retrieve multiple documents list based on a condition
    */
    async getMultipleList(Schema, condition, sortOptions = {}, skip = null, limit = null) {
        try {
            // Use find to retrieve multiple documents based on a condition
            const getData = await Schema.find(condition).sort(sortOptions).skip(skip).limit(limit);

            // Check if documents were retrieved successfully
            return (getData && getData.length > 0) ? getData : []; // Return null if no documents were retrieved

        } catch (error) {
            console.error("Error in getDetails:", error);
            logger.error(error);
            return []; // Return null in case of an error
        }
    },


    /*
    ** Function to retrieve a single document based on a condition
    */
    async getSingleDetails(Schema, condition) {
        try {
            // Use findOne to retrieve a single document based on a condition
            const getSingleData = await Schema.findOne(condition);

            // Check if documents were retrieved successfully
            return (getSingleData) || null; // Return null if no documents were retrieved

        } catch (error) {
            console.error("Error in getSingleDetails:", error);
            logger.error(error);
            return null; // Return null in case of an error
        }
    },

    /*
    ** Function to get the count of documents based on a condition
    */
    async getCount(condition, Schema) {
        try {
            // Use countDocuments to get the count of documents based on a condition
            const getCount = await Schema.countDocuments(condition);

            // Check if the count was retrieved successfully
            if (getCount !== undefined && getCount !== null && getCount > 0) {
                return getCount;
            } else {
                return 0; // Return null if the count was not retrieved
            }
        } catch (error) {
            console.error("Error in getCount:", error);
            logger.error(error);
            return 0; // Return null in case of an error
        }
    },



    /*
    ** Common function to get otp
    */
    async getOTPCode(length, type) {

        // Calculate the minimum and maximum values based on the specified length
        const min = Math.pow(10, length - 1);
        const max = Math.pow(10, length) - 1;

        // Generate a random numeric code within the specified range
        const code = Math.floor(min + Math.random() * (max - min + 1));

        switch (type) {
            case 'signup':
                return 1234; // Predefined code for signup
            case 'resend':
                return 1111; // Predefined code for resend
            case 'forgot':
                return 2222; // Predefined code for forgot
            default:
                return code;
        }
    },

    /*
    ** Common function to send sms
    */
    sendSMS: function (phone, message, otp_code) {
        try {
            if (phone != '' && phone != undefined) {
                console.log('SMS sent successfully:');
                return true;
            } else {
                console.error('Phone number is missing.');
                return false;
            }
        } catch (error) {
            console.error('Error sending SMS:', error);
            logger.error(error);
            return false;
        }
    },

    // function for send email
    async sendEmail(sub, toEmail, message) {
        try {
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: GLOBALS.EMAIL_ID,
                    pass: GLOBALS.EMAIL_PASSWORD
                }
            });
            const mailOptions = {

                from: `${GLOBALS.EMAIL_ID} ${GLOBALS.APP_NAME}`,
                to: toEmail,
                subject: sub,
                html: message
            };
            const result = await transporter.sendMail(mailOptions);

            return (result !== null);
        }
        catch (error) {
            logger.error(error);
            return false;
        }

    },

    /*
    ** Function for check unique field for admin
    */
    async checkUniqueFields(Schema, user_id, request) {
        try {
            const emailResult = await common.checkUniqueEmail(Schema, user_id, request);
            if (emailResult.unique === false) {
                return emailResult;
            } else {

                const phoneResult = await common.checkUniquePhone(Schema, user_id, request);
                return phoneResult;
            }
        } catch (error) {
            logger.error(error);
            return { code: CODE.ERROR_CODE, message: { keyword: 'rest_keywords_somethingwrong_check_uniquefields', components: {}, }, unique: false };
        }
    },

    /*
    ** Function to check email uniqueness for admin
    */
    async checkUniqueEmail(Schema, user_id, request) {
        try {
            if (request.email !== undefined && request.email !== '') {

                const query = { email: request.email, is_deleted: 0 };

                if (user_id != undefined && user_id != '' && user_id) {
                    query._id = { $ne: user_id };
                }

                const adminprofile = await Schema.findOne(query);

                return adminprofile !== null
                    ? { code: CODE.ERROR_CODE, message: { keyword: 'rest_keywords_duplicate_email', components: {} }, unique: false }
                    : { code: CODE.SUCCESS_CODE, message: { keyword: 'rest_keywords_success', components: {} }, unique: true };

            } else {
                return { code: CODE.SUCCESS_CODE, message: 'rest_keywords_success', unique: true };
            }
        } catch (error) {
            console.log(error, "in checkUniqueEmail catch");
            logger.error(error);
            return { code: CODE.ERROR_CODE, message: { keyword: 'rest_keywords_failed_to_check_duplicate_email', components: {}, }, unique: false };
        }
    },

    /*
    ** Function to check phone uniqueness
    */
    async checkUniquePhone(Schema, user_id, request) {
        try {
            if (request.country_code !== undefined && request.country_code !== '' && request.phone !== undefined && request.phone !== '') {

                const query = { phone: request.phone, is_deleted: 0, };

                if (user_id != undefined && user_id != '' && user_id) {
                    query._id = { $ne: user_id };
                }

                const adminprofile = await Schema.findOne(query);

                return adminprofile !== null
                    ? { code: CODE.ERROR_CODE, message: { keyword: 'rest_keywords_duplicate_phonenumber', components: {} }, unique: false }
                    : { code: CODE.SUCCESS_CODE, message: { keyword: 'rest_keywords_success', components: {} }, unique: true };

            } else {

                return { code: CODE.SUCCESS_CODE, message: { keyword: 'rest_keywords_success', components: {}, }, unique: true };
            }
        } catch (error) {
            logger.error(error);
            return { code: CODE.ERROR_CODE, message: { keyword: 'rest_keywords_failed_to_check_duplicate_phonenumber', components: {}, }, unique: false };
        }
    },

}



module.exports = common;
