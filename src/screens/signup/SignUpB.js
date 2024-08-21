import React, {Component} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Color from 'color';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

// import components
import ContainedButton from '../../component/buttons/ContainedButton';
import GradientContainer from '../../component/gradientcontainer/GradientContainer';
import UnderlinePasswordInput from '../../component/textinputs/UnderlinePasswordInput';
import UnderlinePhoneInput from '../../component/textinputs/UnderlinePhoneInput';
import UnderlineTextInput from '../../component/textinputs/UnderlineTextInput';
import ActivityIndicatorModal from '../../component/modals/ActivityIndicatorModal';

// import colors, layout
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';

import * as api from '../../api/AuthService';
import {connect} from 'react-redux';
import * as appUtil from '../../utils/AppUtil';
// SignUpB Config
const PLACEHOLDER_TEXT_COLOR = 'rgba(255, 255, 255, 0.7)';
const INPUT_TEXT_COLOR = '#fff';
const INPUT_BORDER_COLOR = 'rgba(255, 255, 255, 0.4)';
const INPUT_FOCUSED_BORDER_COLOR = '#fff';

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
    justifyContent: 'space-between',
  },
  form: {
    paddingHorizontal: Layout.LARGE_PADDING,
  },
  inputContainer: {marginBottom: 7},
  vSpacer: {
    height: 15,
  },
  buttonContainer: {
    paddingVertical: 23,
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
});

