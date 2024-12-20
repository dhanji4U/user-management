const cryptoLib = require('cryptlib');
const GLOBALS = require('../config/constants');
const shaKey = cryptoLib.getHashSha256(GLOBALS.KEY, 32);
const { default: localizify } = require('localizify');
const en = require('../language/en');
const { t } = require('localizify');
const logger = require('../logger');

const cryptoJS = require('crypto-js');

const WEB_KEY = cryptoJS.enc.Utf8.parse(GLOBALS.WEB_KEY);
const WEB_IV = cryptoJS.enc.Utf8.parse(GLOBALS.WEB_IV);

const headerValidator = {

    // function for extract accept language from request header and set in req globaly
    async extractHeaderLanguage(req, res, next) {

        try {

            const acceptLanguageHeader = req.headers['accept-language'];
            let language;

            if (acceptLanguageHeader && acceptLanguageHeader !== 'en-GB,en-US;q=0.9,en;q=0.8') {
                language = acceptLanguageHeader;
            } else {
                language = 'en';
            }

            req.lang = language;

            access_level = (req.headers["access-level"] != undefined && req.headers["access-level"] != "") ? req.headers["access-level"] : 0;

            if (language == 'ar') {
                localizify.add(language, ar).setLocale('ar');
            }
            next(); // Use next to end the middleware function

        } catch (error) {
            logger.error(error);
        }
    },

    // Decrypt user request
    async decryption(req) {

        try {

            let decryptedBody;

            if (Object.keys(req.body).length !== 0) {
                decryptedBody = cryptoJS.AES.decrypt(req.body, WEB_KEY, { iv: WEB_IV }).toString(cryptoJS.enc.Utf8);
            }

            const parsedBody = (decryptedBody !== undefined) ? JSON.parse(decryptedBody) : {};

            const request = {
                ...parsedBody
            };

            return request;

        } catch (error) {
            logger.error(error);
            return {};
        }
    },

    // Encrypt user request
    async encryption(req) {
        try {

            const response = cryptoJS.AES.encrypt(JSON.stringify(req), WEB_KEY, { iv: WEB_IV }).toString();

            return response;

        } catch (error) {
            logger.error(error);
            return {};
        }
    },

    async sendResponse(req, res, statusCode, responseCode, responseMessage, responseData) {
        try {
            const formedMsg = await headerValidator.getMessage('en', responseMessage.keyword, responseMessage.components);

            const resultObj = { code: responseCode, message: formedMsg };

            if (responseData !== null) {
                resultObj.data = responseData;
            }

            const response = await headerValidator.encryption(resultObj);

            res.status(statusCode).json(response);
        } catch (error) {
            logger.error(error);
            // res.status(500).json({ code: codes.INTERNAL_ERROR, message: 'An internal error occurred' });
        }
    },


    async getMessage(requestLanguage, keywords, components) {
        try {
            if (requestLanguage === 'en') {
                localizify.add('en', en).setLocale(requestLanguage);
            }

            const returnMessage = await t(keywords, components);
            return returnMessage;
        } catch (error) {
            logger.error(error);
            throw error; // Handle or log the error appropriately
        }
    },

    // check Validation Rules
    checkValidationRules: async (request, rules) => {
        try {
            const v = require('Validator').make(request, rules);
            const validator = {
                status: true,
            }
            if (v.fails()) {
                const ValidatorErrors = v.getErrors();
                validator.status = false
                for (const key in ValidatorErrors) {
                    validator.error = ValidatorErrors[key][0];
                    break;
                }
            }
            return validator;
        } catch (error) {
            logger.error(error)
        }
        return false;

    },
}

module.exports = headerValidator
