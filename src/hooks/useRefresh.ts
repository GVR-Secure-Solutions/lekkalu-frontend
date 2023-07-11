import axios from 'axios';

import getCookie from '../components/Support/PopUp/utils/GetCookie';
import storageUtils from '../utils/storageUtils';

const useRefreshToken = () => {
  const refresh = async () => {
    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}token/refresh/`,
      JSON.stringify({
        refresh: getCookie('refresh'),
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    storageUtils.setAuthToken(response?.data?.access);

    return response.data?.access;
  };

  return refresh;
};

export default useRefreshToken;