// SignUpB
class SignUpB extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ownerName: '',
      ownerNameFocused: false,
      restrauntName: '',
      restrauntNameFocused: false,
      email: '',
      emailFocused: false,
      countryCode: 'US',
      countryCalligCode: '1',
      phone: '',
      phoneFocused: false,
      url: '',
      urlFocused: false,
      password: '',
      passwordFocused: false,
      secureTextEntry: true,
      modalVisible: false,
      obj: [],
    };
  }

  ownerNameChange = (text) => {
    this.setState({
      ownerName: text,
    });
  };

  ownerNameFocus = () => {
    this.setState({
      ownerNameFocused: true,
      restrauntNameFocused: false,
      emailFocused: false,
      phoneFocused: false,
      urlFocused: false,
      passwordFocused: false,
    });
  };

  restrauntNameChange = (text) => {
    this.setState({
      restrauntName: text,
    });
  };

  restrauntNameFocus = () => {
    this.setState({
      ownerNameFocused: false,
      restrauntNameFocused: true,
      emailFocused: false,
      phoneFocused: false,
      urlFocused: false,
      passwordFocused: false,
    });
  };

  emailChange = (text) => {
    this.setState({
      email: text,
    });
  };

  emailFocus = () => {
    this.setState({
      ownerNameFocused: false,
      restrauntNameFocused: false,
      emailFocused: true,
      phoneFocused: false,
      urlFocused: false,
      passwordFocused: false,
    });
  };

  phoneChange = (text) => {
    this.setState({
      phone: text,
    });
  };

  phoneFocus = () => {
    this.setState({
      ownerNameFocused: false,
      restrauntNameFocused: false,
      emailFocused: false,
      phoneFocused: true,
      urlFocused: false,
      passwordFocused: false,
    });
  };

  // phoneChange = (text) => {
  //   this.setState({
  //     phone: text,
  //   });
  // };

  // phoneFocus = () => {
  //   this.setState({
  //     ownerNameFocused: false,
  //     restrauntNameFocused: false,
  //     emailFocused: false,
  //     phoneFocused: true,
  //     urlFocused: false,
  //     passwordFocused: false,
  //   });
  // };

  urlChange = (text) => {
    this.setState({
      url: text,
    });
  };

  urlFocus = () => {
    this.setState({
      ownerNameFocused: false,
      restrauntNameFocused: false,
      emailFocused: false,
      phoneFocused: false,
      urlFocused: true,
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
      phoneFocused: false,
    });
  };

  onTogglePress = () => {
    const {secureTextEntry} = this.state;
    this.setState({
      secureTextEntry: !secureTextEntry,
    });
  };

  register = (screen) => async () => {
    const {navigation} = this.props;
    // let isUserExists = false;
    let flag = this.validateInput();
    console.log("Flag:",flag);
    if (!flag) {
      return;
    }
    const isUserExists = await this.CheckUserExist();
    console.warn('isUserExists res: ' + JSON.stringify(isUserExists));
    if (isUserExists == false) {
      try {
        let restaurantReqObj = {};
        restaurantReqObj.ownerName = this.state.ownerName;
        restaurantReqObj.url = this.state.url;
        restaurantReqObj.phoneNumber ='+' + this.state.countryCalligCode + this.state.phone;
        restaurantReqObj.restrauntName = this.state.restrauntName;
        restaurantReqObj.email = this.state.email;
        restaurantReqObj.password = this.state.password;
        console.log("request",restaurantReqObj);
        const res = await api.register(restaurantReqObj);
        let restaurant = res.data.restraunt;

        let userProfile = {};
        userProfile.email = this.state.email;
        userProfile.phone =
          '+' + this.state.countryCalligCode + this.state.phone;
        userProfile.password = this.state.password;
        userProfile.name = this.state.ownerName;

        console.warn('This is restaurant: ' + JSON.stringify(restaurant));
        console.warn('This is userProfile: ' + JSON.stringify(userProfile));

        const {dispatch} = this.props;
        dispatch({type: 'RESTAURANT_DATA', payload: restaurant});
        dispatch({type: 'SAVE_PRE_REGISTER_DATA', payload: userProfile});

        this.props.navigation.navigate(screen, {
          userName: this.state.ownerName,
          newPassword: this.state.password,
          firstName: this.state.ownerName,
          email: this.state.email,
          phoneNumber: '+' + this.state.countryCalligCode + this.state.phone,
        });
      } catch (e) {
        alert('Something went wrong sign up. Please try again.');
      }
    } else {
      this.setState({
        modalVisible: false,
      });
      alert(
        'Your phone number is already registered with us. Please try some other phone number id.',
      );
    }
  };

  navigateTo = (screen) => async () => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };

  CheckUserExist = async () => {
    let isUserExists = true;
    let result = appUtil.validatePhoneNumber(this.state.phone);
    if (result === 1) {
      try {
        this.setState({
          modalVisible: false,
        });
        //HERE WE ARE CHECKING WHETHER THE USER IS EXIST OR NOT

        isUserExists = await api.checkUserExists("%2B"+this.state.countryCalligCode+this.state.phone, 'state');
       /*isUserExists = await api.checkUserExists(
          appUtil.getCountryCodeEncoded() + this.state.phone,
          'state',
        );*/
      } catch (e) {
        isUserExists = false;
      }
    } else if (result === 2) {
      alert('Please enter valid phone number.');
    } else if (result === 0) {
      alert('Email address can not be blank.');
    }
    return isUserExists;
  };

  validateInput = () => {
    const {ownerName, restrauntName, email, phone, url, password} = this.state;
    let flag = true;

    let validateOwnerName = appUtil.validateName(ownerName);
    if (!(validateOwnerName == 1)) {
      if (validateOwnerName == 0) {
        alert('Owner Name can not be blank.');
      }
      flag = false;
    }

    let validateResName = appUtil.validateName(restrauntName);
    if (!(validateResName == 1)) {
      if (validateResName == 0) {
        alert('Restraunt Name can not be blank.');
      }
      flag = false;
    }

    let validateEmail = appUtil.validateEmail(email);
    if (!(validateEmail == 1)) {
      if (validateEmail == 0) {
        alert('Email can not be blank.');
      } else {
        alert('Please enter a valid Email.');
      }
      flag = false;
    }

    let validatePhoneNumber = appUtil.validatePhoneNumber(phone);
    console.log("phone number:",validatePhoneNumber);
    if (!(validatePhoneNumber == 1)) {
      if (validatePhoneNumber == 0) {
        alert('Phone Number can not be blank.');
      } else {
        alert('Please enter a valid Phone number.');
      }
      flag = false;
    }

    let validateUrl = appUtil.validateURL(url);
    if (!(validateUrl == 1)) {
      if (validateUrl == 0) {
        alert('URL can not be blank.');
      } else {
        alert('Please enter a valid url.');
      }
      flag = false;
    }

    return flag;
  };

  createAccount = () => {
    const {ownerName, restrauntName, email, phone, url, password} = this.state;

    this.setState(
      {
        ownerNameFocused: false,
        restrauntNameFocused: false,
        emailFocused: false,
        phoneFocused: false,
        urlFocused: false,
        passwordFocused: false,
      },
      this.register('Verification'),
    );
  };

  onSelect = (country) => {
    this.setState({
      countryCode: country.cca2,
      countryCalligCode: country.callingCode,
    });
    console.log(JSON.stringify(country));
  };

  focusOn = (nextFiled) => () => {
    if (nextFiled) {
      nextFiled.focus();
    }
  };

  render() {
    const {
      ownerNameFocused,
      restrauntNameFocused,
      emailFocused,
      phoneFocused,
      urlFocused,
      password,
      passwordFocused,
      secureTextEntry,
      modalVisible,
    } = this.state;

    return (
      <GradientContainer>
        <SafeAreaView style={styles.screenContainer}>
          <StatusBar
            backgroundColor={Colors.primaryColor}
            barStyle="light-content"
          />

          <KeyboardAwareScrollView
            contentContainerStyle={styles.contentContainerStyle}>
            <View style={styles.content}>
              <View />

              <View style={styles.form}>
                <UnderlineTextInput
                  onRef={(r) => {
                    this.ownerName = r;
                  }}
                  onChangeText={this.ownerNameChange}
                  onFocus={this.ownerNameFocus}
                  inputFocused={ownerNameFocused}
                  onSubmitEditing={this.focusOn(this.restrauntName)}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  keyboardType="default"
                  placeholder="Owner Name"
                  placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                  inputTextColor={INPUT_TEXT_COLOR}
                  borderColor={INPUT_BORDER_COLOR}
                  focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                  inputContainerStyle={styles.inputContainer}
                />

                <UnderlineTextInput
                  onRef={(r) => {
                    this.restrauntName = r;
                  }}
                  onChangeText={this.restrauntNameChange}
                  onFocus={this.restrauntNameFocus}
                  inputFocused={restrauntNameFocused}
                  onSubmitEditing={this.focusOn(this.email)}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  keyboardType="default"
                  placeholder="Restraunt Name"
                  placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                  inputTextColor={INPUT_TEXT_COLOR}
                  borderColor={INPUT_BORDER_COLOR}
                  focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                  inputContainerStyle={styles.inputContainer}
                />

                <UnderlineTextInput
                  onRef={(r) => {
                    this.email = r;
                  }}
                  onChangeText={this.emailChange}
                  onFocus={this.emailFocus}
                  inputFocused={emailFocused}
                  onSubmitEditing={this.focusOn(this.phone)}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  keyboardType="email-address"
                  placeholder="E-mail"
                  placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                  inputTextColor={INPUT_TEXT_COLOR}
                  borderColor={INPUT_BORDER_COLOR}
                  focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                  inputContainerStyle={styles.inputContainer}
                />
                <UnderlinePhoneInput
                  onRef={(r) => {
                    this.phone = r;
                  }}
                  onChangeText={this.phoneChange}
                  onFocus={this.phoneFocus}
                  inputFocused={phoneFocused}
                  onSubmitEditing={this.focusOn(this.url)}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  keyboardType="phone-pad"
                  placeholder="Phone number"
                  placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                  inputTextColor={INPUT_TEXT_COLOR}
                  borderColor={INPUT_BORDER_COLOR}
                  focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                  inputContainerStyle={styles.inputContainer}
                  countryCode={this.state.countryCode}
                  onSelect={this.onSelect}
                />

                <UnderlineTextInput
                  onRef={(r) => {
                    this.url = r;
                  }}
                  onChangeText={this.urlChange}
                  onFocus={this.urlFocus}
                  inputFocused={urlFocused}
                  onSubmitEditing={this.focusOn(this.password)}
                  returnKeyType="next"
                  blurOnSubmit={false}
                  keyboardType="default"
                  placeholder="Website URL"
                  placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                  inputTextColor={INPUT_TEXT_COLOR}
                  borderColor={INPUT_BORDER_COLOR}
                  focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                  inputContainerStyle={styles.inputContainer}
                />

                <UnderlinePasswordInput
                  onRef={(r) => {
                    this.password = r;
                  }}
                  onChangeText={this.passwordChange}
                  onFocus={this.passwordFocus}
                  inputFocused={passwordFocused}
                  onSubmitEditing={this.createAccount}
                  returnKeyType="done"
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
                    onPress={this.createAccount}
                    color={Colors.accentColor}
                    title={'Create Account'.toUpperCase()}
                  />
                </View>
              </View>

              <TouchableWithoutFeedback
                onPress={this.navigateTo('TermsConditions')}>
                <View style={styles.footer}>
                  <Text style={styles.footerText}>
                    By registering, you accepts our
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
        </SafeAreaView>
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

export default connect(mapStateToProps)(SignUpB);
