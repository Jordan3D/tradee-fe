import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { refreshTokenApi } from '../api/user';
import routes from '../router';

const useError = () => {
  const navigate = useNavigate();
  const {pathname} = useLocation();

  const processError = useCallback(async (response: Response) => {
    if(response.status === 401){
      if(pathname.indexOf(routes.start) === -1){
          const refreshToken = localStorage.getItem('refresh_token');
        if(!refreshToken){
          navigate(routes.start);
        } else {
          const {access_token, refresh_token} = await refreshTokenApi();
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', refresh_token);
        }
      }
    }
  }, [navigate, pathname]);

  return {
    processError
  };
}

export default useError;