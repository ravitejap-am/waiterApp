import React, { Component } from 'react';
import {
  Alert,
  I18nManager,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  View,
} from 'react-native';
import { connect } from 'react-redux';
// import components
import { CommonActions } from '@react-navigation/native';
import Avatar from '../../component/avatar/Avatar';
import Divider from '../../component/divider/Divider';
import Icon from '../../component/icon/Icon';
import { Heading6, Subtitle1, Subtitle2 } from '../../component/text/CustomText';
import SafeAreaView from '../../component/SafeAreaView';
import TouchableItem from '../../component/TouchableItem';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import colors
import Colors from '../../theme/colors';

// SettingsB Config
const isRTL = I18nManager.isRTL;
const IOS = Platform.OS === 'ios';

const NOTIFICATION_OFF_ICON = IOS
  ? 'ios-notifications-off'
  : 'md-notifications-off';
const NOTIFICATION_ICON = IOS ? 'ios-notifications' : 'md-notifications';

const ADDRESS_ICON = IOS ? 'ios-pin' : 'md-pin';
const PAYMENT_ICON = IOS ? 'ios-card' : 'md-card';
const ORDERS_ICON = IOS ? 'ios-list' : 'md-list';

const ABOUT_ICON = IOS ? 'ios-finger-print' : 'md-finger-print';
const UPDATE_ICON = IOS ? 'ios-cloud-download' : 'md-cloud-download';
const TERMS_ICON = IOS ? 'ios-paper' : 'md-paper';

const ADD_ICON = IOS ? 'ios-add-circle-outline' : 'md-add-circle-outline';
const LOGOUT_ICON = IOS ? 'ios-exit' : 'md-exit';

// SettingsB Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainerStyle: {
    paddingBottom: 16,
  },
  titleContainer: {
    paddingHorizontal: 16,
  },
  titleText: {
    paddingTop: 16,
    paddingBottom: 16,
    fontWeight: '700',
    textAlign: 'left',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  profileContainer: {
    // height: 88
    paddingVertical: 16,
  },
  leftSide: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  profileInfo: {
    paddingLeft: 16,
  },
  name: {
    fontWeight: '500',
    textAlign: 'left',
  },
  email: {
    paddingVertical: 2,
  },
  sectionHeader: {
    paddingTop: 16,
    paddingHorizontal: 16,
    textAlign: 'left',
  },
  sectionHeaderText: {
    textAlign: 'left',
  },
  setting: {
    height: 48,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    width: 24,
    height: 24,
  },
});

// SectionHeader Props
type SectionHeaderProps = {
  title: string,
};

// Setting Props
type SettingProps = {
  icon: string,
  setting: string,
  type: string,
  onPress: () => {},
};

// SettingsB Components
const SectionHeader = ({ title }: SectionHeaderProps) => (
  <View style={styles.sectionHeader}>
    <Subtitle1 style={styles.sectionHeaderText}>{title}</Subtitle1>
  </View>
);

const Setting = ({ onPress, icon, setting, type }: SettingProps) => (
  <TouchableItem onPress={onPress}>
    <View style={[styles.row, styles.setting]}>
      <View style={styles.leftSide}>
        {icon !== undefined && (
          <View style={styles.iconContainer}>
            <Icon
              name={icon}
              size={20}
              color={
                type === 'logout' ? Colors.secondaryColor : Colors.primaryColor
              }
            />
          </View>
        )}
        <Subtitle2 style={type === 'logout' && { color: Colors.secondaryColor }}>
          {setting}
        </Subtitle2>
      </View>

      {type !== 'logout' && (
        <View style={isRTL && { transform: [{ scaleX: -1 }] }}>
          <Icon
            name="ios-arrow-forward"
            size={16}
            color="rgba(0, 0, 0, 0.16)"
          />
        </View>
      )}
    </View>
  </TouchableItem>
);

