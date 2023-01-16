import { userApi } from '../apis/apiInstance';

import { useMutation, useQuery, useQueryClient } from 'react-query';

// api 호출 함수
const getLikeData = async () => {
  const data = await userApi.get(
    `${process.env.REACT_APP_API_ENDPOINT}/api/products/dibs`
  );
  return data;
};
const PutLikeData = async (id) => {
  await userApi.put(
    `${process.env.REACT_APP_API_ENDPOINT}/api/products/${id}/dibs`
  );
};
// ------------------------------------------------------------------------
export const useGetLikeQuery = () => {
  const { data } = useQuery({
    queryKey: ['getLikeData'],
    // query 함수
    queryFn: getLikeData,
  });
  return { data };
};

export const usePutLikeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: PutLikeData,
    onSuccess: () => {
      // 강제로 오래된 데이터로 처리하여 다시 가져오기(무효화)
      queryClient.invalidateQueries('getLikeData');
    },
  });
};
