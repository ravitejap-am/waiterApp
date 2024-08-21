import React, {Component, Fragment} from 'react';
import {
  FlatList,
  I18nManager,
  Platform,
  ScrollView,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
} from 'react-native';
import Color from 'color';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Swiper from 'react-native-swiper';
import {connect} from 'react-redux';

// import components
import Button from '../../component/buttons/Button';
import CreditCard from '../../component/creditcard/CreditCard';
import InfoModal from '../../component/modals/InfoModal';
import LinkButton from '../../component/buttons/LinkButton';
import {Caption, Subtitle1, Subtitle2} from '../../component/text/CustomText';
import InvoiceItem from '../../component/cards/InvoiceItem';
import UnderlinePhoneInput from '../../component/textinputs/UnderlinePhoneInput';
import UnderlineTextInput from '../../component/textinputs/UnderlineTextInput';
import * as txnApi from '../../api/TransactionService';
import * as c from '../../utils/consts';

// import colors
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';

// CheckoutB Config
const PLACEHOLDER_TEXT_COLOR = Colors.primaryColor;
const INPUT_TEXT_COLOR = Colors.primaryColor;
const INPUT_BORDER_COLOR = Colors.primaryColor;
const INPUT_FOCUSED_BORDER_COLOR = Colors.primaryColor;
const isRTL = I18nManager.isRTL;
// const INPUT_FOCUSED_BORDER_COLOR = Colors.primaryColor;
const CHECKMARK_ICON =
  Platform.OS === 'ios'
    ? 'ios-checkmark-circle-outline'
    : 'md-checkmark-circle-outline';

// CheckoutB Styles
const styles = StyleSheet.create({
  pt16: {paddingTop: 16},
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: Colors.primaryColor,
    elevation: 1,
    ...Platform.select({
      ios: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#a7a7aa',
      },
    }),
  },
  inputContainer: {
    paddingTop: 5,
    // position: 'absolute',
    // bottom: 0,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
  },
  stepContainer: {
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepText: {
    fontWeight: '700',
    color: '#fff',
    // color: Color(Colors.onPrimaryColor).alpha(0.64),
  },
  activeStepText: {
    color: Colors.onPrimaryColor,
  },
  line: {
    width: 48,
    height: 2,
    backgroundColor: '#fff',
    // backgroundColor: Color(Colors.onPrimaryColor).alpha(0.32),
  },
  activeLine: {
    backgroundColor: Colors.onPrimaryColor,
  },
  swiperContainer: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
  },
  // form: {
  //   // paddingVertical: 8,
  //   paddingHorizontal: 20,

  // },
  form: {
    paddingHorizontal: Layout.LARGE_PADDING,
    height: '20%',
  },
  orderAmountView: {
    paddingHorizontal: 20,
    marginTop: -60,
    paddingBottom: 0,
  },
  item: {
    paddingHorizontal: 20,
    marginTop: -30,
    height: '30%',
  },
  overline: {
    color: '#b90039',
    // color: Color(Colors.secondaryText).alpha(0.6),
    color: '#b90039',
    textAlign: 'left',
  },
  inputContainerStyle: {
    marginTop: 0,
    marginBottom: 18,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  actionButton: {
    color: Colors.accentColor,
    textAlign: 'center',
  },
  buttonContainer: {
    paddingTop: 16,
    paddingHorizontal: 24,
    // paddingBottom: 24,
    backgroundColor: Colors.background,
  },

  linkButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
  },
  linkButton: {
    color: Colors.black,
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
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 24,
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
  contentContainerStyle: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
});

