import React, {Component, Fragment} from 'react';
import {I18nManager, StatusBar, FlatList, StyleSheet, View} from 'react-native';
import remove from 'lodash/remove';

// import components
import Divider from '../../component/divider/Divider';
import GradientContainer from '../../component/gradientcontainer/GradientContainer';
import UnderlineTextInput from '../../component/textinputs/UnderlineTextInput';
import ContainedButton from '../../component/buttons/ContainedButton';
import {Heading6, SmallText} from '../../component/text/CustomText';
import ProductCard from '../../component/cards/ProductCard';
import SafeAreaView from '../../component/SafeAreaView';
import {connect} from 'react-redux';
import Button from '../../component/buttons/Button';

// import colors
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';

import * as api from '../../api/AuthService';
import * as appUtil from '../../utils/AppUtil';
import ActivityIndicatorModal from '../../component/modals/ActivityIndicatorModal';
import {API_URL} from '../../utils/consts';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PLACEHOLDER_TEXT_COLOR = 'rgba(247, 184, 68, 0.4)';
const INPUT_TEXT_COLOR = 'rgba(247, 184, 68, 1)';
const INPUT_BORDER_COLOR = 'green';
const INPUT_FOCUSED_BORDER_COLOR = '#FFFFFF';

// FavoritesA Config
const isRTL = I18nManager.isRTL;
const EMPTY_STATE_ICON = 'heart-outline';

// FavoritesB Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  titleContainer: {
    paddingHorizontal: 16,
  },
  form: {
    paddingHorizontal: Layout.LARGE_PADDING,
  },
  inputContainer: {
    padding: 7,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  titleText: {
    paddingVertical: 16,
    fontWeight: '700',
    textAlign: 'left',
  },
  buttonContainer: {
    paddingTop: 23,
  },
  bottomTextInfo: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  info: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 28,
    borderRadius: 14,
    paddingHorizontal: 12,
    backgroundColor: '#f1f1f1',
  },
});

