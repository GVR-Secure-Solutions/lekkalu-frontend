const storageUtils = {
  getAuthToken: () => localStorage.getItem('AUTH_TOKEN'),
  removeAuthToken: () => localStorage.removeItem('AUTH_TOKEN'),
  setAuthToken: (key: string) => {
    console.log('set auth token fired!!!');
    localStorage.setItem('AUTH_TOKEN', key);
  },
};

export default storageUtils;
