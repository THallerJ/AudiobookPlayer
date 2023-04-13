/* returns last integer in a string, not including integers that appear 
   after a period to account for integers that appear in file extensions (i.e. .mp3) */
const extractLastNumber = (a) => {
  let numStr;

  if (a.includes('.')) {
    numStr = a.substr(0, a.indexOf('.')).match(/\d+$/);
  } else {
    numStr = a.match(/\d+$/);
  }

  return numStr ? Number(numStr[0]) : null;
};

module.exports = {
  extractLastNumber,
};
