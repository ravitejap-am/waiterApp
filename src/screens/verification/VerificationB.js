import React, {Component} from 'react';
import {
  Alert,
  I18nManager,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Color from 'color';

// import components
import ActivityIndicatorModal from '../../component/modals/ActivityIndicatorModal';
import ContainedButton from '../../component/buttons/ContainedButton';
import Button from '../../component/buttons/Button';
import GradientContainer from '../../component/gradientcontainer/GradientContainer';
import {Heading5, Paragraph} from '../../component/text/CustomText';
import NumericKeyboard from '../../component/keyboard/NumericKeyboard';
import SafeAreaView from '../../component/SafeAreaView';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import colors
import Colors from '../../theme/colors';
import {connect} from 'react-redux';
import * as api from '../../api/AuthService';
import * as appUtil from '../../utils/AppUtil';
// VerificationB Config
const isRTL = I18nManager.isRTL;

// VerificationB Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  instructionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {color: Colors.onPrimaryColor},
  instruction: {
    marginTop: 16,
    paddingHorizontal: 40,
    fontSize: 14,
    color: Colors.onSecondaryColor,
    textAlign: 'center',
    opacity: 0.76,
  },
  codeContainer: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 38,
  },
  digitContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    width: 48,
    height: 50,
    borderRadius: 4,
    backgroundColor: Colors.onPrimaryColor,
  },
  digit: {
    fontWeight: '400',
    fontSize: 17,
    color: Colors.onSecondaryColor,
  },
  buttonContainer: {
    marginBottom: 44,
    alignItems: 'center',
  },
  reSendOtpText: {
    marginTop: 15,
    color: Colors.onSecondaryColor,
  },
  resendOTP: {
    textDecorationLine: 'underline',
  },
});

// VerificationB
let userProfileData = {};
let restaurant = {};

class VerificationB extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: userProfileData,
      modalVisible: false,
      pin: '',
      restaurant: restaurant,
    };
  }

  componentWillUnmount() {
    // this.unsubscribe();
    clearTimeout(this.timeout);
  }

  navigateTo = async (screen) => {
    const {navigation} = this.props;
    let otpVerifySuccess = false;
    this.setState({
      modalVisible: true,
    });
    otpVerifySuccess = await this.createAccount();
    if (otpVerifySuccess == true) {
      this.setState({
        modalVisible: false,
      });
      navigation.navigate(screen);
    } else {
      this.setState({
        modalVisible: false,
      });
    }
  };

  createAccount = async () => {
    let otpVerifySuccess = false;
    const pin = this.state.pin;
    if (pin.trim() == '') {
      alert("Access code can't be empty");
    } else {
      try {
        let requestJson = {};
        requestJson.userName = this.state.user.phone;
        requestJson.mobileOTP = this.state.pin;

        console.warn(
          'This is requestJSon in verifyOTP: ' + JSON.stringify(requestJson),
        );
        let response = await api.verifyOTP(requestJson);
        if (response.data == true) {
          console.warn('OTP Verified');
          otpVerifySuccess = true;
          this.createUser();
        } else {
          alert('Access code do not match');
        }
      } catch (e) {
        console.warn('This is error while calling verifyOTP: ' + e);
      }
    }
    return otpVerifySuccess;
  };

  createUser = async () => {
    const {phone, email, password, name} = this.state.user;
    let success = false;
    let userReqObj = {};
    userReqObj.userName = phone;
    userReqObj.newPassword = password;
    userReqObj.firstName = name;
    userReqObj.email = email;
    console.log('This is user: ' + JSON.stringify(userReqObj));
    let response = await api.createUser(userReqObj);
    console.warn(response);
    if (response.data.userDetail != null) {
      console.warn('Inside API');
      success = true;
      let userProfile = response.data.userDetail;

      const {dispatch} = this.props;
      dispatch({type: 'SAVE_POST_LOGIN_DATA', payload: userProfile});
      await AsyncStorage.setItem('userToken', response.data.token);
      await AsyncStorage.setItem('resId', this.state.restaurant.id);
    }
    return success;
  };
  pressKeyboardButton = (keyboardButton) => () => {
    let {pin} = this.state;

    if (keyboardButton === 'backspace') {
      pin = pin.slice(0, -1);
      this.setState({
        pin,
      });
      return;
    }

    if (keyboardButton === 'skip') {
      Alert.alert(
        'Skip verification',
        'You surely want to skip this one?',
        [
          {text: 'Cancel', onPress: () => {}, style: 'cancel'},
          {
            text: 'OK',
            onPress: () => {
              this.navigateTo('HomeNavigator');
            },
          },
        ],
        {cancelable: false},
      );
      return;
    }

    if ((pin + keyboardButton).length > 6) {
      return;
    }

    this.setState({
      pin: pin + keyboardButton,
    });
  };

  submit = (screen) => {
    this.navigateTo('HomeNavigator');
  };

  closeModal = () => {
    // for demo purpose clear timeout if user request close modal before 3s timeout
    clearTimeout(this.timeout);
    this.setState({
      modalVisible: false,
    });
  };

  reSend = async () => {
    let response = await api.register(
      appUtil.getCountryCode() + this.state.phoneNumber,
      'state',
    );
  };

  render() {
    const {modalVisible, pin} = this.state;

    return (
      // <GradientContainer>
      //   <StatusBar
      //     backgroundColor={Colors.primaryColor}
      //     barStyle="light-content"
      //   />

      //   <SafeAreaView style={styles.screenContainer}>
      <GradientContainer>
        <StatusBar
          backgroundColor={Colors.primaryColor}
          barStyle="light-content"
        />
        {/* <SafeAreaView
          // forceInset={{top: 'never'}}
          style={styles.screenContainer}> */}
        <GradientContainer containerStyle={styles.container}>
          <View style={styles.instructionContainer}>
            <Heading5 style={styles.heading}>Verification Code</Heading5>
            <Paragraph style={styles.instruction}>
              Please, enter the verification code sent to{' '}
              {this.state.user.phone}.
            </Paragraph>

            <View style={styles.codeContainer}>
              <View style={styles.digitContainer}>
                <Text style={styles.digit}>{pin[0]}</Text>
              </View>
              <View style={styles.digitContainer}>
                <Text style={styles.digit}>{pin[1]}</Text>
              </View>
              <View style={styles.digitContainer}>
                <Text style={styles.digit}>{pin[2]}</Text>
              </View>
              <View style={styles.digitContainer}>
                <Text style={styles.digit}>{pin[3]}</Text>
              </View>
              <View style={styles.digitContainer}>
                <Text style={styles.digit}>{pin[4]}</Text>
              </View>
              <View style={styles.digitContainer}>
                <Text style={styles.digit}>{pin[5]}</Text>
              </View>
            </View>
            <Text style={styles.reSendOtpText}>
              If you didn't receive a code?{' '}
              <Text onPress={this.reSend} style={styles.resendOTP}>
                Resend
              </Text>
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <ContainedButton
              onPress={this.submit}
              color={Colors.accentColor}
              title={'Create Account'.toUpperCase()}
            />
          </View>

          <NumericKeyboard
            actionButtonTitle="skip"
            onPress={this.pressKeyboardButton}
          />

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
        {/* </SafeAreaView> */}
      </GradientContainer>
    );
  }
}

const mapStateToProps = (state) => {
  restaurant = state.restaurant;

  userProfileData = state.userProfile;

  return {
    // registeruser: state.userProfile,
  };
};

export default connect(mapStateToProps)(VerificationB);
