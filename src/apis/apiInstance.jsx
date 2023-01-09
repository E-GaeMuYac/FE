import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT,
});

//인터셉터는 사용하는 api에 따라 작성하면 될것 같습니다.
