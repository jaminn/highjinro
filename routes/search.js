const express = require('express');
const router = express.Router();
const fs = require('fs');
router.post('/', (req, res) => {
    const {
        query
    } = req.body;
    if (!query) return res.status(400).send("param error");
    let re = /([가-힣)(]+)\s+([0-9\.]+|null)\s+([0-9\.]+|null)/g;
    fs.readFile('./public/files/data.txt', 'ucs2', (err, data) => {
        if (err) return res.status(400).send("File error");
        let match;
        let arr = [];
        while (match = re.exec(data)) {
            if (match[1].includes(query)) {
                arr.push({
                        "name": match[1]
                        , "uni_percent": match[2]
                        , "job_percent": match[3]
                    })
                    //console.log(match[0],match[1],match[2]);
            }
        }
        return res.status(200).send({"data":arr});
    });
});
router.post('/tags', (req, res) => {
    const {
        query
    } = req.body;
    if (!query) return res.status(400).send("param error");
    fs.readFile('./public/files/tags.txt', 'utf-8', (err, data) => {
        if (err) return res.status(400).send("File error");
        res.status(200).send(data);
    });
});
module.exports = router;