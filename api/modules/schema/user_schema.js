const mongoose = require('mongoose');
const moment = require('moment');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
    user_seq_id: {
        type: Number,
        unique: true
    },
    
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        unique: [true, 'Email already exist'],
        required: true,
        index: true
    },

    password: {
        type: String,
        required: true
    },

    about_me: {
        type: String,
        required: true
    },

    login_status: {
        type: String,
        enum: ['Online', 'Offline'],
        default: 'Offline',
        required: true
    },

    last_login: {
        type: Date,
        default: () => moment().format("YYYY-MM-DD HH:mm:ss")
    },

    token: {
        type: String,
    },

    is_active: {
        type: Number,
        enum: [0, 1],
        default: 1,
        index: true
    },

    is_deleted: {
        type: Number,
        enum: [0, 1],
        default: 0,
        index: true
    },

    created_at: { type: Date, default: () => moment().utc().format("YYYY-MM-DD HH:mm:ss") },
    updated_at: { type: Date, default: () => moment().utc().format("YYYY-MM-DD HH:mm:ss") },
});

userSchema.plugin(AutoIncrement, { inc_field: 'user_seq_id', start_seq: 1 });


const userModel = mongoose.model('user', userSchema, 'user');

module.exports = userModel;
