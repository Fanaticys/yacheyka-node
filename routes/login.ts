import handleError from './../functions';
import User from '../models/user';

const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

router.use(verifyUser);

router.post('/', function(req, res, next){
    const token = jwt.sign({
        username: req.body.username,
        bank_id: req.user.bank_id,
        bank: req.user.bank
    }, process.env.SECRET, {
        expiresIn: 1800
    });
    const decode = jwt.decode(token);

    res.json({
        success: true,
        token: token,
        expires_at: decode.exp * 1000
    });
});

function verifyUser(req, res, next){
    User.findOne({
        username: req.body.username,
        password: req.body.password 
    }, function(err, doc){
        if (err) return handleError(res, err.message, "Error while login");
        if (doc) {
            req.user = doc;
            next();
        } else {
            res.status(200).json({
                success: false,
                message: "Invalid username or password"
            });
        }
    });
}

export default router;