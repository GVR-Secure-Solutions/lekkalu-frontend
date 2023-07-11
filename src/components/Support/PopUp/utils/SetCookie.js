const setCookie = (name, value, daysToLive) => {
  // Encode value in order to escape semicolons, commas, and whitespace
  var cookie = name + '=' + encodeURIComponent(value);

  if (typeof daysToLive === 'number') {
    /* Sets the max-age attribute so that the cookie expires
        after the specified number of days */
    cookie += '; max-age=' + daysToLive * 24 * 60 * 60;

    document.cookie = cookie;
  }
};

export default setCookie;
