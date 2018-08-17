const axios = require('axios');

const base = "https://dadosabertos.camara.leg.br/api/v2";

const getTiririca = () => {
    const url = `${base}/deputados/160976`;
    return axios
        .get(url)
        .then(data => {
            return data;
    });
};