let userDetails = {};
let userProfile = {

};
// SetingsB
class SettingsB extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notificationsOn: true,
      user:userProfile,
    };
  }

  // userDetail = async () => {
  //   try {
  //     this.setState({ modalVisible: true })
  //     let userdetails = await AsyncStorage.getItem('user');
  //     let users = JSON.parse(userdetails);
  //     console.log("user name:", users.firstName);
  //     console.log("user name:", users.emailAddress);

  //     // if (first_name !== null) {
  //     //   this.setState({ modalVisible: false })
  //     this.setState({
  //       userdata:users
  //     })
  //     // }
  //   }
  //   catch (e) {
  //     console.log(e);
  //   }
  // }
  navigateTo = (screen) => () => {
    const { navigation } = this.props;
    navigation.navigate(screen);
  };
  // componentDidMount() {
  //   console.log("###########################", this.state.loginInData);
   
  //   this.userDetail();
  //   this.setState({
  //     modalVisible: false,
  //   });
  // }
  componentDidMount = () => {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      // this.userDetail();
      this.setState({
        user:userProfile
      })
    });
  };
  componentWillUnmount() {
    this.unsubscribe();
  }
  toggleNotifications = (value) => {
    this.setState({
      user: userDetails,
    });
  };

  // logout = () => {
  //   Alert.alert(
  //     'Logout',
  //     'Are you sure you want to logout?',
  //     [
  //       {text: 'Cancel', onPress: () => {}, style: 'cancel'},
  //       {text: 'OK', onPress: () => {}},
  //     ],
  //     {cancelable: false},
  //   );
  // };

  logout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', onPress: () => { }, style: 'cancel' },
        {
          text: 'OK',
          onPress: () => {
            AsyncStorage.removeItem('userToken');
            AsyncStorage.removeItem('userGroup');
            AsyncStorage.getAllKeys().then((keys) =>
              AsyncStorage.multiRemove(keys),
            );
            const { dispatch } = this.props;
            dispatch({ type: 'RESET' });
            // this.props.navigation.navigate("SignIn")
            this.props.navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'SignIn' }],
              }),
            );
          },
        },
      ],
      { cancelable: false },
    );
  };

  render() {

    const { notificationsOn, name, email } = this.state;
    console.warn('This is postLoginData: ' + JSON.stringify(this.state));
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="dark-content"
        />

        <ScrollView contentContainerStyle={styles.contentContainerStyle}>
          <View style={styles.titleContainer}>
            <Heading6 style={styles.titleText}>Settings</Heading6>
          </View>

          <TouchableItem useForeground onPress={this.navigateTo('EditProfile')}>
            <View style={[styles.row, styles.profileContainer]}>
              <View style={styles.leftSide}>
                <Avatar
                  imageUri={require('../../assets/img/profile_1.jpeg')}
                  size={60}
                  rounded
                />
                <View style={styles.profileInfo}>
                  <Subtitle1 style={styles.name}>
                    {/* {name} */}
                    {this.state.user.firstName}
                  </Subtitle1>
                  <Subtitle2 style={styles.email}>
                    {/* {email} */}
                    {this.state.user.emailAddress}
                  </Subtitle2>
                </View>
              </View>
            </View>
          </TouchableItem>
          <Divider />
          <SectionHeader title="Orders" />
          <Setting
            onPress={this.navigateTo('OrdersC')}
            icon={ORDERS_ICON}
            setting="All Orders"
          />
         
          {/* <Setting
            onPress={this.navigateTo('Orders')}
            icon={ORDERS_ICON}
            setting="Past Orders"
          /> */}

          <SectionHeader title="About" />
          <Setting
            onPress={this.navigateTo('AboutUs')}
            icon={ABOUT_ICON}
            setting="Who We Are"
          />

          {/* <Setting icon={UPDATE_ICON} setting="App Updates" /> */}

          <Setting
            onPress={this.navigateTo('TermsConditions')}
            icon={TERMS_ICON}
            setting="Terms of Use"
          />

          <SectionHeader title="Logins" />
          <Setting
            onPress={this.navigateTo('EditProfile')}
            icon={ADD_ICON}
            setting="Edit Account" />
          <Setting
            onPress={this.navigateTo('ForgotPassword')}
            icon={ADD_ICON}
            setting="Change Password"
          />
          <Setting
            onPress={this.logout}
            icon={LOGOUT_ICON}
            setting="Log Out"
            type="logout"
          />
        </ScrollView>

      </SafeAreaView>
    );
  }
}
const mapStateToProps = (state) => {
  userProfile = state.postLoginData;
  console.log("Setting redux data :",state.postLoginData);
  return {
    registeruser  : state.postLoginData
  };
};
export default connect(mapStateToProps)(SettingsB);
