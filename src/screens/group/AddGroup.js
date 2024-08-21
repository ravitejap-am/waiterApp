import React, {Component} from 'react';
import {Keyboard, ScrollView, StatusBar, StyleSheet, View} from 'react-native';
import Color from 'color';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import {connect} from 'react-redux';
// import components
import ActivityIndicatorModal from '../../component/modals/ActivityIndicatorModal';
import Button from '../../component/buttons/Button';
import GradientContainer from '../../component/gradientcontainer/GradientContainer';
import {Paragraph} from '../../component/text/CustomText';
import SafeAreaView from '../../component/SafeAreaView';
import UnderlineTextInput from '../../component/textinputs/UnderlineTextInput';

// import colors
import Colors from '../../theme/colors';

//api
import * as api from '../../api/AuthService';
import * as txnApi from '../../api/TransactionService';
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
    textAlign: 'center',
  },
  buttonContainer: {
    paddingTop: 22,
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopRightRadius: 22,
    borderTopLeftRadius: 22,
    width: '100%',
    padding: 16,
  },
  skipbutton: {
    width: '38%',
  },
  button: {
    width: '58%',
  },
});
let userProfile = {};
let restaurantData = {};
let userCart = {};
// ForgotPasswordB
class AddGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      groupName: '',
      groupNumber: '',
      groupId: '',
      phoneno: '',
      loggedInUser: userProfile,
      restaurant: restaurantData,
      emailFocused: false,
      modalVisible: false,
      groupAdded: false,
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
      emailFocused: true,
    });
  };

  keyboardDidHide = () => {
    this.setState({
      emailFocused: false,
    });
  };

  groupNameChange = (text) => {
    this.setState({
      groupName: text,
    });
  };
  phoneChange = (text) => {
    this.setState({
      phoneno: text,
    });
  };
  navigateTo = (screen) => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };
  createGroup = async () => {
    // for demo purpose after 3s close modal
    let jsonData = {};
    let response = {};
    jsonData.userId = this.state.loggedInUser.id;
    jsonData.resId = this.state.restaurant.id;
    var isEmailSent = false;
    try {
      response = await txnApi.addGroup(jsonData);

      isEmailSent = true;
    } catch (error) {
      alert(JSON.stringify(error));
    }

    if (isEmailSent) {
      //this.openAlertModal("We have emailed a password reset link.")
      //  alert("We have emailed a password reset link.")
      this.setState({
        groupAdded: true,
        groupNumber: response.group_number,
        groupId: response.id,
      });
      this.closeModal();
    } else {
      this.closeModal();
      //this.openAlertModal("We could not find your email. Please try another email id")
      alert('We could not find your email. Please try another email id');
    }
  };
  addMemberToGroup = async () => {
    // for demo purpose after 3s close modal
    let jsonData = {};
    let response = {};
    jsonData.userPhNo = [this.state.phoneno];
    jsonData.groupId = this.state.groupId;
    var isEmailSent = false;
    try {
      //alert(JSON.stringify(jsonData))
      response = await txnApi.addMemberToGroup(jsonData);

      isEmailSent = true;
    } catch (error) {
      //alert("hell "+JSON.stringify(error))
    }

    if (isEmailSent) {
      //this.openAlertModal("We have emailed a password reset link.")
      //  alert("We have emailed a password reset link.")
      this.setState({
        groupAdded: true,
        groupNumber: response.group_number,
        groupId: response.id,
      });
      this.closeModal();
    } else {
      this.closeModal();
      //this.openAlertModal("We could not find your email. Please try another email id")
      // alert("We could not find your email. Please try another email id")
    }
  };
  deleteMemberToGroup = (userId) => async () => {
    // for demo purpose after 3s close modal
    let jsonData = {};
    let response = {};
    jsonData.userId = userId;
    jsonData.groupId = this.state.groupId;
    var isEmailSent = false;
    try {
      //alert(JSON.stringify(jsonData))
      response = await txnApi.deleteMemberToGroup(jsonData);

      isEmailSent = true;
    } catch (error) {
      //alert("hell "+JSON.stringify(error))
    }

    if (isEmailSent) {
      //this.openAlertModal("We have emailed a password reset link.")
      //  alert("We have emailed a password reset link.")
      this.setState({
        groupAdded: true,
        groupNumber: response.group_number,
        groupId: response.id,
      });
      this.closeModal();
    } else {
      this.closeModal();
      //this.openAlertModal("We could not find your email. Please try another email id")
      // alert("We could not find your email. Please try another email id")
    }
  };
  addGroup = () => {
    Keyboard.dismiss();
    this.setState(
      {
        modalVisible: true,
        emailFocused: false,
      },
      this.createGroup,
    );
  };

  closeModal = () => {
    // for demo purpose clear timeout if user request close modal before 3s timeout
    clearTimeout(this.timeout);
    this.setState({
      modalVisible: false,
    });
  };
  skip = (e) => {
    this.navigateTo('HomeNavigator', {
      id: this.state.restaurant.id,
      name: this.state.restaurant.name,
    });
  };
  render() {
    const {emailFocused, modalVisible} = this.state;

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
                  name="account-group-outline"
                  size={36}
                  color={Colors.primaryColor}
                />
              </View>
              <Paragraph style={styles.instruction}>
                {!this.state.groupAdded
                  ? 'Enter your Group Name'
                  : 'Hello ' +
                    this.state.groupName +
                    '(' +
                    this.state.groupNumber +
                    ')'}
              </Paragraph>
            </View>

            {!this.state.groupAdded ? (
              <View style={styles.inputContainer}>
                <UnderlineTextInput
                  onChangeText={this.groupNameChange}
                  inputFocused={emailFocused}
                  onSubmitEditing={this.addGroup}
                  returnKeyType="done"
                  blurOnSubmit={false}
                  keyboardType="email-address"
                  placeholder="Group Name"
                  placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                  inputTextColor={INPUT_TEXT_COLOR}
                  borderColor={INPUT_BORDER_COLOR}
                  focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                  inputStyle={styles.inputStyle}
                />
              </View>
            ) : (
              <View style={{marginTop: 20}}>
                <View style={{flexDirection: 'row'}}>
                  <Icon
                    name="phone"
                    type="font-awesome"
                    color="white"
                    size={25}
                    iconStyle={{
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      marginLeft: 20,
                      marginRight: 55,
                    }}
                  />
                  <Paragraph
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: 'white',
                    }}>
                    {' '}
                    Enter a Member's Mobile Number{' '}
                  </Paragraph>
                </View>

                <UnderlineTextInput
                  value={this.state.phoneno}
                  keyboardType="numeric"
                  onChangeText={this.phoneChange}
                  inputFocused={emailFocused}
                  onSubmitEditing={this.addMemberToGroup}
                  returnKeyType="done"
                  blurOnSubmit={false}
                  placeholder="Mobile Number"
                  placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                  inputTextColor={INPUT_TEXT_COLOR}
                  borderColor={INPUT_BORDER_COLOR}
                  focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                  inputStyle={styles.inputStyle}
                />
              </View>
            )}

            <View style={styles.bottomButtonsContainer}>
              <Button
                onPress={this.skip}
                buttonStyle={styles.skipbutton}
                color={Colors.tertiaryColor}
                title="Skip"
              />
              {!this.state.groupAdded ? (
                <Button
                  onPress={this.addGroup}
                  color={Colors.surface}
                  buttonStyle={styles.button}
                  title={'  start a new group  '.toUpperCase()}
                  titleColor={Colors.primaryColor}
                />
              ) : (
                <Button
                  onPress={this.addMemberToGroup}
                  color={Colors.surface}
                  buttonStyle={styles.button}
                  title={'Add Member'.toUpperCase()}
                  titleColor={Colors.primaryColor}
                />
              )}
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
const mapStateToProps = (state) => {
  userProfile = state.postLoginData;
  restaurantData = state.restarauntData;
  userCart = state.cart;
  return {
    registeruser: state.postLoginData,
  };
};

export default connect(mapStateToProps)(AddGroup);
