import { api } from '../apis/apiInstance';

import { useQuery } from 'react-query';

// api 호출 함수
const getDetailData = async (params) => {
  const data = await api.get(`/api/products/${params.queryKey[1]}`);
  return data;
};

// ---------------------------------------------------------------------------------

// query hooks
export const useGetDetailQuery = (medicineId) => {
  const { isSuccess, isError, isLoading, isFetching, data, error } = useQuery({
    // query 키
    queryKey: ['getDetailData', medicineId],
    // query 함수
    queryFn: (params) => {
      return getDetailData(params);
    },
    // 자동 랜더링 삭제
    // enabled: false,
    // 자동 리랜더링 삭제
    // refetchOnWindowFocus: false,
  });
  // if (isFetching) {
  //   console.log('fetching...');
  // }
  // if (isLoading) {
  //   console.log('loading...');
  // }
  // if (isError) {
  //   console.log('error', error);
  // }
  // if (isSuccess) {
  //   console.log('success', data);
  // }

  return data;
};

// query hooks
// export const useGetDetailQuery = () => {
//   const { data } = useQuery({
//     // query 키
//     queryKey: ['getDetailData'],
//     // query 함수
//     queryFn: (params) => {
//       console.log(params);
//       return getDetailData(params);
//     },

//     // 자동 랜더링 삭제
//     enabled: false,
//     // 자동 리랜더링 삭제
//     refetchOnWindowFocus: false,
//     // 성공시 호출
//     onSuccess: (data) => {
//       console.log(data);
//     },
//     //에러 확인
//     onError: (e) => {
//       console.log(e.message);
//     },
//   });

//   return data;
// };
