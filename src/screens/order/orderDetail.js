import React, {Component, Fragment} from 'react';
import {
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
// import components
import Divider from '../../component/divider/Divider';
import TouchableItem from '../../component/TouchableItem';
import ProductCard from '../../component/cards/ProductCard';
import Icon from '../../component/icon/Icon';

import ActivityIndicatorModal from '../../component/modals/ActivityIndicatorModal';
import AddItemModal from '../../component/modals/AddItemModal';
import EmptyState from '../../component/emptystate/EmptyState';
import Button from '../../component/buttons/Button';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Swiper from 'react-native-swiper';
import OrderItem from '../../component/cards/OrderItemAtCheckOutB';
import {Heading6, Subtitle1, Subtitle2} from '../../component/text/CustomText';

// import colors
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';
const EMPTY_STATE_ICON = 'cart-remove';
//api
import * as productApi from '../../api/ProductService';
import * as txnApi from '../../api/TransactionService';
import * as api from '../../api/AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';
// CategoryB Config

const HOME_ICON = 'md-home';

// CategoryB Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  titleText: {
    fontWeight: '700',
  },
  inline: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  subTotalText: {
    top: -2,
    fontWeight: '500',
    color: Colors.onSurface,
  },
  subTotalPriceText: {
    fontWeight: '700',
    color: Colors.primaryColor,
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopRightRadius: 22,
    borderTopLeftRadius: 22,
    width: '100%',
    padding: 16,
    // backgroundColor: '#efefef',
  },
  button: {
    width: '48%',
    margin: 4,
  },
  buttonClose: {
    width: '8%',
    height: '20%',
    borderRadius: 100,
    position: 'absolute',
    top: 10,
    right: 20,
    backgroundColor: 'white',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
    borderRadius: 24,
    width: 34,
    height: 34,
    backgroundColor: Colors.primaryColor,
  },
  modalWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.52)',
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: Layout.SCREEN_WIDTH - 3 * Layout.MEDIUM_MARGIN,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  title: {
    paddingVertical: 8,
    fontWeight: '700',
    fontSize: 15,
    color: '#000',
  },
  message: {
    marginBottom: 15,
    padding: 8,
    fontWeight: '400',
    fontSize: 15,
    color: '#212121',
    textAlign: 'center',
  },
  orderAmountView: {
    borderTopWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 4,
    paddingHorizontal: 20,
    marginHorizontal: 4,
    marginTop: 3,
  },
  orderInfo: {
    paddingVertical: 8,
    textAlign: 'left',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amount: {
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
    color: Colors.primaryColor,
  },
  overline: {
    color: '#b90039',
    // color: Color(Colors.secondaryText).alpha(0.6),
    color: '#b90039',
    textAlign: 'left',
  },
  pt16: {paddingTop: 16},
});
let userProfile = {};
let restaurantData = {};
let orderDetails = {};

