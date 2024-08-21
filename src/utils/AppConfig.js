const APP_CONFIG = {
  localRefreshTime: 3600000,
};

const RegEx = {
  email: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
  number: /^(\+{0,1}?[0-9]{1,3}\-{0,1}?\ {0,1}?)?[0-9]{9,11}$/,
  address: /^[a-zA-Z\s\d\/.#:\-;,'\\ ]+$/,
  name: /^[a-zA-Z ]+$/,
  city: /^[a-zA-Z . 0-9]+$/,
  mobileNumber: /^(\+{0,1}?[0-9]{1,3}\-{0,1}?\ {0,1}?)?[0-9]{9,11}$/,
  numberFormat: /^[0-9 ]+$/,
  message: /^[a-zA-Z\s\d . -]+$/,
  couponCode: /^[A-Z0-9-]+$/,
  password: /^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,32}$/,
  url: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/,
  // url: /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm,
};

export {APP_CONFIG, RegEx};
