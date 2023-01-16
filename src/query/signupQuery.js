import { api, mailApi } from '../apis/apiInstance';
import axios, { AxiosError } from 'axios';
import { useQuery, useMutation } from 'react-query';
import React, { useState } from 'react';

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
    console.log(error.config.data);
    return error;
  }
};

// // 이메일 중복확인
// export const getVerifyEmail = async (params) => {
//   try {
//     const data = await api.get(`/api/users/signup?email=${params.queryKey[1]}`);
//     return data;
//   } catch (error) {
//     if (error instanceof AxiosError) console.log(error.response?.status);
//     console.log(error);
//     return error.response?.status;
//   }
// };

// const [code, setCode] = useState("");

// 이메일 인증 검사
// export const postSendEmailCode = async (payload) => {
//   const header = { 'x-api-key': process.env.REACT_APP_EMAIL_X_API_KEY };
//   let return_value;
//   await axios
//     .post(
//       `https://vns95wu8w0.execute-api.ap-northeast-2.amazonaws.com/default/email-HelloWorldFunction-tNcmw2rS5dhV`,
//       { email: payload.email }, //data(req.body)
//       {
//         headers: header,
//         // params: { postId: payload.postId },
//       } //config
//     )
//     .then((response) => {
//       console.log(response);
//       console.log(response.data.body.code);
//       return_value = response.data.body.code;
//     })
//     .catch(function (error) {
//       console.log(error);
//       return_value = true;
//     });
//   // console.log(params.queryKey);
//   // console.log(return_value);
//   return return_value;
// };

// 이메일 인증 검사
// export const postSendEmailCode = async (payload) => {
//   const header = { 'x-api-key': process.env.REACT_APP_EMAIL_X_API_KEY };
//   try {
//     const data = await axios.post(
//       'https://vns95wu8w0.execute-api.ap-northeast-2.amazonaws.com/default/email-HelloWorldFunction-tNcmw2rS5dhV',
//       { email: payload.email }, //data(req.body)
//       {
//         headers: header,
//       } //config
//     );
//     console.log('인증번호 전송 성공', data);
//     return data.data.body.code;
//   } catch (error) {
//     console.log(error);
//     return error;
//   }
// };

// ---------------------------------------------------------------------------------

// query hooks

// 이메일 중복확인
// export const useGetVerifyEmailQuery = (email) => {
//   const { isSuccess, isError, isLoading, isFetching, data, error } = useQuery({
//     // query 키
//     queryKey: ['getVerifyEmail', email],
//     // query 함수
//     queryFn: (params) => {
//       return getVerifyEmail(params);
//     },
//     // 자동 랜더링 삭제
//     // enabled: true,
//     // 자동 리랜더링 삭제
//     refetchOnWindowFocus: false,
//   });
//   if (isFetching) {
//     console.log('fetching...');
//   }
//   if (isLoading) {
//     console.log('loading...');
//   }
//   if (isError) {
//     console.log('error', error);
//   }
//   if (isSuccess) {
//     console.log('success', data);
//   }

//   return data;
// };

// 이메일 인증 검사
// export const usePostSendEmailCodeQuery = () => {
//   const { mutate, isLoading, isError, error, isSuccess } =
//     useMutation(postSendEmailCode);

//   console.log(
//     `isLoading: ${isLoading}, isError: ${isError}, error: ${error}, isSuccess: ${isSuccess}`
//   );

//   return mutate;
// };
