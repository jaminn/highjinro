const express = require('express');
const router = express.Router();
const rndString = require("randomstring");
/* GET users listing. */
router.post('/register', function (req, res, next) {
    const {
        userid
        , name
        , pw
    } = req.body;
    if (!userid || !name || !pw) {
        return res.status(403).send("Params Missing");
    }
    const current = new Users({
        userid: userid
        , name: name
        , pw: pw
        , token: rndString.generate()
    });
    current.save((err, data) => {
        if (err) {
            const dup = err.errmsg.indexOf("dup") !== -1;
            if (dup) return res.status(300).send("already exists");
            return res.status(400).send("DB Error");
        }
        return res.status(200).send(current);
    });
});
router.post('/login', (req, res, next) => {
    const {
        userid
        , pw
    } = req.body;
    Users.findOne({
        userid: userid
    }, (err, user) => {
        if (!user) return res.status(400).send("no user");
        if (user.userid !== userid || user.pw !== pw) {
            return res.status(401).send("login incorrect");
        }
        const obj = {
            "userid": user.userid
            , "name": user.name
            , "token": user.token
        };
        return res.status(200).send(obj);
    });
});
router.post('/auto', (req, res, next) => {
    const {
        token
    } = req.body;
    Users.findOne({
        token: token
    }, (err, result) => {
        if (!result) return res.status(401).send("Access Denied");
        return res.status(200).send(result);
    })
});
router.post('/destory', (req, res) => {
    const {
        token
    } = req.body;
    Users.remove({
        token: token
    }, (err, result) => {
        if (err) return res.status(409).send("DB ERROR");
        if (!result) return res.status(401).send("user not found");
        return res.status(200).send("good bye");
    })
})
module.exports = router;