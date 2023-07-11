import storageUtils from './storageUtils';

const authUtils = {
  checkUserAuth: () => {
    const token = storageUtils.getAuthToken();
    return Boolean(token);
  },
  logoutUser: () => {
    storageUtils.removeAuthToken();
    window.location.href = '/signin';
  },
};

export default authUtils;
