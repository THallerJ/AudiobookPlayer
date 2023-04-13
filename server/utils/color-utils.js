const ColorThief = require('colorthief');

const rgbToHex = (r, g, b) => {
  const rgb = [r, g, b];
  const hex = ['#'];

  rgb.forEach((color) => {
    const hexValue = color.toString(16);
    hex.push(hexValue.length === 1 ? `0${hexValue}` : hexValue);
  });

  return hex.join('');
};

const getImageColors = async (imageUrl) => {
  const hexColors = [];

  if (imageUrl) {
    const colors = await ColorThief.getPalette(imageUrl, 2);

    colors.forEach((color) => {
      hexColors.push(rgbToHex(color[0], color[1], color[2]));
    });
  } else {
    hexColors.push('#eeeeee', '#eeeeee');
  }

  return hexColors;
};

module.exports = {
  getImageColors,
};
