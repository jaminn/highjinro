const express = require('express');
const router = express.Router();
const rndString = require('randomstring');
const moment = require('moment');

const date = moment().format();

router.post('/write', (req, res, next) => {
    const {
        token,
        title,
        contents
    } = req.body;
    const boardid = rndString.generate();
    Users.findOne({
        token: token
    }, (err, result) => {
        if (err) return res.status(409).send("DB error");
        if (!result) return res.status(400).send("not valid token");
        const current = new Boards({
            boardid: boardid,
            title: title,
            writer: result.name,
            writerToken: token,
            date: date,
            contents: contents
        });
        current.save((err, data) => {
            if (err) return res.status(409).send("DB error");
            return res.status(200).send("sucess");
        });
    });
});


router.post('/', (req, res) => {
    Boards.find({}, (err, result) => {
        if (err) return res.status(409).send("DB error")
        return res.status(200).send(result);
    });
});


router.post('/commentAdd', (req, res) => {
    const {
        token,
        boardid,
        summary
    } = req.body;
    Users.findOne({
        token: token
    }, (err, user) => {
        if (err) return res.status(409).send("DB error");
        if (!user) return res.status(400).send("not valid token");
        Boards.update({
            boardid: boardid
        }, {
            $push: {
                comments: {
                    writer: user.name,
                    date: date,
                    summary: summary
                }
            }
        }, (err, result) => {
            if (err) return res.status(409).send("DB Error");
            if (result.ok <= 0) return res.status(300).send("nothing chenged");
            Boards.findOne({
                boardid: boardid
            }, (err, board) => {
                return res.status(200).send(board);
            });
        });
    });
});

module.exports = router;
