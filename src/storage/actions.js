// only common actions should be written here module specific actions should be written in the specific modules

export const saveProfile = (profile) => ({
  type: 'SAVE_PROFILE',
  profile
})

export const getProfile = () => ({
  type: 'GET_PROFILE'
})

export const logoutUser = () => ({
  type: 'LOGOUT'
})

export const saveDeviceInfo = (deviceInfo) => ({
  type: 'SAVE_DEVICE_INFO',
  deviceInfo
})

export const savePostLogin = (postLoginData) => ({
  type: 'SAVE_POST_LOGIN_DATA',
  postLoginData
})
export const saveRestaurant = (restaurant) => ({
  type:'RESTAURANT_DATA',
  restaurant,
})

export const resetPostLogin = () => ({
  type: 'RESET_POST_LOGIN_DATA',
})

export const getPostLogin = () => ({
  type: 'GET_POST_LOGIN_DATA',
})











// // only common actions should be written here module specific actions should be written in the specific modules

// export const saveProfile = (profile) => ({
//   type: 'SAVE_PROFILE',
//   profile,
// });

// export const getProfile = () => ({
//   type: 'GET_PROFILE',
// });

// export const logoutUser = () => ({
//   type: 'LOGOUT',
// });

// export const saveDeviceInfo = (deviceInfo) => ({
//   type: 'SAVE_DEVICE_INFO',
//   deviceInfo,
// });

// export const savePostLogin = (postLoginData) => ({
//   type: 'SAVE_POST_LOGIN_DATA',
//   postLoginData,
// });

// export const saveWaiterTip = (waiterTip) => ({
//   type: 'SAVE_WAITER_TIP_DATA',
//   waiterTip,
// });

// export const orderDetailByGroup = (orderDetailByGroup) => ({
//   type: 'SAVE_ORDER_FOR_TABLE',
//   orderDetailByGroup,
// });

// export const resetPostLogin = () => ({
//   type: 'RESET_POST_LOGIN_DATA',
// });

// export const getPostLogin = () => ({
//   type: 'GET_POST_LOGIN_DATA',
// });
