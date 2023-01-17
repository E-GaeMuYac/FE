import { api } from '../apis/apiInstance';

// api 호출 함수

// 회원가입 submit
export const postSignup = async (payload) => {
  try {
    const data = await api.post('/api/users/signup', payload);
    if (data.status === 201) {
      window.alert('회원가입 완료!\npillnuts에 오신 것을 환영합니다 :)');
      window.location.href = 'http://localhost:3000/login';
      return data;
    }
  } catch (error) {
    // console.log(error.config.data);
    return error;
  }
};
