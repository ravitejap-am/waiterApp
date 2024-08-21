import React, {Component, Fragment} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  FlatList,
  ScrollView,
  View,
} from 'react-native';
import Color from 'color';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

// import components
import ContainedButton from '../../component/buttons/ContainedButton';
import GradientContainer from '../../component/gradientcontainer/GradientContainer';
import UnderlineTextInput from '../../component/textinputs/UnderlineTextInput';
import ActivityIndicatorModal from '../../component/modals/ActivityIndicatorModal';

// import colors, layout
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';

import * as productApi from '../../api/ProductService';

import {connect} from 'react-redux';
import * as appUtil from '../../utils/AppUtil';

import OrderList from '../../component/cards/newItem';
import AsyncStorage from '@react-native-async-storage/async-storage';

// addExtraItems Config
const PLACEHOLDER_TEXT_COLOR = Colors.primaryColor;
const INPUT_TEXT_COLOR = Colors.onPrimaryColor;
const INPUT_BORDER_COLOR = 'rgba(247, 184, 68, 0.4)';
const INPUT_FOCUSED_BORDER_COLOR = 'rgba(247, 184, 68, 1)';

// SignUpB Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  contentContainerStyle: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  form: {
    paddingHorizontal: Layout.LARGE_PADDING,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  inputContainer: {marginBottom: 7},
  inputContainer2: {marginBottom: 7, width: '45%'},

  vSpacer: {
    height: 15,
  },
  buttonContainer: {
    paddingVertical: 23,
    width: '100%',
  },
  buttonsGroup: {
    paddingTop: 23,
  },
  separator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    width: 64,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  orText: {
    top: -2,
    paddingHorizontal: 8,
    color: PLACEHOLDER_TEXT_COLOR,
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    width: '100%',
  },
  termsContainer: {
    flexDirection: 'row',
  },
  footerText: {
    fontWeight: '300',
    fontSize: 13,
    color: Colors.white,
  },
  footerLink: {
    fontWeight: '400',
    textDecorationLine: 'underline',
  },
  taskWrapper: {
    paddingTop: 0,
    paddingHorizontal: 20,
    // height: '120%',
    // marginHorizontal: 20,
    // backgroundColor: 'red',
  },
  items: {
    marginTop: 15,
  },
});

