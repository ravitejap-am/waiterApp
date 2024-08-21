import React, { Component } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Color from 'color';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';

import ContainedButton from '../../component/buttons/ContainedButton';
import GradientContainer from '../../component/gradientcontainer/GradientContainer';
import UnderlinePasswordInput from '../../component/textinputs/UnderlinePasswordInput';
import UnderlineTextInput from '../../component/textinputs/UnderlineTextInput';
import UnderlinePhoneInput from '../../component/textinputs/UnderlinePhoneInput';
import ActivityIndicatorModal from '../../component/modals/ActivityIndicatorModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Colors from '../../theme/colors';
import Layout from '../../theme/layout';
import * as api from '../../api/AuthService';
import * as appUtil from '../../utils/AppUtil';

// SignIn Config
const PLACEHOLDER_TEXT_COLOR = 'rgba(255, 255, 255, 0.7)';
const INPUT_TEXT_COLOR = '#fff';
const INPUT_BORDER_COLOR = 'rgba(255, 255, 255, 0.4)';
const INPUT_FOCUSED_BORDER_COLOR = '#fff';

// SignIn Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  contentContainerStyle: { flex: 1 },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  form: {
    paddingHorizontal: Layout.LARGE_PADDING,
  },
  inputContainer: { marginBottom: 7 },
  buttonContainer: {
    paddingTop: 23,
  },
  forgotPassword: {
    paddingVertical: 23,
  },
  forgotPasswordText: {
    fontWeight: '400',
    fontSize: 13,
    color: Colors.white,
    textAlign: 'center',
    paddingBottom: 12,
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
  buttonsGroup: {
    paddingTop: 23,
  },
  vSpacer: {
    height: 15,
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
});

