import { useQuery } from 'react-query';
import { api } from '../apis/apiInstance';

const getVersusData = async (params) => {
  const data = await api.get(
    `/api/products/compare?compareA=${params.queryKey[1]}&compareB=${params.queryKey[2]}`
  );
  return data;
};

export const useGetVersusQuery = (pillA, pillB) => {
  const { isLoading, data } = useQuery({
    // query 키
    queryKey: ['getVersusData', pillA, pillB],
    // query 함수
    queryFn: (params) => getVersusData(params),
    // 자동 리랜더링 삭제
    refetchOnWindowFocus: false,
    //에러 확인
    onError: () => {
      console.error('Error');
    },
  });

  return { data };
};
