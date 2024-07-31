import { useState } from 'react';

export default function useRequest(request, options) {
  const { baseUrl } = options || {};
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isError, setIsError] = useState(false);

  function run(params) {
    return new Promise((resolve, reject) => {
      setLoading(true);
      params.baseUrl = baseUrl;
      request(params).then(
        res => {
          setLoading(false);
          setIsError(false);
          setResult(res);
          resolve(res);
        },
        () => {
          setIsError(true);
          setLoading(false);
          setResult(null);
          reject(false);
        }
      );
    });
  }

  return {
    run,
    loading,
    isError,
    data: result
  };
}
