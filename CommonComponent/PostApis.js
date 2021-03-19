import axios from "axios";
import { AsyncStorage } from "react-native";

let token = "";
let config = {};

AsyncStorage.getItem("token").then((result) => {
  token = result;
  config = {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${result}`,
    },
  };
});

export const getApi = (url, getResponse, getErrorResponse) => {
  axios
    .get(url)
    .then((response) => {
      getResponse(response.data);
    })
    .catch((err) => {
      getErrorResponse();
    });
};

export const postApi = (url, data) => {
  axios
    .post(url, data, config)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
};

export const putApi = (url, data, success, failure) => {
  axios
    .put(url, data, config)
    .then((response) => {
      console.log(response.data);
      success();
    })
    .catch((error) => {
      console.log(error);
      failure();
    });
};
