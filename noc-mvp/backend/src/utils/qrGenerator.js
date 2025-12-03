const QRCode = require("qrcode");

// Genera un QR code in formato base64 a partire da una stringa (es. URL)
const generateQRCodeImage = async (text) => {
  try {
    return await QRCode.toDataURL(text);
  } catch (err) {
    throw new Error("Failed to generate QR code");
  }
};

module.exports = {
  generateQRCodeImage,
};

