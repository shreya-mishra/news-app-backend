import { backurl } from "../config/config";

export const getNewsApi = () => {
  return `${backurl}/news`;
};

export const likeNewsApiUrl = () => {
  return `${backurl}/news/like`;
};

export const unlikeNewsApiUrl = () => {
  return `${backurl}/news/unlike`;
};

export const createNewsApiUrl = () => {
  return `${backurl}/news/create`;
};


export const userId = () => {
  return `${backurl}/user`;
};
