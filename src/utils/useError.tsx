
import { useNavigate } from 'react-router-dom';
import { refreshTokenApi } from '../api/user';
import routes from '../router';

const useError = () => {
  const navigate = useNavigate();

  const onError = async (response: Response) => {
    if (response.status === 401) {
      const { access_token, refresh_token } = await refreshTokenApi();
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
    }
  };

  return {
    onError,
    afterAllTries: () => navigate(routes.login)
  };
}

export default useError;