// addExtraItems
let restaurant = {};
let userDetails = {};
class SignUpB extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemName: '',
      itemNameFocused: false,
      itemQuantity: '',
      itemQuantityFocused: false,
      itemPrice: '',
      itemPriceFocused: false,
      secureTextEntry: true,
      modalVisible: false,
      productList: [],
      restaurant: restaurant,
      user: userDetails,
      groupNumber: this.props.route.params.groupNumber,
    };
  }

  itemNameChange = (text) => {
    this.setState({
      itemName: text,
    });
  };
  itemQuantityChange = (text) => {
    this.setState({
      itemQuantity: text,
    });
  };
  itemPriceChange = (text) => {
    this.setState({
      itemPrice: text,
    });
  };

  itemNameFocus = () => {
    this.setState({
      itemNameFocused: true,
      itemQuantityFocused: false,
      itemPriceFocused: false,
    });
  };

  itemQuantityFocus = () => {
    this.setState({
      itemNameFocused: false,
      itemQuantityFocused: true,
      itemPriceFocused: false,
    });
  };

  itemPriceFocus = () => {
    this.setState({
      itemNameFocused: false,
      itemQuantityFocused: false,
      itemPriceFocused: true,
    });
  };

  onTogglePress = () => {
    const {secureTextEntry} = this.state;
    this.setState({
      secureTextEntry: !secureTextEntry,
    });
  };

  addItem = (screen) => async () => {
    const {itemName, itemPrice, itemQuantity} = this.state;
    // let flag = this.validateInput();
    // if (!flag) {
    //   return;
    // }
    let productList = [...this.state.productList];
    let product = {};
    var S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    product.productName = itemName;
    product.productId =
      S4() +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      S4() +
      S4();
    product.quantity = Number(itemQuantity);
    product.price = Number(itemPrice);
    productList.push(product);

    this.setState({
      productList: productList,
    });
    this.itemName.clear();
    this.itemPrice.clear();
    this.itemQuantity.clear();

    console.log(this.state);
    return true;
  };

  navigateTo = (screen) => async () => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };

  validateInput = () => {
    const {itemName, itemQuantity, itemPrice} = this.state;
    let flag = true;

    let validateItemName = appUtil.validateName(itemName);
    if (!(validateItemName == 1)) {
      if (validateItemName == 0) {
        alert('Item Name can not be blank.');
      }
      flag = false;
    }

    let validateItemQuanity = appUtil.validateItemPrice(itemQuantity);
    if (!(validateItemQuanity == 1)) {
      if (validateItemQuanity == 0) {
        alert('Item Quantity can not be blank.');
      }
      flag = false;
    }

    if (itemPrice == null) {
      alert('Item Price can not be blank.');
      flag = false;
    }

    return flag;
  };

  add = () => {
    this.setState(
      {
        itemNameFocused: false,
        itemQuantityFocused: false,
        itemPriceFocused: false,
      },
      this.addItem('Verification'),
    );
  };

  addToOrder = async () => {
    let resId = await AsyncStorage.getItem('resId');
    // console.log("@@@@@@@@@@@ res id :".resId);
    const {navigation} = this.props;
    try {
      const {productList, groupNumber, restaurant, user} = this.state;
      var reqJSON = {};
      reqJSON.orderProducts = productList;
      reqJSON.groupNumber = groupNumber;
      reqJSON.resId = resId;
      reqJSON.userId = user.id;
      console.log("reqJSON :",reqJSON);
      let orderPlaceWaiter = await productApi.orderPlaceWaiter(reqJSON);
      console.log("add item orderPlaceWaiter :",orderPlaceWaiter);
      alert(orderPlaceWaiter.data);
      navigation.navigate('OrderDetail');
    } catch (e) {
      alert(e);
    }
  };
  keyExtractor = (item, index) => index.toString();

  focusOn = (nextFiled) => () => {
    if (nextFiled) {
      a;
      nextFiled.focus();
    }
  };
  onPressDelete = (index) => () => {
    let newProductList = [...this.state.productList];
    newProductList.splice(index, 1);
    this.setState({productList: newProductList});
  };
  onPressAdd = (index) => () => {
    console.warn(index);
    let newProductList = [...this.state.productList];
    let quantity = newProductList[index].quantity + 1;
    newProductList[index].quantity = quantity;
    this.setState({productList: newProductList});
  };
  onPressRemove = (index) => () => {
    console.warn(index);
    let newProductList = [...this.state.productList];
    let quantity = newProductList[index].quantity - 1;
    newProductList[index].quantity = quantity;
    this.setState({productList: newProductList});
  };

  renderProductItem = ({item, index}) => (
    <OrderList
      onPressRemove={this.onPressRemove(index)}
      onPressDelete={this.onPressDelete(index)}
      onPressAdd={this.onPressAdd(index)}
      key={index}
      activeOpacity={0.7}
      quantity={item.quantity}
      title={item.productName}
      price={item.price}
      // swipeoutDisabled
    />
  );

  render() {
    const {
      itemNameFocused,
      itemQuantityFocused,
      itemPriceFocused,
      modalVisible,
      productList,
    } = this.state;

    return (
      <GradientContainer colors={['white', 'white']}>
        <StatusBar
          backgroundColor={Colors.primaryColor}
          barStyle="light-content"
        />

        <SafeAreaView style={styles.screenContainer}>
          <KeyboardAwareScrollView
            contentContainerStyle={styles.contentContainerStyle}>
            <View style={styles.content}>
              <View />
              <View style={styles.form}>
                <UnderlineTextInput
                  onRef={(r) => {
                    this.itemName = r;
                  }}
                  onChangeText={this.itemNameChange}
                  onFocus={this.itemNameFocus}
                  inputFocused={itemNameFocused}
                  onSubmitEditing={this.focusOn(this.itemName)}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  keyboardType="default"
                  placeholder="Item Name"
                  placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                  inputTextColor={INPUT_TEXT_COLOR}
                  borderColor={INPUT_BORDER_COLOR}
                  focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                  inputContainerStyle={styles.inputContainer}
                />

                <UnderlineTextInput
                  onRef={(r) => {
                    this.itemPrice = r;
                  }}
                  onChangeText={this.itemPriceChange}
                  onFocus={this.itemPriceFocus}
                  inputFocused={itemPriceFocused}
                  onSubmitEditing={this.focusOn(this.itemPrice)}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  keyboardType="default"
                  placeholder="Item Price"
                  placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                  inputTextColor={INPUT_TEXT_COLOR}
                  borderColor={INPUT_BORDER_COLOR}
                  focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                  inputContainerStyle={styles.inputContainer2}
                />

                <UnderlineTextInput
                  onRef={(r) => {
                    this.itemQuantity = r;
                  }}
                  onChangeText={this.itemQuantityChange}
                  onFocus={this.itemQuantityFocus}
                  inputFocused={itemQuantityFocused}
                  onSubmitEditing={this.focusOn(this.itemQuantity)}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  keyboardType="default"
                  placeholder="Item Quantity"
                  placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                  inputTextColor={INPUT_TEXT_COLOR}
                  borderColor={INPUT_BORDER_COLOR}
                  focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                  inputContainerStyle={styles.inputContainer2}
                />

                <View style={styles.buttonContainer}>
                  <ContainedButton
                    onPress={this.add}
                    color={Colors.primaryColor}
                    title={'Add'.toUpperCase()}
                  />
                </View>
              </View>
              {/* LISTING OF ITEMS */}
              {productList.length > 0 ? (
                <ScrollView>
                  <Fragment>
                    <FlatList
                      data={productList}
                      keyExtractor={this.keyExtractor}
                      renderItem={this.renderProductItem}
                      ItemSeparatorComponent={this.renderSeparator}
                    />
                  </Fragment>
                </ScrollView>
              ) : (
                <></>
              )}
              {productList.length > 0 ? (
                <View style={styles.form}>
                  <View style={styles.buttonContainer}>
                    <ContainedButton
                      onPress={this.addToOrder}
                      color={Colors.primaryColor}
                      title={'Add to Order'.toUpperCase()}
                    />
                  </View>
                </View>
              ) : (
                <></>
              )}
            </View>
          </KeyboardAwareScrollView>
        </SafeAreaView>
        {/* THIS IS USED TO GET THE LOADING VIEW */}
        <ActivityIndicatorModal
          message="Please wait . . ."
          onRequestClose={this.closeModal}
          statusBarColor={Color(Colors.primaryColor)
            .darken(0.52)
            .rgb()
            .string()}
          title="Loading"
          visible={modalVisible}
        />
      </GradientContainer>
    );
  }
}
const mapStateToProps = (state) => {

  restaurant = state.restaurant;
  userDetails = state.postLoginData;
  return {
    profile: [],
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps)(SignUpB);