// CheckoutB
class CheckoutB extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total: this.props.route.params.total,
      groupNumber: this.props.route.params.groupNumber,
      restId: this.props.route.params.restId,
      activeIndex: 1,
      phoneFocused: false,
      infoModalVisible: false,
      list: this.props.route.params.list,
      sales: `${c.SALES_TAX}`,
      salesFocused: false,
      tip: '0',
      tipFocused: false,
      grandTotal: this.props.route.params.total,
      salesTax: this.props.route.params.grandTotalSalesTax,
      grandTotalServiceCharges:this.props.route.params.grandTotalServiceCharges,
      grandTotalFee:this.props.route.params.grandTotalFee
    };
  }

  componentDidMount(){
    const {total} = this.state;
    
  }

  salesChange = (text) => {
    const {sales, total} = this.state;
    this.setState({
      sales: text,
    });
    // if (sales != 0) {
    //   grandTotal = total + (total * sales) / 100;
    //   this.setState({
    //     grandTotal: grandTotal,1
    //   });
    // }
  };

  salesFocus = () => {
    this.setState({
      salesFocused: true,
      tipFocused: false,
    });
  };

  onBlurSales = () => {
    const {sales, tip, total, grandTotal} = this.state;
    if (sales > 0 || tip > 0) {
      const gTotal = Number(
        total + (sales * total) / 100 + Number(tip),
      ).toFixed(2);
      this.setState({
        grandTotal: gTotal + '',
        salesTax: (sales * total) / 100,
      });
    } else {
      const gTotal = Number(total).toFixed(2);
      this.setState({
        grandTotal: gTotal + '',
        salesTax: 0,
        tip: 0,
      });
    }
  };

  tipChange = (text) => {
    this.setState({
      tip: text,
    });
  };

  tipFocus = (event) => {
    this.setState({
      salesFocused: false,
      tipFocused: true,
    });
  };

  navigateTo = (screen) => () => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  clearInputs = () => {
    this.address.clear();
    this.city.clear();
    this.zip.clear();
  };

  focusOn = (nextFiled) => () => {
    if (nextFiled) {
      nextFiled.focus();
    }
  };

  onIndexChanged = (index) => {
    let activeIndex;
    if (isRTL) {
      activeIndex = 2 - index; // 2 = 3 steps - 1
    } else {
      activeIndex = index;
    }
    this.setState({
      activeIndex: activeIndex,
    });
  };

  nextStep = () => {
    this.swiper.scrollBy(1, true);
  };

  previousStep = () => {
    this.swiper.scrollBy(0, true);
  };

  showInfoModal = (value) => () => {
    this.setState({
      infoModalVisible: value,
    });
  };

  closeInfoModal = (value) => () => {
    this.setState(
      {
        infoModalVisible: value,
      },
      () => {
        this.goBack();
      },
    );
  };

  confirm = async () => {
    let flag = false
   
     // let resId = this.state.restId
      const {groupNumber, restId, tip, sales} = this.state;
  
      try {
        let data = {};
        data.groupNo = groupNumber;
        data.resId = restId;
        data.status = "DELIVERED"
        console.log("requestJson :", data);
        let confirmOrderRes = await txnApi.changeOrderStatus(data);
        flag = true
        console.log("confirmOrderRes :", confirmOrderRes);
        
      } catch (e) {
        alert(e);
      }
      
    
    if (flag) {
      const {navigation} = this.props;
      const grandTotal = this.state.total + this.state.salesTax;
      const waiterData = {};
      waiterData.salesTax = this.state.salesTax;
     // waiterData.serviceCharge=10;
      waiterData.tip = this.state.tip;
      waiterData.grandTotal = grandTotal;
      waiterData.invoiceGenerated = true;
      navigation.navigate('OrderDetail', {
        waiterData: waiterData,
      });
    }
  };

  confirmSalesTip = async () => {
    let confirmSalesTip = false;
    const {groupNumber, restId, tip, sales} = this.state;
    try {
      let data = {};
      data.groupNumber = groupNumber;
      data.resId = restId;
      data.tip = Number(tip);
      data.tax = Number(sales);
      let waiterOrderTaxRes = await txnApi.waiterOrderTax(data);
      if (waiterOrderTaxRes) {
        confirmSalesTip = true;
        alert(waiterOrderTaxRes.data);
      }
    } catch (e) {
      alert(e);
    }
    return confirmSalesTip;
  };

  renderItem = () => {
    <InvoiceItem />;
  };

  renderProductItem = ({item, index}) => (
    <InvoiceItem
      key={index}
      activeOpacity={0.7}
      status={item.status}
      title={item.name}
      price={item.price}
      description={item.description ? item.description : 'N/A'}
      quantity={Number(item.quantity).toFixed(2)}
      // NewItems={this.state.list}
      orderStatus="Active"
      swipeoutDisabled
    />
  );
 

  render() {
    const {
      activeIndex,
      address,
      addressFocused,
      city,
      tipFocused,
      salesFocused,
      infoModalVisible,
      list,
    } = this.state;
    // console.log("this.props.route.params.total :",this.props.route.params.total);
    return (
      <SafeAreaView style={styles.screenContainer}>
        <StatusBar
          backgroundColor={Colors.primaryColor}
          barStyle="light-content"
        />
        {/* <ScrollView> */}

        <KeyboardAwareScrollView
          contentContainerStyle={styles.contentContainerStyle}>
          <View style={styles.content}>
            <View />

            <Fragment>
              <View style={styles.item}>
                <Subtitle1 style={[styles.overline]}>Items</Subtitle1>
                <FlatList
                  data={list}
                  keyExtractor={this.keyExtractor}
                  renderItem={this.renderProductItem}
                  ItemSeparatorComponent={this.renderSeparator}
                />
                <Subtitle2 style={[styles.overline, styles.pt16]}>
                  Your Order
                </Subtitle2>
                <View style={styles.row}>
                  <Subtitle1 style={styles.orderInfo}>Bill amount</Subtitle1>
                  <Subtitle1 style={styles.amount}>
                    $ {Number(this.state.total-this.state.salesTax-this.state.grandTotalFee-this.state.grandTotalServiceCharges).toFixed(2)}
                  </Subtitle1>
                </View>
                <View style={styles.row}>
                  <Subtitle1 style={styles.orderInfo}>Sales Tax & Fee</Subtitle1>
                  <Subtitle1 style={styles.amount}>
                    $ {Number(this.state.salesTax+this.state.grandTotalFee).toFixed(2)}
                    {/* <Text>$ 8.75 %</Text> */}
                  </Subtitle1>
                </View>

                {/* TIP */}
                <View style={styles.row}>
                  <Subtitle1 style={styles.orderInfo}>Service Charge</Subtitle1>
                  <Subtitle1 style={styles.amount}>
                    $ {Number(this.state.grandTotalServiceCharges).toFixed(2)}
                  </Subtitle1>
                </View>
              </View>

              {/* YOUR ORDER */}
              <View style={styles.item}>
                

                {/* SALES TAX */}
                

                {/* GRAND TOTAL */}
                <View style={styles.row}>
                  <Subtitle1 style={[styles.overline, styles.pt16]}>Total</Subtitle1>
                  <Subtitle1 style={styles.amount}>
                    $ {Number(this.state.grandTotal).toFixed(2)}
                  </Subtitle1>
                </View>

                {/* FORM FOR TIP AND TAX */}
              { /* <UnderlineTextInput
                  onRef={(r) => {
                    this.sales = r;
                  }}
                  onChangeText={this.salesChange}
                  onFocus={this.salesFocus}
                  inputFocused={salesFocused}
                  // onSubmitEditing={this.focusOn(this.url)}
                  onBlur={this.onBlurSales}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  keyboardType="phone-pad"
                  placeholder="Enter Sales Tax"
                  placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                  // placeholderTextColor="black"
                  inputTextColor={INPUT_TEXT_COLOR}
                  borderColor={INPUT_BORDER_COLOR}
                  focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                  inputContainerStyle={styles.inputContainer}
                />
                <UnderlineTextInput
                  onRef={(r) => {
                    this.tip = r;
                  }}
                  onChangeText={this.tipChange}
                  onFocus={(e) => this.tipFocus(e)}
                  inputFocused={tipFocused}
                  // onSubmitEditing={this.focusOn(this.url)}
                  onBlur={this.onBlurSales}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  keyboardType="phone-pad"
                  placeholder="Enter Tip"
                  placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                  inputTextColor={INPUT_TEXT_COLOR}
                  borderColor={INPUT_BORDER_COLOR}
                  focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                  inputContainerStyle={styles.inputContainer}
                />*/}
              </View>
              {/* <View style={{height: 100}} /> */}
            </Fragment>
            {/* </Swiper> */}

            <View style={styles.buttonContainer}>
              <Button onPress={this.confirm} title="Confirm" rounded />

              <View style={styles.linkButtonContainer}>
                <LinkButton
                  onPress={this.goBack}
                  title="Cancel"
                  titleStyle={styles.linkButton}
                />
              </View>
            </View>

            <InfoModal
              statusBarColor={Color(Colors.primaryColor)
                .darken(0.52)
                .rgb()
                .string()}
              iconName={CHECKMARK_ICON}
              iconColor={Colors.primaryColor}
              title={'Success!'.toUpperCase()}
              message="Order placed successfully. For more details check your orders."
              buttonTitle="Back to shopping"
              onButtonPress={this.closeInfoModal(false)}
              onRequestClose={this.closeInfoModal(false)}
              visible={infoModalVisible}
            />
          </View>
        </KeyboardAwareScrollView>

        {/* <KeyboardAwareScrollView
          // extraScrollHeight="4"
          behavior="position"
          keyboardVerticalOffset={1200}
          contentContainerStyle={
            styles.contentContainerStyle
          }></KeyboardAwareScrollView> */}
      </SafeAreaView>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    waiterData: state.waiterData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps)(CheckoutB);
