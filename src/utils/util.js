import QRCode from 'qrcode';

// 生成二维码图片
const getNewQrImg = url => {
  return QRCode.toDataURL(url);
};

export { getNewQrImg };
