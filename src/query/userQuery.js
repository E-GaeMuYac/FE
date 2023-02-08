import axios from 'axios';
import { api, userApi } from '../apis/apiInstance';

import { useMutation, useQuery, useQueryClient } from 'react-query';

// 로그인
const normalLogin = async ({ email, password }) => {
  const data = await api.post(`/api/users/login/normal`, {
    email,
    password,
  });
  return data;
};

// 유저정보조회
const getProfile = async () => {
  const data = await userApi.get('api/users/find');
  return data;
};

// 필너츠꿀팁
const getTips = async () => {
  const data = await api.get('api/posts');
  return data;
};

// 닉네임수정
const editNickname = async (newNickname) => {
  await userApi.put('api/users/update/nickname', {
    nickname: newNickname,
  });
};

// 기본이미지로 변경
const defaultImage = async () => {
  await userApi.put('/api/users/update/image');
};

// presigned url 받기
const getPresignedUrl = async (newImg) => {
  const data = await userApi.put('/api/users/update/image', {
    filename: newImg.name,
  });
  return data;
};

//presigned url로 이미지 보내기
const putS3Upload = async ({ presignedUrl, newImg }) => {
  await axios.put(presignedUrl, newImg);
};

// 회원 탈퇴
const deleteAccount = async (password) => {
  const data = await userApi.delete('/api/users/delete', {
    data: {
      password,
    },
    withCredentials: true,
  });
  return data;
};

// ------------------------------------------------------------------------
export const useGetProfile = (token) => {
  const { data } = useQuery({
    queryKey: ['getProfile', token],
    // query 함수
    queryFn: getProfile,
    enabled: !!token, //enabled=자동실행 !!token=토큰의 값이 있으면 true=>실행
  });
  return { data };
};

export const useGetTips = () => {
  const { data } = useQuery({
    queryKey: ['getTips'],
    queryFn: getTips,
  });
  return { data };
};

export const useEditNickname = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['editNickname'],
    mutationFn: editNickname,
    onSuccess: () => {
      queryClient.invalidateQueries('getProfile');
    },
  });
};

export const useDefaultImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['defaultImage'],
    mutationFn: defaultImage,
    onSuccess: () => {
      queryClient.invalidateQueries('getProfile');
    },
  });
};

export const useGetPresignedUrl = () => {
  return useMutation({
    mutationKey: ['getPresignedUrl'],
    mutationFn: getPresignedUrl,
  });
};

export const usePutS3Upload = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['putS3Upload'],
    mutationFn: putS3Upload,
    onSuccess: () => {
      queryClient.invalidateQueries('getProfile');
    },
  });
};

export const useDeleteAccount = () => {
  return useMutation({
    mutationKey: ['deleteAccount'],
    mutationFn: deleteAccount,
  });
};

export const useNormalLogin = () => {
  return useMutation({
    mutationKey: ['normalLogin'],
    mutationFn: normalLogin,
  });
};
