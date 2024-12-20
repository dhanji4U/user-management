const checkValidatorRules = {

    // -------------------------------------------- Auth Module Validation Starts --------------------------------------------

    loginValidation: {
        email                               : 'required|email',
        password                            : 'required'
    },

    registerValidation: {
        name                                : 'required',
        email                               : 'required',
        password                            : 'required',
        about_me                            : 'required'
    },

    editProfileValidation: {
        name                                : 'required',
        email                               : '',
        password                            : '',
        about_me                            : ''
    },

    // -------------------------------------------- Auth Module Validation Ends --------------------------------------------

};

module.exports = checkValidatorRules;
