import { api } from '../apis/apiInstance';

import { useQuery } from 'react-query';

// api 호출 함수
const getSearchData = async (params) => {
  const data = await api.get(
    `/api/products/medicines?type=${params.queryKey[1]}&value=${params.queryKey[2]}&page=${params.queryKey[3]}&pageSize=${params.queryKey[4]}`
  );
  return data;
};

// ---------------------------------------------------------------------------------

// query hooks
export const useGetSearchQuery = (type, value, page, pageSize) => {
  const { refetch, data } = useQuery({
    // query 키
    queryKey: ['getSearchData', type, value, page, pageSize],
    // query 함수
    queryFn: (params) => getSearchData(params),
    // 자동 랜더링 삭제
    enabled: false,
    // 자동 리랜더링 삭제
    refetchOnWindowFocus: false,
    //에러 확인
    onError: () => {
      console.error('Error');
    },
  });
  return { refetch, data };
};