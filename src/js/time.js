function time() {
  const time = new Date(); // eslint-disable-line
  const date = time.getDate();
  const month = time.getMonth();
  const year = time.getFullYear();
  const hours = time.getHours();
  const minutes = time.getMinutes();

  function convert(param) {
    if (param < 10) {
      return `0${param}`;
    }
    return param;
  }

  return `${convert(date)}.${convert(month)}.${year} ${convert(hours)}:${convert(minutes)}`;
}

export { time }; // eslint-disable-line
