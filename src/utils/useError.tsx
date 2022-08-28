
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { refreshTokenApi } from '../api/user';
import routes from '../router';

const useError = () => {
  const navigate = useNavigate();

  const onError = useCallback( async (response: Response) => {
    if (response.status === 401) {
      const { access_token, refresh_token } = await refreshTokenApi();
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
    }
  }, []);

  const result = useMemo(() => ({
    onError,
    afterAllTries: () => navigate(routes.login)
  }), [onError, navigate])

  return result;
}

export default useError;