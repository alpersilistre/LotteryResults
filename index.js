const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/site')));

app.listen('3000', () => {
    console.log('Starting...');
});

app.get('/piyango', (req, res) => {
    const date = req.query.selectedDate;
    console.log(date);
    let url = `http://www.millipiyango.gov.tr/sonuclar/cekilisler/piyango/${date}.json`;
    axios.get(url).
        then((response) => {
            res.send(response.data);
        }).catch((err) => {
            console.log(err);
        });
});