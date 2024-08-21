import axios from 'axios';

import * as c from '../utils/consts';

export async function createUser(data) {
  try {
    let res = await axios.post(c.CREATE_USER, data);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export async function login(data) {
  try {
    console.log("login api is called");
    console.log("data----->",data);
    console.log("url--->",c.LOGIN);
    
    let res = await axios.post(c.LOGIN, data);
    console.warn('Data in login(): ' + JSON.stringify(data));
    return res;
  } catch (e) {
    // alert(e);
    console.log("error--->",e);
    console.log("error res--->",e.response);
    
    return e.response;
  }
}

export async function forgotPassword(data) {
  try {
    let url = c.FORGOT_PASSWORD + '?userName=' + data.phoneNumber;
    let res = await axios.get(url);
    return res.data;
  } catch (e) {
    // alert(JSON.stringify(e));
    throw handler(e);
  }
}

export async function updateUserInfo(data) {
  try {
    let res = await axios.post(c.UPDATE_USER_INFO, data);

    return res.data;
  } catch (e) {
    alert(e);
    throw handler(e);
  }
}

export async function checkUserExists(userName, data) {
  try {
    const options = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    };
    const url = `${c.CHECK_USER_EXISTS}` + '?userName=' + userName;

    const form_data = new FormData();
    for (let key in data) form_data.append(key, data[key]);

    let res = await axios.get(url, form_data, options);

    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

//ADD_GROUP_TABLE api
export async function addGroupTable(data) {
  try {
    const url = `${c.ADD_TABLE_TO_GROUP}`;
    let res = await axios.put(url, data);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

//RELEASE_TABLE api
export async function releaseTable(data) {
  try {
    const url = `${c.RELEASE_TABLE}`;
    let res = await axios.post(url, data);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export async function getGuestDetail(userName) {
  try {
    const options = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    };
    const url = `${c.GUEST_DETAIL}` + '?userName=' + userName;
    const form_data = new FormData();

    let res = await axios.get(url, userName);

    return res.data;
  } catch (e) {
    alert(e);
    throw handler(e);
  }
}

//waiter Reg
// export async function register(userName, data) {
//   try {
//     const options = {
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'multipart/form-data',
//       },
//     };
//     const url = `${c.REGISTER}` + '?userName=' + userName;
//     let res = await axios.get(url, options);
//     return res.data;
//   } catch (e) {
//     alert(JSON.stringify(e));
//     throw handler(e);
//   }
// }

export async function register(formData) {
  try {
    const url = `${c.REGISTER}`;
    let res = await axios.post(url, formData);
    return res.data;
  } catch (e) {
    // alert(JSON.stringify(e));
    throw handler(e);
  }
}

export async function getTableList(data) {
  try {
    const url = `${c.GET_TABLE_LIST}` + data;
    let res = await axios.get(url);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export async function sendOTP(userName, data) {
  try {
    const options = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    };
    const url = `${c.SEND_OTP}` + '?userName=' + userName;
    const form_data = new FormData();
    let res = await axios.get(url, form_data, options);

    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
export async function sendSMSOTP(data) {
  try {
    const options = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    };
    const url = `${c.SEND_SMS_OTP}`;
    const form_data = new FormData();
    let res = await axios.post(url, data);

    return res.data;
  } catch (e) {
    alert(e);
    throw handler(e);
  }
}

export async function verifyOTP(data) {
  try {
    // const url=`${c.VERIFY_OTP}`+'?userName='+userName+"&otp="+data;
    const url = `${c.MOBILE_VERIFICATION}`;

    let res = await axios.post(url, data);

    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
export async function verifyMOBILEOTP(data) {
  try {
    // const url=`${c.VERIFY_OTP}`+'?userName='+userName+"&otp="+data;
    const url = `${c.VERIFY_MOBILE_OTP}`;

    const form_data = new FormData();
    for (let key in data) form_data.append(key, data[key]);

    let res = await axios.post(url, data);

    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export async function changePassword(data) {
  try {
    let res = await axios.post(c.CHANGE_PASSWORD, data);

    return res;
  } catch (e) {
    if (e.response.status == 400) {
      alert('Please Enter Valid Old Password.');
    } else {
      alert(e);
      throw handler(e);
    }
  }
}

export function handler(err) {
  let error = err;

  if (err.response && err.response.data.hasOwnProperty('message'))
    error = err.response.data;
  else if (!err.hasOwnProperty('message')) error = err.toJSON();

  return new Error(error.response);
}