// let restaurant = {};
let userDetails = {};
class OrderDetail extends Component {
  constructor(props) {
    super(props);
    this.props.navigation.setOptions({
      title: 'Table ' + this.props.route.params.id,
    });
    this.state = {
      groupNumber: this.props.route.params.groupNumber,
      restaurant: this.props.route.params.restId,
      user: userDetails,
      list: [],
      grandTotal: '0',
      grandTotalSalesTax: '0',
      grandTotalTip: '0',
      orderDetails: orderDetails,
      modalVisible: false,
      addItemModal: false,
      grandTotalServiceCharges:'0',
      grandTotalFee:'0'
    };
  }

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  navigateTo = (screen) => () => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };

  componentDidMount = () => {
    
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.orderList();
    });
  };
  componentWillUnmount() {
    this.unsubscribe();
  }

  orderList = async () => {
    const {navigation} = this.props;
    // console.log("Props :",this.props);
    try {
      const {restaurant, groupNumber} = this.state;
      let productList = [];
      let requestJson = {};
      requestJson.resId = restaurant;
      requestJson.groupNumber = groupNumber;
      let orderRes = await txnApi.getOrderDetailsByGroup(requestJson);
      console.log("orderRes.groupOrderStatus ",orderRes)
      orderRes.productList.map((item, index) => {
        let product = {};
        product.id = item.id;
        product.name = item.name;
        product.description = item.description;
        product.price = item.price;
        product.quantity = item.quantity;
        
        product.status = orderRes.groupOrderStatus;
        productList.push(product);
      });

      this.setState({
        list: productList,
        grandTotal: orderRes.grandTotal,
        grandTotalTip: orderRes.grandTotalTip,
        grandTotalSalesTax: orderRes.grandTotalSalesTax,
        grandTotalServiceCharges:orderRes.grandTotalServiceCharges,
        grandTotalFee:orderRes.grandTotalFee
        // modalVisible: false,
      });
    } catch (e) {
      alert('Customer have not ordered yet.');
      navigation.navigate('Home');
    }
  };

  confirm = async () => {
    let flag = await this.confirmOrder();
    if (flag) {
      this.orderList();
    }
  };

  confirmOrder = async () => {
    let confirm = false;
    try {
      const {restaurant, groupNumber} = this.state;
      let data = {};
      data.groupNumber = groupNumber;
      data.resId = restaurant;
      let confirmOrderResponse = await txnApi.confirmOrder(data);
      if (confirmOrderResponse) {
        confirm = true;
        alert(confirmOrderResponse.data);
      }
    } catch (e) {
      alert(e);
    }
    return confirm;
  };

  dine = async () => {
    let flag = await this.completeDine();
    if (flag) {
      this.orderList();
    }
  };
  completeDine = async () => {
    let completeDine = false;
    try {
      const {restaurant, groupNumber, grandTotalFee,list, grandTotal,grandTotalTip,grandTotalSalesTax,grandTotalServiceCharges} = this.state;
      let data = {};
      data.groupNumber = groupNumber;
      data.resId = restaurant;

      this.props.navigation.navigate('Checkout', {
        total: grandTotal,
        list: list,
        groupNumber: groupNumber,
        restId: restaurant,
        grandTotal: grandTotal,
        grandTotalTip: grandTotalTip,
        grandTotalSalesTax: grandTotalSalesTax,
        grandTotalServiceCharges:grandTotalServiceCharges,
        grandTotalFee:grandTotalFee
      });
    } catch (e) {
      alert(e);
    }
    return completeDine;
  };

  //confirmPayment
  payment = async () => {
    let flag = await this.confirmPayment();
    if (flag) {
      this.orderList();
    }
  };
  confirmPayment = async () => {
    let confirmPayment = false;
    try {
      const {restaurant, groupNumber, list, grandTotal} = this.state;
      let data = {};
      data.groupNumber = groupNumber;
      data.resId = restaurant;
      let confirmPaymentRes = await txnApi.completePayment(data);
      console.log("confirmPaymentRes :",confirmPaymentRes);
      if (confirmPaymentRes) {
        confirmPayment = true;
        alert(confirmPaymentRes.data);
      }
    } catch (e) {
      alert(e);
    }
    return confirmPayment;
  };

  onAddItems = () => {
   // this.setState({addItemModal: true});
    this.props.navigation.navigate('AddExtraItem', {
      groupNumber: this.state.groupNumber,
    });
  };
  releaseTable = async() =>{
    const {navigation} = this.props;
    try{
      let user_Id = await AsyncStorage.getItem("userProfile");
      let userId = JSON.parse(user_Id)
      let tableDetails = this.props.route.params;
      
      let releaseTableJson = {};
      releaseTableJson.resId = tableDetails.restId;
      releaseTableJson.groupNumber = tableDetails.groupNumber;
      releaseTableJson.tableNumber = tableDetails.id;
      releaseTableJson.ownerId = userId.id;
      console.log("releaseTableJson :",releaseTableJson);

      let response = await api.releaseTable(releaseTableJson);
      if (response) {
        alert(response.data);
        navigation.navigate('Home');
      }
    }
    catch(e){
      console.log(e);
    }
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = () => {
    <OrderItem />;
  };
  renderProductItem = ({item, index}) => (
    <ProductCard
      // onPress={this.navigateTo('Product')}
      // onPressRemove={this.onPressRemove(item)}
      // onPressAdd={this.onPressAdd(item)}
      key={index}
      activeOpacity={0.7}
      status={item.status}
      title={item.name}
      price={item.price}
      description={item.description ? item.description : 'N/A'}
      quantity={Number(item.quantity).toFixed(2)}
      swipeoutDisabled
    />
  );

  renderSeparator = () => <Divider type="inset" marginLeft={0} />;

  render() {
    const {
      list,
      grandTotal,
      products,
      groupNumber,
      restId,
      modalVisible,
      addItemModal,
    } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="dark-content"
        />

        <View style={styles.titleContainer}>
          <Heading6 style={styles.titleText}>Order</Heading6>
          <Subtitle1>Total: ${Number(grandTotal).toFixed(2)}</Subtitle1>
          {/* <Button
            socialIconName="home"
            onPress={this.onAddItems}
            buttonStyle={styles.button}
            color={Colors.tertiaryColor}
            rounded
            title=" "
          /> */}
          <TouchableOpacity
            onPress={this.navigateTo('Home')}
            activeOpacity={0.85}>
            <View style={styles.iconContainer}>
              <Icon name={HOME_ICON} size={20} color={Colors.white} />
            </View>
          </TouchableOpacity>
          {/* <Button style={styles.titleText}>Add Items</Button> */}
        </View>

        {this.state.list.length == 0 ? (
          <EmptyState
            showIcon
            iconName={EMPTY_STATE_ICON}
            title="Your Cart is Empty"
            message="Looks like you haven't added anything to your cart yet"
          />
        ) : (
          <Fragment>
            <FlatList
              data={list}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderProductItem}
              ItemSeparatorComponent={this.renderSeparator}
            />
            {this.state.list[0].status == 'COMPLETED' ||
            this.state.list[0].status == 'DELIVERED' ||
            this.state.list[0].status == 'PAID' ? (
              <View style={styles.orderAmountView}>
                <Subtitle2 style={[styles.overline, styles.pt16]}>
                  Your Order
                </Subtitle2>
                <View style={styles.row}>
                  <Subtitle1 style={styles.orderInfo}>Bill amount</Subtitle1>
                  <Subtitle1 style={styles.amount}>
                    ${' '}
                    {Number(grandTotal -this.state.grandTotalSalesTax-this.state.grandTotalFee-this.state.grandTotalServiceCharges-this.state.grandTotalTip).toFixed(
                      2,
                    )}
                  </Subtitle1>
                </View>

                {/* SALES TAX */}
                <View style={styles.row}>
                  <Subtitle1 style={styles.orderInfo}>Sales Tax & Fees</Subtitle1>
                  <Subtitle1 style={styles.amount}>
                    $ {Number(this.state.grandTotalSalesTax+this.state.grandTotalFee).toFixed(2)}
                  </Subtitle1>
                </View>
                <View style={styles.row}>
                  <Subtitle1 style={styles.orderInfo}>Service Charge</Subtitle1>
                  <Subtitle1 style={styles.amount}>
                    $ {Number(this.state.grandTotalServiceCharges).toFixed(2)}
                  </Subtitle1>
                </View>
                {/* TIP */}
                <View style={styles.row}>
                  <Subtitle1 style={styles.orderInfo}>Tip</Subtitle1>
                  <Subtitle1 style={styles.amount}>
                    $ {Number(this.state.grandTotalTip).toFixed(2)}
                  </Subtitle1>
                </View>

                {/* GRAND TOTAL */}
                <View style={styles.row}>
                  <Subtitle1 style={styles.orderInfo}>Total</Subtitle1>
                  <Subtitle1 style={styles.amount}>
                    $ {Number(grandTotal ).toFixed(2)}
                  </Subtitle1>
                </View>
              </View>
            ) : (
              <></>
            )}
            <View style={styles.bottomButtonsContainer}>
                  {this.state.list[0].status !== 'COMPLETED'? (
                    <Button
                    onPress={this.onAddItems}
                    socialIconName="plus"
                    buttonStyle={styles.button}
                    color={Colors.tertiaryColor}
                    rounded
                    title="Add Items"
                    disabled={list[0].status == 'COMPLETED' ? true : false}
                  />
                  ):(
                    <Button
                    onPress={this.releaseTable}
                    buttonStyle={styles.button}
                    color={Colors.tertiaryColor}
                    rounded
                    title="Release Table"
                    disabled={list[0].status == 'PAID' ? true : false}
                  />
                  )
                  }
              {this.state.list[0].status == 'CONFIRMED' ? (
                <Button
                  onPress={this.dine}
                  buttonStyle={styles.button}
                  rounded
                  title="Generate Invoice"
                />
              ) : this.state.list[0].status == 'DELIVERED' ||
                list[0].status == 'PAID' ? (
                <Button
                  onPress={this.payment}
                  buttonStyle={styles.button}
                  // socialIconName="dollar-sign"
                  rounded
                  title="Confirm Payment"
                  // disabled={list[0].status == 'COMPLETED' ? true : false}
                />
              ) : list[0].status == 'COMPLETED' ? (
                <Button
                  buttonStyle={styles.button}
                  rounded
                  title="Paid"
                  disabled
                />
              ) : (
                <Button
                  onPress={this.confirm}
                  buttonStyle={styles.button}
                  rounded
                  title="Confirm"
                />
              )}
            </View>
          </Fragment>
        )}
        <Modal
          animationType="none"
          transparent
          visible={addItemModal}

          // onRequestClose={onRequestClose}
        >
          <StatusBar />
          <View style={styles.modalWrapper}>
            <View style={styles.modalContainer}>
              <Text style={styles.title}>Please select one</Text>
              <Button
                buttonStyle={styles.buttonClose}
                title=" "
                socialIconName="times-circle"
                onPress={() =>
                  this.setState({
                    addItemModal: !addItemModal,
                  })
                }
              />
              <View style={styles.bottomButtonsContainer}>
                <Button
                  title="Current Menu"
                  buttonStyle={styles.button}
                  rounded
                  onPress={() => {
                    this.props.navigation.navigate('AddItems', {
                      groupNumber: groupNumber,
                      restId: restId,
                    });
                    this.setState({
                      addItemModal: !addItemModal,
                    });
                  }}
                />
                <Button
                  title="Add Extra Item"
                  buttonStyle={styles.button}
                  rounded
                  onPress={() => {
                    this.props.navigation.navigate('AddExtraItem', {
                      groupNumber: groupNumber,
                    });
                    this.setState({
                      addItemModal: !addItemModal,
                    });
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>
        <ActivityIndicatorModal
          message="Please wait . . ."
          onRequestClose={this.closeModal}
          statusBarColor={Colors.primaryColor}
          title="Loading.."
          visible={modalVisible}
        />
      </SafeAreaView>
    );
  }
}
const mapStateToProps = (state) => {
  // restaurant = state.restaurant;
  userDetails = state.userDetails;
  return {
    registeruser: state.postLoginData,
  };
};
export default connect(mapStateToProps)(OrderDetail);