// SignIn
class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      emailFocused: false,
      countryCode: 'IN',
      countryCalligCode: '91',
      password: '',
      passwordFocused: false,
      secureTextEntry: true,
      modalVisible: false,
      role: '',
      showView: false
    };
  }

  emailChange = (text) => {
    this.setState({
      email: text,
    });
  };

  emailFocus = () => {
    this.setState({
      emailFocused: true,
      passwordFocused: false,
    });
  };

  passwordChange = (text) => {
    this.setState({
      password: text,
    });
  };

  passwordFocus = () => {
    this.setState({
      passwordFocused: true,
      emailFocused: false,
    });
  };

  onTogglePress = () => {
    const { secureTextEntry } = this.state;
    this.setState({
      secureTextEntry: !secureTextEntry,
    });
  };

  focusOn = (nextFiled) => () => {
    if (nextFiled) {
      nextFiled.focus();
    }
  };

  _bootstrap = async () => {
    const userToken = await AsyncStorage.getItem('userToken');

    this.setState(
      {
        showView: false
      }
    )
    if (userToken) {

      const { navigation } = this.props;
      let user = await AsyncStorage.getItem('userProfile');
      // let restId = await AsyncStorage.getItem('resId');
      // let restaurantId = JSON.parse(restId)
      let userProfile = JSON.parse(user)
      const { dispatch } = this.props;

      // dispatch({ type: 'RESTAURANT_DATA', payload: restaurantId });
      dispatch({
        type: 'SAVE_POST_LOGIN_DATA',
        payload: userProfile
      });
      
      navigation.navigate('HomeNavigator');

    }
    else {
      this.setState(
        {
          showView: true
        })
    }
  }
  componentDidMount() {
    this._bootstrap();

  }
  signIn = async () => {

    this.setState(
      {
        emailFocused: false,
        passwordFocused: false,
      },
      this.login('HomeNavigator'),
      // this.login('Scanner'),
    );
  };

  onSelect = (country) => {
    this.setState({
      countryCode: country.cca2,
      countryCalligCode: country.callingCode,
    });
    console.log(JSON.stringify(country));
  };
  login = screen => async () => {
    const { navigation } = this.props;
    //removing all stored data in fresh login
    AsyncStorage.removeItem("userToken");
    AsyncStorage.removeItem("userProfile");
    AsyncStorage.getAllKeys()
      .then(keys => AsyncStorage.multiRemove(keys))
    const { dispatch } = this.props;
    dispatch({ type: 'RESET' });
    this.setState(
      {
        modalVisible: true,
      },
    )
    let flag = await this.loginApi();
    if (flag) {
      this.setState(
        {
          modalVisible: false,
        },
      )
      navigation.navigate(screen);
    }
    else {
      //this.openAlertModal("We do not recognize your password. Please try again.")
      this.setState(
        {
          modalVisible: false,
        },
      )
      alert("We do not recognize your password. Please try again.")

    }
  };

  loginApi = async () => {
    console.warn('+' + this.state.countryCalligCode + this.state.email);
    let userProfile = {};
    let isAuth = false;
    try {
      let userDetail = {};
      let email = this.state.email;
      let password = this.state.password;
      // '+' + this.state.countryCalligCode + this.state.email;
      userDetail.userName =
        '+' + this.state.countryCalligCode + this.state.email;
      userDetail.password = this.state.password;
      if (email.trim() == '') {
        //this.openAlertModal("Username can't be blank")
        alert("Username can't be blank");
        return false;
      }
      if (password.trim() == '') {
        // this.openAlertModal("password can't be blank")
        alert("password can't be blank");
        return false;
      }
      let response = await api.login(userDetail);
      console.log("Login Response:", response);
      console.log('This is response: ' + JSON.stringify(response));
      // if (response.data.data.userDetail != null) {
      if (response.status == '200') {
        isAuth = true;
        let profile = {};
        if (response.data.data.userDetail != null) {
          let userProfile = response.data.data.userDetail;
          let restaurant = response.data.data.restraunt;
          // await AsyncStorage.setItem('restaurant',restaurant);
          await AsyncStorage.setItem('userProfile', JSON.stringify(userProfile));
          console.log('user Data',JSON.stringify(userProfile));
          const { dispatch } = this.props;
          dispatch({
            type: 'SAVE_POST_LOGIN_DATA',
            payload: userProfile
          });
          dispatch({ type: 'RESTAURANT_DATA', payload: restaurant });
          
          await AsyncStorage.setItem('userToken', response.data.data.token);
          await AsyncStorage.setItem('resId', response.data.data.restraunt.id);
          // await AsyncStorage.setItem('userProfile', JSON.stringify(userProfile));

          // const { dispatch } = this.props;
          // dispatch({
          //   type: 'SAVE_POST_LOGIN_DATA',
          //   payload: userProfile
          // });
        }
        // await AsyncStorage.setItem('userToken', response.data.data.token);
        // await AsyncStorage.setItem('resId', response.data.data.restraunt.id);
        // await AsyncStorage.setItem('userProfile', JSON.stringify(response.data.data.userDetail));
      }
    } catch (error) {
      alert(error);
    }

    //  this.props.navigation.navigate("HomePage")
    return isAuth;
  };

  navigateTo = (screen) => async () => {
    const { navigation } = this.props;
    navigation.navigate(screen);
  };

  render() {
    const {
      emailFocused,
      password,
      passwordFocused,
      secureTextEntry,
      modalVisible,
    } = this.state;
    return (
      <GradientContainer>
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
                {/* <UnderlineTextInput
                  onRef={(r) => {
                    this.email = r;
                  }}
                  onChangeText={this.emailChange}
                  onFocus={this.emailFocus}
                  inputFocused={emailFocused}
                  onSubmitEditing={this.focusOn(this.password)}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  keyboardType="numeric"
                  placeholder="Phone number"
                  placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                  inputTextColor={INPUT_TEXT_COLOR}
                  borderColor={INPUT_BORDER_COLOR}
                  focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                  inputContainerStyle={styles.inputContainer}
                  countryCode={this.state.countryCode}
                /> */}

                <UnderlinePhoneInput
                  onRef={(r) => {
                    this.email = r;
                  }}
                  onChangeText={this.emailChange}
                  onFocus={this.emailFocus}
                  inputFocused={emailFocused}
                  onSubmitEditing={this.focusOn(this.password)}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  keyboardType="numeric"
                  placeholder="Phone number"
                  placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                  inputTextColor={INPUT_TEXT_COLOR}
                  borderColor={INPUT_BORDER_COLOR}
                  focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                  inputContainerStyle={styles.inputContainer}
                  countryCode={this.state.countryCode}
                  onSelect={this.onSelect}
                />

                <UnderlinePasswordInput
                  onRef={(r) => {
                    this.password = r;
                  }}
                  onChangeText={this.passwordChange}
                  onFocus={this.passwordFocus}
                  inputFocused={passwordFocused}
                  onSubmitEditing={this.focusOn(this.signInButton)}
                  returnKeyType="go"
                  placeholder="Password"
                  placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                  inputTextColor={INPUT_TEXT_COLOR}
                  secureTextEntry={secureTextEntry}
                  borderColor={INPUT_BORDER_COLOR}
                  focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                  toggleVisible={password.length > 0}
                  toggleText={secureTextEntry ? 'Show' : 'Hide'}
                  onTogglePress={this.onTogglePress}
                  inputContainerStyle={styles.inputContainer}
                />

                <View style={styles.buttonContainer}>
                  <ContainedButton
                    onRef={(r) => {
                      this.signInButton = r;
                    }}
                    onPress={this.signIn}
                    color={Colors.accentColor}
                    title={'Sign in'.toUpperCase()}
                  />
                </View>

                <View style={styles.forgotPassword}>
                  <Text
                    onPress={this.navigateTo('ForgotPassword')}
                    style={styles.forgotPasswordText}>
                    Forgot password?
                  </Text>
                  <Text
                    onPress={this.navigateTo('SignUp')}
                    style={styles.forgotPasswordText}>
                    Sign Up
                  </Text>
                </View>
              </View>

              <TouchableWithoutFeedback
                onPress={this.navigateTo('TermsConditions')}>
                <View style={styles.footer}>
                  <Text style={styles.footerText}>
                    By signing in, you accepts our
                  </Text>
                  <View style={styles.termsContainer}>
                    <Text style={[styles.footerText, styles.footerLink]}>
                      Terms & Conditions
                    </Text>
                    <Text style={styles.footerText}> and </Text>
                    <Text style={[styles.footerText, styles.footerLink]}>
                      Privacy Policy
                    </Text>
                    <Text style={styles.footerText}>.</Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </KeyboardAwareScrollView>
        </SafeAreaView>
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

  return {
    loggedIn: state.loggedIn,
    profile: state.profile,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps)(SignIn);
