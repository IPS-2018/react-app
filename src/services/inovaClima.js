const axios = require('axios');

const base = "https://inovabackend.herokuapp.com/api";

const getVersion = () => {
    const url = `${base}`;
    return axios
        .get(url)
        .then(data => {
            return data.data;
    });
};

const getAllPlaces = () => {
    const url = `${base}/places`;
    return axios
        .get(url)
        .then(data => {
            return data.data;
    });
};

const getSearchPlaces = (name, nicknameId) => {
    const url = `${base}/places/search`;
    return axios
        .post(url, {
            query: name,
            nicknameId: nicknameId
        })
        .then(data => {
            return data.data;
    });
};

const favoritePlace = (placeId, nicknameId) => {
    const url = `${base}/favoritos`;
    return axios
        .post(url, {
            placeId: placeId,
            nicknameId: nicknameId
        })
        .then(data => {
            return data.data;
    });
};

const getMyFavorites = (nicknameId) => {
    const url = `${base}/favoritos/${nicknameId}`;
    return axios
        .get(url)
        .then(data => {
            return data.data;
    });
}

module.exports = {
    base,
    getVersion,
    getAllPlaces,
    getSearchPlaces,
    favoritePlace,
    getMyFavorites
};