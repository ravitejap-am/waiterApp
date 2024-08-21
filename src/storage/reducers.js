// Common Reducers should only be written here module specific reducers should be written in sepcific modules
// Initial State

// Reducers (Modifies The State And Returns A New State)
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGOUT':
      return {
        ...state,
        deviceId: state.deviceId,
        deviceToken: state.deviceToken,
        profile: {},
        loggedIn: false,
        userPinCode: state.userPinCode
      }
    case 'SAVE_PROFILE': {
      return {
        // State
        ...state,
        // Redux Store
        deviceId: state.deviceId,
        deviceToken: state.deviceToken,
        profile: action.profile,
        loggedIn: action.profile.isLoggedIn,
        userPinCode: state.userPinCode
      }
    }
    case 'SAVE_DEVICE_INFO': {
      return {
        // State
        ...state,
        // Redux Store,
        profile: state.profile,
        loggedIn: state.loggedIn,
        deviceId: action.deviceInfo.deviceId,
        deviceToken: action.deviceInfo.deviceToken,
        userPinCode: state.userPinCode
      }
    }
    case 'GET_PROFILE': {
      return state.profile
    }
    case 'SAVE_PIN_CODE': {

      return {
        // State
        ...state,
        // Redux Store
        userPinCode: action.payload
      }
    }
    case 'CART.INCREMENT':
      return {
        ...state,
        cart: {
          ...state.cart,
          cartCount: state.cart.cartCount + 1,
        },
      };

    case 'CART.DECREMENT':
      return {
        ...state,
        cart: {
          ...state.cart,
          cartCount: state.cart.cartCount - 1,
        },
      };
    case 'CART.EMPTY':
      return {
        ...state,
        cart: {
          ...state.cart,
          cartCount: 0,
        },
      };
    case 'CART.ID':
      return {
        ...state,
        cart: {
          ...state.cart,
          cartId: action.payload,
        },
      };
    case 'SAVE_POST_LOGIN_DATA': {
      return {
        // State
        ...state,
        // Redux Store
        /* cart: {
             ...state.cart,
             cartCount: action.payload,
           },*/
           postLoginData: action.payload,
      }
    }
    case 'RESTAURANT_DATA': {
      return {
        ...state,
        restaurant: action.payload,
      };
    }
    case 'SAVE_CART_COUNT_DATA': {
      return {
        // State
        ...state,
        // Redux Store
        cart: {
          ...state.cart,
          cartCount: action.payload,
        },

      }
    }
    case 'SAVE_RESTARAUNT_DATA': {
      return {
        // State
        ...state,
        // Redux Store
        /* cart: {
             ...state.cart,
             cartCount: action.payload,
           },*/
        restarauntData: action.payload,
      }
    }
    case 'SAVE_GROUP_DATA': {

      return {
        // State
        ...state,

        groupData: action.payload,
      }
    }
    case 'PRODUCT_DATA': {
      return {
        // State
        ...state,
        // Redux Store
        /* cart: {
             ...state.cart,
             cartCount: action.payload,
           },*/
        product: action.payload,
      }
    }
    case 'SAVE_PRE_REGISTER_DATA': {
      return {
        // State
        ...state,
        // Redux Store
        userProfile: action.payload,

      }
    }
    case "RESET":
      return {
        apps: {
          notificationCount: 0,
        },
        navigation: {
          notificationCount: 0,
        },

        loggedIn: false,
        profile: {},
        deviceId: "1234",
        deviceToken: "",
        cart: {
          cartCount: 0,
        },
        userPinCode: "NA",
      }
    // Default
    default: {
      return state;
    }
  }
};
// Exports
export default authReducer;


// // Common Reducers should only be written here module specific reducers should be written in sepcific modules
// // Initial State

// // Reducers (Modifies The State And Returns A New State)
// const authReducer = (state = initialState, action) => {
//   switch (action.type) {
//     case 'LOGOUT':
//       return {
//         ...state,
//         deviceId: state.deviceId,
//         deviceToken: state.deviceToken,
//         profile: {},
//         loggedIn: false,
//         userPinCode: state.userPinCode,
//       };
//     case 'SAVE_PROFILE': {
//       return {
//         // State
//         ...state,
//         // Redux Store
//         deviceId: state.deviceId,
//         deviceToken: state.deviceToken,
//         profile: action.profile,
//         loggedIn: action.profile.isLoggedIn,
//         userPinCode: state.userPinCode,
//       };
//     }
//     case 'SAVE_DEVICE_INFO': {
//       return {
//         // State
//         ...state,
//         // Redux Store,
//         profile: state.profile,
//         loggedIn: state.loggedIn,
//         deviceId: action.deviceInfo.deviceId,
//         deviceToken: action.deviceInfo.deviceToken,
//         userPinCode: state.userPinCode,
//       };
//     }
//     case 'GET_PROFILE': {
//       return state.profile;
//     }
//     case 'SAVE_PIN_CODE': {
//       return {
//         // State
//         ...state,
//         // Redux Store
//         userPinCode: action.payload,
//       };
//     }
//     case 'CART.INCREMENT':
//       return {
//         ...state,
//         cart: {
//           ...state.cart,
//           cartCount: state.cart.cartCount + 1,
//         },
//       };

//     case 'CART.DECREMENT':
//       return {
//         ...state,
//         cart: {
//           ...state.cart,
//           cartCount: state.cart.cartCount - 1,
//         },
//       };
//     case 'CART.EMPTY':
//       return {
//         ...state,
//         cart: {
//           ...state.cart,
//           cartCount: 0,
//         },
//       };
//     case 'CART.ID':
//       return {
//         ...state,
//         cart: {
//           ...state.cart,
//           cartId: action.payload,
//         },
//       };
//     case 'SAVE_POST_LOGIN_DATA': {
//       return {
//         // State
//         ...state,
//         // Redux Store
//         /* cart: {
//                         ...state.cart,
//                         cartCount: action.payload,
//                       },*/
//         postLoginData: action.payload,
//       };
//     }
//     case 'SAVE_POST_DATA': {
//       return {
//         ...state,
//         savePostData: action.payload,
//       };
//     }

//     case 'SAVE_RESTARAUNT_DATA': {
//       return {
//         // State
//         ...state,
//         // Redux Store
//         /* cart: {
//                       ...state.cart,
//                       cartCount: action.payload,
//                     },*/
//         restarauntData: action.payload,
//       };
//     }
//     case 'SAVE_ORDER_FOR_TABLE': {
//       return {
//         ...state,
//         orderDetailByGroup: action.payload,
//       };
//     }
//     case 'SAVE_PRE_REGISTER_DATA': {
//       return {
//         // State
//         ...state,
//         // Redux Store
//         userProfile: action.payload,
//       };
//     }
//     case 'RESTAURANT_DATA': {
//       return {
//         ...state,
//         restaurant: action.payload,
//       };
//     }
//     case 'USER_DETAILS': {
//       return {
//         ...state,
//         userDetails: action.payload,
//       };
//     }
//     case 'SAVE_WAITER_TIP_DATA': {
//       return {
//         ...state,
//         waiterTip: action.payload,
//       };
//     }

//     // Default
//     default: {
//       return state;
//     }
//   }
// };
// // Exports
// export default authReducer;
