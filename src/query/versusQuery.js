import { useQuery } from 'react-query';
import { userApi } from '../apis/apiInstance';

const getVersusData = async (params) => {
  const data = await userApi.get(
    `/api/products/compare?compareA=${params.queryKey[1]}&compareB=${params.queryKey[2]}`
  );
  return data;
};

export const useGetVersusQuery = (pillA, pillB) => {
  const { refetch, isLoading, data } = useQuery({
    // query 키
    queryKey: ['getVersusData', pillA, pillB],
    // query 함수
    queryFn: (params) => getVersusData(params),

    enabled: false,
    // 자동 리랜더링 삭제
    refetchOnWindowFocus: false,
  });

  return { refetch, isLoading, data };
};
