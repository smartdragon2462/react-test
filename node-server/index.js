const express = require('express');
const request = require('request');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get('/people', fectchPeople);
app.get('/planets', fectchPlanets);


function requestGetAPI(url) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(url);
            resolve(response.data.results);
        } catch (err) {
            reject(err)
        }
    })
}

function requestGetAPI1(url) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(url);
            resolve(response.data.name);
        } catch (err) {
            reject(err)
        }
    })
}

async function replaceResidents(data) {
    let promiseArr = [];
    for (let i = 0; i < data.residents.length; i++) {
        promiseArr.push(requestGetAPI1(data.residents[i]));
    }
    const result = await Promise.all(promiseArr);
    data.residents = result;
    console.log("Running...", result)
    return data;
}

function sort(data, type) {
   return data.sort(function (a, b) {
        let a1 = null;
        let b1 = null;
        if (type === 'name') {
            a1 = a.name;
            b1 = b.name;
        } else if (type === 'height') {
            a1 = a.height;
            b1 = b.height;
        } else if (type === 'mass') {
            a1 = a.mass;
            b1 = b.mass;
        }
        if (a1 < b1) {return -1;}
        if (a1 > b1) {return 1;}
        return 0;
    })
}

async function fectchPeople(req, res, next) {
    try {
        let url = `https://swapi.dev/api/people/?page=1`;
        let response = await axios.get(url);
        const count = response.data.count;

        let promiseArr = [];
        for (let i = 1; i <= Math.ceil(count / 10); i++) {
            url = `https://swapi.dev/api/people/?page=${i}`;
            promiseArr.push(requestGetAPI(url));
        }

        const result = await Promise.all(promiseArr);
        let data = result.flat();
        let sortedData = null;
        if (req.query?.sortBy) {
            switch (req.query['sortBy']) {
                case 'name':
                    sortedData = sort(data, 'name');
                    break;
                case 'height':
                    sortedData = sort(data, 'height');
                    break;
                case 'mass':
                    sortedData = sort(data, 'mass');
                    break;
            }
            return res.send(sortedData);
        } else {
            return res.send(data);
        }
    } catch (e) {
        return res.send(e);
    }
}

async function fectchPlanets(req, res, next) {
    try {
        let url = `https://swapi.dev/api/planets/?page=1`;
        let response = await axios.get(url);
        const count = response.data.count;

        let promiseArr = [];
        for (let i = 1; i <= Math.ceil(count / 10); i++) {
            url = `https://swapi.dev/api/planets/?page=${i}`;
            promiseArr.push(requestGetAPI(url));
        }

        const result = await Promise.all(promiseArr);
        let data = result.flat();
        for (let i = 0; i < data.length; i++) {
            data[i] = await replaceResidents(data[i]);
        }
        return res.send(data);
    } catch (e) {
        return res.send(e);
    }
}

const server = app.listen(port, () => {
    const host = server.address().address,
        port = server.address().port;

    console.log('API listening at http://%s:%s', host, port);
});



