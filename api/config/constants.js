const GLOBALS = {
    'APP_NAME'              : 'UserManagement',

    'API_KEY'               : process.env.API_KEY,

    'LOGO'                  : 'images/logo.png',

    'BASE_URL'              : process.env.BASE_URL,
    'BASE_URL_WITHOUT_API'  : process.env.BASE_URL_WITHOUT_API,
    'PORT_BASE_URL'         : process.env.PORT_BASE_URL,

    'KEY'                   : process.env.KEY,
    'IV'                    : process.env.IV,

    'WEB_KEY'               : process.env.WEB_KEY,
    'WEB_IV'                : process.env.WEB_IV,

    'EMAIL_ID'              : process.env.EMAIL_ID,
    'EMAIL_PASSWORD'        : process.env.EMAIL_PASSWORD,

    'API_PASSWORD'          : process.env.API_PASSWORD,

    'SHORT_DATE'            : 'YYYY-MM-DD',
    'LONG_DATE'             : 'YYYY-MM-DD HH:mm',
    'FULL_DATE'             : 'YYYY-MM-DD HH:mm:ss',

    'USER_IMAGE'            : 'user/',

    'PER_PAGE'              : 10,
    
    'WEB_URL'             : process.env.WEB_URL,
}
module.exports = GLOBALS;