// FavoritesB
let restaurant = {};
let userDetails = {};
class AssignTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurant: '',
      user: userDetails,
      // tableNumber: this.props.route.params.id,
      tableNumber:'',
      groupNumber: '',
      modalVisible: false,
    };
    // console.warn('This is rest: ' + JSON.stringify(this.state.user));
  }

  componentDidMount = () => {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      if(this.props.route.params)
      {
        this.setState(
          {
            tableNumber:this.props.route.params.id
          }
        )
      }
      //this.clear();
    });
    // this._bootstrap();
  };
  componentWillUnmount() {
    this.unsubscribe();
  }
  clear = () => {
    this.tableNumber.clear();
    this.groupNumber.clear();
  };

  tableNumberChange = (text) => {
    this.setState({
      tableNumber: text,
    });
  };

  groupNumberChange = (text) => {
    this.setState({
      groupNumber: text,
    });
  };

  tableNumberFocus = () => {
    this.setState({
      tableNumberFocused: true,
      groupNumberFocused: false,
    });
  };

  groupNumberFocus = () => {
    this.setState({
      tableNumberFocused: false,
      groupNumberFocused: true,
    });
  };

  focusOn = (nextFiled) => () => {
    if (nextFiled) {
      nextFiled.focus();
    }
  };

  navigateTo = (screen) => () => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };

  confirm = async () => {
    let resId = await AsyncStorage.getItem('resId');
    const {navigation} = this.props;
    this.setState({
      groupNumberFocused: false,
    });
    try {
      let tableNumber = this.state.tableNumber;
      let groupNumber = this.state.groupNumber;
      

      if (groupNumber.trim() == '') {
        alert("Group number can't be blank");
        return false;
      }

      // addGroupTable
      let resObj = {};
      resObj.resId = resId;
      resObj.groupNumber = groupNumber;
      resObj.tableNumber = tableNumber;
      resObj.ownerId = this.state.user.id;
      let response = await api.addGroupTable(resObj);
      if (response) {
        alert(response.data);
        navigation.navigate('Home');
      }
    } catch (e) {
      alert('Group Not Found');
    }
  };

  renderProductItem = ({item}) => (
    <ProductCard
      key={item.id}
      onPress={this.navigateTo('Product')}
      onPressRemove={this.onPressRemove(item)}
      onPressAdd={this.onPressAdd(item)}
      activeOpacity={0.7}
      imageUri={item.imageUri}
      title={item.name}
      price={item.price}
      quantity={item.quantity}
      status={item.status}
      swipeoutDisabled={false}
      swipeoutOnPressRemove={this.swipeoutOnPressRemove(item)}
    />
  );

  // base on list item dimensions
  // marginLeft={116} // 116 = 100 + 16
  renderSeparator = () => <Divider type="inset" marginLeft={0} />;

  render() {
    const {products} = this.state;
    const {
      tableNumber,
      groupNumber,
      tableNumberFocused,
      groupNumberFocused,
      modalVisible,
    } = this.state;
    return (
      <GradientContainer
        colors={['black', 'pink']}
        start={{x: 0, y: 1}}
        end={{x: 0, y: 0.6}}
        containerStyle={styles.bottomOverlay}>
        <SafeAreaView style={styles.container}>
          <StatusBar
            backgroundColor={Colors.statusBarColor}
            barStyle="dark-content"
          />

          <View style={styles.titleContainer}>
            <Heading6 style={styles.titleText}>Assign Table</Heading6>
          </View>

          <View style={styles.content}>
            <View />

            <View style={styles.form}>
              <UnderlineTextInput
                onRef={(r) => {
                  this.tableNumber = r;
                }}
                 value={this.state.tableNumber}
                onChangeText={this.tableNumberChange}
                onFocus={this.tableNumberFocus}
                inputFocused={tableNumberFocused}
                onSubmitEditing={this.focusOn(this.groupNumber)}
                returnKeyType="next"
                blurOnSubmit={false}
                keyboardType="number-pad"
                placeholder="Table Number"
                // maxLength={3}  //NO OF CHARACTERS
                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                inputTextColor={INPUT_TEXT_COLOR}
                borderColor={INPUT_BORDER_COLOR}
                focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                inputContainerStyle={styles.inputContainer}
              />

              <UnderlineTextInput
                onRef={(r) => {
                  this.groupNumber = r;
                }}
                onChangeText={this.groupNumberChange}
                onFocus={this.groupNumberFocus}
                inputFocused={groupNumberFocused}
                onSubmitEditing={this.focusOn(this.confirm)}
                returnKeyType="next"
                blurOnSubmit={false}
                keyboardType="number-pad"
                placeholder="Group Number"
                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                inputTextColor={INPUT_TEXT_COLOR}
                borderColor={INPUT_BORDER_COLOR}
                focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                inputContainerStyle={styles.inputContainer}
              />

              <View style={styles.buttonContainer}>
                <ContainedButton
                  onPress={this.confirm}
                  color={Colors.primaryColor}
                  title={'Confirm'.toUpperCase()}
                />
              </View>
              <View style={styles.buttonContainer}>
                <ContainedButton
                  onPress={this.navigateTo('Home')}
                  color={Colors.primaryColor}
                  title={'Back'.toUpperCase()}
                />
              </View>
            </View>
          </View>
        </SafeAreaView>
        <ActivityIndicatorModal
          message="Please wait . . ."
          onRequestClose={this.closeModal}
          statusBarColor={Colors.primaryColor}
          title="Loading"
          visible={modalVisible}
        />
      </GradientContainer>
    );
  }
}

const mapStateToProps = (state) => {
  restaurant = state.restaurant;
  console.log("@@@@@@@@@@@@@@@2",state.restaurant);
  userDetails = state.postLoginData;
  return {
    registeruser: [],
  };
};
export default connect(mapStateToProps)(AssignTable);
