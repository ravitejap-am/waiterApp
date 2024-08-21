import axios from 'axios';

import * as c from '../utils/consts';

export async function addToCart(data) {
  try {
    let res = await axios.post(c.ADD_TO_CART, data);

    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
export async function addGroup(data) {
  try {
    let res = await axios.post(c.ADD_GROUP, data);

    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export async function getOrderDetailsByGroup(data) {
  try {
    const url =
      `${c.GET_ORDER_DETAILS_BY_GROUP}` +
      data.groupNumber +
      '?status=PENDING,CONFIRMED,COMPLETED,DELIVERED,PAID&resId=' +
      data.resId;
    let res = await axios.get(url);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export async function confirmOrder(data) {
  try {
    const url =
      `${c.CONFIRM_ORDER}` + data.groupNumber + '?resId=' + data.resId;
    console.warn(url);
    let res = await axios.get(url);
    // console.warn(res);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export async function completeDine(data) {
  try {
    const url =
      `${c.COMPLETE_DINE}` + data.groupNumber + '?resId=' + data.resId;
    let res = await axios.get(url);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export async function completePayment(data) {
  try {
    const url =
      `${c.COMPLETE_PAYMENT}` + data.groupNumber + '?resId=' + data.resId;
    let res = await axios.get(url);
    // console.warn(res);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export async function waiterOrderTax(data) {
  try {
    let res = await axios.post(c.WAITER_ORDER_TAX, data);
    return res.data;
  } catch (e) {
    alert(e);
    throw handler(e);
  }
}

export async function addMemberToGroup(data) {
  try {
    let res = await axios.post(c.ADD_MEMBER_TO_GROUP, data);

    return res.data;
  } catch (e) {
    alert(e);
    throw handler(e);
  }
}
export async function deleteMemberToGroup(data) {
  try {
    let res = await axios.post(c.DELETE_MEMBER_TO_GROUP, data);

    return res.data;
  } catch (e) {
    alert(e);
    throw handler(e);
  }
}
export async function deleteFromCart(data) {
  try {
    const url =
      `${c.DELETE_FROM_CART}` +
      '?cartId=' +
      data.cartId +
      '&productId=' +
      data.productId;
    let res = await axios.get(url, data);

    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
export async function getCart(data) {
  try {
    const url = `${c.GET_CART}` + '?userId=' + data.customerId;
    let res = await axios.get(url);

    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
export async function getOrderList(data) {
  try {
    const url = `${c.GET_ORDER_LIST}`;
    let res = await axios.post(url, data);

    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export async function getMyResult(data) {
  try {
    const url =
      `${c.GET_RESULT_DETAIL}` +
      '?orderId=' +
      data.orderId +
      '&productId=' +
      data.productId;
    let res = await axios.get(url, data);

    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export async function getOrderDeatil(data) {
  try {
    const url = `${c.GET_ORDER_DETAIL}` + '/' + data.orderId;
    let res = await axios.get(url);

    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
export async function getAllOrdersByRestrauntId(data){
  try{
    const url = `${c.GET_ALL_ORDER_BY_RESTRAUNT}`+ data;
    console.log("url:",url);
    let res = await axios.get(url);
    // console.log("service res:",res);
    return res.data;
  } catch (e) {
    throw handler(e);
  
  }
}
export async function getAllConfirmedOrdersByRestrauntId(data){
  try{
    const url = `${c.GET_ALL_CONFIRMED_ORDER_BY_RESTRAUNT}`+ data;
    console.log("url:",url);
    let res = await axios.get(url);
    // console.log("service res:",res);
    return res.data;
  } catch (e) {
    throw handler(e);
  
  }
}
export async function getAllPendingOrdersByRestrauntId(data){
  try{
    const url = `${c.GET_ALL_PENDING_ORDER_BY_RESTRAUNT}`+ data;
    // console.log("url:",url);
    let res = await axios.get(url);
    // console.log("service res:",res);
    return res.data;
  } catch (e) {
    throw handler(e);
  
  }
}

export async function changeOrderStatus(data) {
  try {
    const url = `${c.CHANGE_ORDER_STATUS}`;
    let res = await axios.put(url, data);
    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export async function getAllOrdersInRange(data) {
  try {
    const url = `${c.GET_ALL_ORDERS_IN_RANGE}`;
    let res = await axios.post(url, data);

    return res.data;
  } catch (e) {
    throw handler(e);
  }
}


export async function checkProductInCart(data) {
  try {
    const url =
      `${c.CHECK_PRODUCT_INCART}` +
      '?userId=' +
      data.userId +
      '&productId=' +
      data.productId;
    let res = await axios.get(url, data);

    return res.data;
  } catch (e) {
    alert(e);
    throw handler(e);
  }
}
export async function checkProductInCartByKey(data) {
  try {
    const url =
      `${c.CHECK_PRODUCT_INCART}` +
      '?userId=' +
      data.userId +
      '&productKey=' +
      data.productKey;
    let res = await axios.get(url, data);

    return res.data;
  } catch (e) {
    alert(e);
    throw handler(e);
  }
}
export async function confirmShippingAddress(data) {
  try {
    const url =
      `${c.CONFIRM_SHIPPING_ADDRESS}` +
      '?userId=' +
      data.userId +
      '&shippingAddressId=' +
      data.shippingAddressId;
    let res = await axios.get(url, data);

    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export async function orderModify(data) {
  try {
    const url = `${c.ORDER_MODIFY}`;
    let res = await axios.post(url, data);

    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export async function getOrderSummary(data) {
  try {
    const url = `${c.GET_ORDER_SUMMARY}` + '?cartId=' + data.cartId;
    let res = await axios.get(url, data);

    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export async function getAvailableTimeSlots(data) {
  try {
    // const url = `${c.GET_CART}` + '?customerId=' + data.customerId+'&promoCode='+data.date;;
    const url = `${c.GET_AVBL_TIME_SLOTS}`;
    let res = await axios.post(url, data);

    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
export async function savePickUpTime(data) {
  try {
    // const url = `${c.GET_CART}` + '?customerId=' + data.customerId+'&promoCode='+data.date;;
    const url = `${c.SAVE_PICKUP_TIME}`;
    let res = await axios.post(url, data);

    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
export async function applyPromoCode(data) {
  try {
    const url =
      `${c.APPLY_PROMO_CODE}` +
      '?userId=' +
      data.customerId +
      '&promoCode=' +
      data.promoCode;
    let res = await axios.get(url, data);

    return res.data;
  } catch (e) {
    throw handler(e);
  }
}

export async function createCharge(data) {
  try {
    const url = `${c.CREATE_CHARGE}`;
    let res = await axios.post(url, data);

    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
export async function createToken(params) {
  try {
    const token = await publishableKey();

    const url = `https://api.stripe.com/v1/tokens`;
    let config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ` + token.data,
      },
    };
    const data = Object.entries(params)
      .map(([key, val]) => `card[${key}]=${encodeURIComponent(val)}`)
      .join('&');
    let res = await axios.post(url, data, config);

    return res.data;
  } catch (e) {
    alert(e);
  }
}
export async function publishableKey() {
  try {
    const url = `${c.STRIPE_KEY}`;
    let res = await axios.get(url);

    return res.data;
  } catch (e) {
    throw handler(e);
  }
}
export function handler(err) {
  let error = err;

  if (err.response && err.response.data.hasOwnProperty('message'))
    error = err.response.data;
  else if (!err.hasOwnProperty('message')) error = err.toJSON();

  return new Error(error.message);
}
