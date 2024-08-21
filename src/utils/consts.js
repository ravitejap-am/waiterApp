import React from 'react';

//API URL
//export const API_URL = 'https://mesannodejsapiwithverification.herokuapp.com/api';
// export const API_URL = 'http://3.86.104.23:8080/app/api';
export const API_URL = 'http://16.170.235.205:8080/app/api';
export const SALES_TAX = 8.875;

//export const API_URL = 'https://apis.numihealth.com/mobile/api';

//API End Points
//WAITER

// export const API_URL = 'http://3.86.104.23:8080/app/api';
// http://3.86.104.23:8080/app/api/restrauntDetails/registerWaiter
//export const API_URL = 'https://apis.numihealth.com/mobile/api';

//API End Points
//WAITER

// export const REGISTER = `${API_URL}/auth/register`;
export const REGISTER = `${API_URL}/restrauntDetails/registerWaiter`;

// export const REGISTER = `${API_URL}/auth/register`;

export const VERIFY_OTP = `${API_URL}/common/verifyOTP`;
export const CREATE_USER = `${API_URL}/user/createUser`;
export const ADD_TABLE_TO_GROUP = `${API_URL}/restrauntGroup/addGroupTable`;
export const RELEASE_TABLE = `${API_URL}/restrauntGroup/releaseTable`;
export const GET_TABLE_LIST = `${API_URL}/restrauntGroup/getTableList/`;
export const GET_ORDER_DETAILS_BY_GROUP = `${API_URL}/order/getOrderDetailsByGroup/`;
export const CONFIRM_ORDER = `${API_URL}/order/confirmOrder/`;
export const COMPLETE_DINE = `${API_URL}/order/completeDine/`;
export const COMPLETE_PAYMENT = `${API_URL}/order/completePayment/`;
export const FORGOT_PASSWORD = `${API_URL}/user/forgotPassword`;
export const GET_ALL_CONFIRMED_ORDER_BY_RESTRAUNT = `${API_URL}/order/getAllOrdersByRestrauntId?status=CONFIRMED&resId=`;
export const GET_ALL_PENDING_ORDER_BY_RESTRAUNT = `${API_URL}/order/getAllOrdersByRestrauntId?status=PENDING&resId=`;
export const GET_ALL_ORDER_BY_RESTRAUNT = `${API_URL}/order/getAllOrdersByRestrauntId?status=PAID,COMPLETED,READY,PENDING,CONFIRMED,CANCEL,DELIVERED&resId=`;
export const CHANGE_ORDER_STATUS = `${API_URL}/order/updateOrderStatus`;
export const GET_ALL_ORDERS_IN_RANGE = `${API_URL}/order/getAllOrdersInRange`;

export const SEND_OTP = `${API_URL}/common/sendOTP`;
export const SEND_SMS_OTP = `${API_URL}/common/sendOTPSMS`;
export const VERIFY_MOBILE_OTP = `${API_URL}/common/verifyOTPSMS`;
export const MOBILE_VERIFICATION = `${API_URL}/common/mobileVerification`;
export const LOGIN = `${API_URL}/auth/waiterLogin`;
// export const LOGIN = `${API_URL}/auth/login`;
export const ORDER_PLACE_WAITER = `${API_URL}/order/orderPlaceWaiter`;
export const UPLOAD_IMAGE = `${API_URL}/user/upload`;
export const CHECK_USER_EXISTS = `${API_URL}/auth/checkUserExists`;
export const GUEST_DETAIL = `${API_URL}/user/getGuestDetail`;

export const UPDATE_USER_INFO = `${API_URL}/user/updateUserInfo`;
export const GET_ALL_TESTS = `${API_URL}/productCategory/getAllCategories`;
export const CHECK_SERVICEABILITY_AREA = `${API_URL}/coverageArea/getServiceability`;
export const GET_ALLCOVERAGE_ZONE = `${API_URL}/coverageArea/getAllCoverageZones`;
export const SAVE_ADDRESS = `${API_URL}/address/save`;
export const ADD_TO_CART = `${API_URL}/cart/addToCart`;
export const GET_CART = `${API_URL}/cart/getCart`;
export const CHANGE_PASSWORD = `${API_URL}/user/changePassword`;
export const CREATE_CHARGE = `${API_URL}/order/orderPlace`;
export const APPLY_PROMO_CODE = `${API_URL}/cart/getVarifyPromocode`;
export const DELETE_FROM_CART = `${API_URL}/cart/deleteFromCart`;
export const GET_AVBL_TIME_SLOTS = `${API_URL}/timeSlot/getAvailableTimeSlot`;
export const SAVE_PICKUP_TIME = `${API_URL}/appointment/save`;
export const GET_ORDER_SUMMARY = `${API_URL}/order/confirmOrder`;
export const CONFIRM_SHIPPING_ADDRESS = `${API_URL}/cart/confirmShippingAddress`;
export const UPLOAD_IMAGE_LAB_REQUISITION = `${API_URL}/labRequisition/save`;
export const GET_SETTINGS = `${API_URL}/setting/getSetting`;
export const CHECK_PRODUCT_INCART = `${API_URL}/cart/isProductExistInCart`;
export const DELETE_LAB_REQUISITION = `${API_URL}/labRequisition/deleteLabRequisition/`;
export const GET_TESTS_BY_CATEGORY = `${API_URL}/product/getProductsByCategory/`;
export const GET_RESTAURANT_BY_URL = `${API_URL}/restraunt/getRestrauntByUrl?url=`;
export const ADD_GROUP = `${API_URL}/restrauntGroup/addGroup`;
export const WAITER_ORDER_TAX = `${API_URL}/order/waiterOrderTax`;

export const ADD_MEMBER_TO_GROUP = `${API_URL}/restrauntGroup/addGroupMember`;
export const DELETE_MEMBER_TO_GROUP = `${API_URL}/restrauntGroup/removeGroupMemberByUserId`;
export const GET_MENU_BY_RESTAURANT = `${API_URL}/product/getProductsByRestraunt/`;
export const GET_MENU_CATEGORIES_BY_RESTAURANT = `${API_URL}/productCategory/getCategoriesByRestraunt/`;
export const STRIPE_KEY = `${API_URL}/stripe/publishKey`;
export const GET_ORDER_LIST = `${API_URL}/order/orderList`;
export const GET_ORDER_DETAIL = `${API_URL}/order/getMyOrderDetail`;
export const CANCEL_ORDER = `${API_URL}/order/cancelOrder`;
export const ORDER_MODIFY = `${API_URL}/order/orderModify`;
export const GET_RESULT_DETAIL = `${API_URL}/orderResult/resultDetail`;
export const DOWNLOAD_IMAGE_LAB_REQUISITION = `${API_URL}/labRequisition/downloadLabRequisition`;
