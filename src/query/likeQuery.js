import { userApi } from '../apis/apiInstance';

import { useQuery } from 'react-query';

// api 호출 함수
const getLikeData = async () => {
  const data = await userApi.get(
    `${process.env.REACT_APP_API_ENDPOINT}/api/products/dibs`
  );
  return data;
};

export const useGetLikeQuery = () => {
  const { data } = useQuery({
    queryKey: ['getLikeData'],
    // query 함수
    queryFn: getLikeData,
  });
  return { data };
};
