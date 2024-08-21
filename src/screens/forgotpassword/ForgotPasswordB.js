import React, {Component} from 'react';
import {Keyboard, ScrollView, StatusBar, StyleSheet, View} from 'react-native';
import Color from 'color';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';

// import components
import ActivityIndicatorModal from '../../component/modals/ActivityIndicatorModal';
import Button from '../../component/buttons/Button';
import GradientContainer from '../../component/gradientcontainer/GradientContainer';
import {Paragraph} from '../../component/text/CustomText';
import SafeAreaView from '../../component/SafeAreaView';
import UnderlineTextInput from '../../component/textinputs/UnderlineTextInput';
import UnderlinePhoneInput from '../../component/textinputs/UnderlinePhoneInput';

// import colors
import Colors from '../../theme/colors';

//api
import * as api from '../../api/AuthService';

// ForgotPasswordB Config
const PLACEHOLDER_TEXT_COLOR = 'rgba(255, 255, 255, 0.7)';
const INPUT_TEXT_COLOR = '#fff';
const INPUT_BORDER_COLOR = 'rgba(255, 255, 255, 0.4)';
const INPUT_FOCUSED_BORDER_COLOR = '#fff';

// ForgotPasswordB Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  contentContainerStyle: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 64,
    paddingHorizontal: 24,
  },
  instructionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    // backgroundColor: Color(Colors.surface).alpha(0.96),
    backgroundColor: '#fff',
  },
  instruction: {
    marginTop: 32,
    paddingHorizontal: 16,
    fontSize: 14,
    color: Colors.onPrimaryColor,
    textAlign: 'center',
  },
  inputContainer: {
    paddingTop: 16,
  },
  inputStyle: {
    textAlign: 'left',
  },
  buttonContainer: {
    paddingTop: 22,
  },
  inputContainer: {marginBottom: 7},
});

// ForgotPasswordB
export default class ForgotPasswordB extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      phoneFocused: false,
      modalVisible: false,
      countryCode: 'US',
      countryCalligCode: '1',
    };
  }

  componentDidMount = () => {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardDidHide,
    );
  };

  // avoid memory leak
  componentWillUnmount = () => {
    clearTimeout(this.timeout);
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  };

  keyboardDidShow = () => {
    this.setState({
      phoneFocused: true,
    });
  };

  keyboardDidHide = () => {
    this.setState({
      phoneFocused: false,
    });
  };

  phoneChange = (text) => {
    this.setState({
      email: text,
    });
  };

  onSelect = (country) => {
    this.setState({
      countryCode: country.cca2,
      countryCalligCode: country.callingCode,
    });
    console.log(JSON.stringify(country));
  };

  navigateTo = (screen) => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };
  sendLink = async () => {
    // for demo purpose after 3s close modal
    let userProfile = {};
    userProfile.phoneNumber =
      '%2B' + this.state.countryCalligCode + this.state.email;
    var isEmailSent = false;
    try {
      console.warn(userProfile);
      let response = await api.forgotPassword(userProfile);

      isEmailSent = true;
    } catch (error) {
      // alert(error);
    }

    if (isEmailSent) {
      //this.openAlertModal("We have emailed a password reset link.")
      alert('We have emailed a password reset link.');
      this.closeModal();
      this.timeout = setTimeout(() => {
        this.props.navigation.navigate('SignIn', userProfile);
      }, 3000);
    } else {
      this.closeModal();
      //this.openAlertModal("We could not find your email. Please try another email id")
      alert(
        'We could not find your Mobile number. Please try another Mobile number',
      );
    }
  };
  resetPassword = () => {
    Keyboard.dismiss();
    this.setState(
      {
        modalVisible: true,
        phoneFocused: false,
      },
      this.sendLink,
    );
  };

  closeModal = () => {
    // for demo purpose clear timeout if user request close modal before 3s timeout
    clearTimeout(this.timeout);
    this.setState({
      modalVisible: false,
    });
  };

  render() {
    const {phoneFocused, modalVisible} = this.state;

    return (
      <GradientContainer>
        <SafeAreaView
          forceInset={{top: 'never'}}
          style={styles.screenContainer}>
          <StatusBar
            backgroundColor={Colors.primaryColor}
            barStyle="light-content"
          />

          <ScrollView contentContainerStyle={styles.contentContainerStyle}>
            <View style={styles.instructionContainer}>
              <View style={styles.iconContainer}>
                <Icon
                  name="lock-outline"
                  size={36}
                  color={Colors.primaryColor}
                />
              </View>
              <Paragraph style={styles.instruction}>
                Enter your mobile number below to receive your password reset
                instruction
              </Paragraph>
            </View>

            <View style={styles.inputContainer}>
              <UnderlinePhoneInput
                onRef={(r) => {
                  this.email = r;
                }}
                onChangeText={this.phoneChange}
                onFocus={this.phoneFocus}
                inputFocused={phoneFocused}
                onSubmitEditing={this.resetPassword}
                returnKeyType="done"
                blurOnSubmit={false}
                keyboardType="numeric"
                placeholder="Mobile number"
                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                inputTextColor={INPUT_TEXT_COLOR}
                borderColor={INPUT_BORDER_COLOR}
                focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                inputContainerStyle={styles.inputContainer}
                countryCode={this.state.countryCode}
                onSelect={this.onSelect}
                inputStyle={styles.inputStyle}
              />
            </View>

            <View style={styles.buttonContainer}>
              <Button
                onPress={this.resetPassword}
                color={Colors.surface}
                small
                title={'Reset password'.toUpperCase()}
                titleColor={Colors.primaryColor}
              />
            </View>

            <ActivityIndicatorModal
              statusBarColor={Color(Colors.primaryColor)
                .darken(0.52)
                .rgb()
                .string()}
              message="Please wait . . ."
              onRequestClose={this.closeModal}
              title="Sending instructions"
              visible={modalVisible}
            />
          </ScrollView>
        </SafeAreaView>
      </GradientContainer>
    );
  }
}
