import { api } from '../apis/apiInstance';

// api 호출 함수

// 회원가입 submit
export const postSignup = async (payload) => {
  try {
    const data = await api.post('/api/users/signup', payload);
    if (data.status === 201) {
      return data;
    }
  } catch (error) {
    // console.log(error.config.data);
    return error;
  }
};
