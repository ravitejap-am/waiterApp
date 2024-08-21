import React, {Component} from 'react';
import {
  I18nManager,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Color, {rgb} from 'color';
import {SwipeRow} from 'react-native-swipe-list-view';

// import utils
import getImgSource from '../../utils/getImgSource.js';

// import components
import Icon from '../icon/Icon';
import Button from '../buttons/Button';
import {Subtitle1, Subtitle2} from '../text/CustomText';
import TouchableItem from '../TouchableItem';

// import colors, layout
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';

// ProductCard Config
const isRTL = I18nManager.isRTL;
const IOS = Platform.OS === 'ios';
const ITEM_WIDTH = Layout.SCREEN_WIDTH;

const MINUS_ICON = IOS ? 'ios-remove' : 'md-remove';
const PLUS_ICON = IOS ? 'ios-add' : 'md-add';
const DELETE_ICON = IOS ? 'ios-close' : 'md-close';
const TRASH_ICON = IOS ? 'ios-trash' : 'md-trash';

const imgHolder = require('../../assets/img/imgholder.png');

// ProductCard Styles
const styles = StyleSheet.create({
  cardBack: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    margin: 1,
    backgroundColor: Color(Colors.primaryColor).alpha(0.12).string(),
  },
  deleteButtonContainer: {
    width: 88,
    overflow: 'hidden',
  },
  deleteButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bg: {
    paddingHorizontal: 0,
    marginHorizontal: 1,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.2)',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: ITEM_WIDTH,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 8,
    marginHorizontal: 5,
  },
  imageContainer: {
    marginRight: 20,
  },
  // image: {
  //   width: 98,
  //   height: 82,
  //   borderRadius: 8,
  // },
  textContainer: {
    flex: 1,
    // backgroundColor: 'red',
    margin: 0,
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    fontWeight: '300',
    width: '50%',
    color: Colors.primaryText,
    textAlign: 'left',
    marginLeft: -40,
  },
  firstLine: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  secondLine: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  thirdLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  descriptionText: {
    flex: 1,
    lineHeight: 20,
    color: Colors.secondaryText,
    textAlign: 'left',
  },
  priceText: {
    fontWeight: '700',
    fontSize: 16,
    color: Colors.primaryColor,
    textAlign: 'left',
    paddingRight: 10,
  },
  amountButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  quantity: {
    top: -1,
    paddingRight: 16,
    fontSize: 16,
    color: Colors.black,
    textAlign: 'center',
    fontWeight: '300',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
    borderRadius: 14,
    width: 28,
    height: 28,
    backgroundColor: '#cacaca',
  },
});

// ProductCard State
type State = {};

// ProductCard Props
type Props = {
  onPress: () => {},
  onPressRemove: () => void,
  onPressAdd: () => void,
  onPressDelete: () => void,
  selectMember: () => void,
  activeOpacity: number,
  imageUri: string,
  title: string,
  description: string,
  price: number,
  quantity: number,
  swipeoutDisabled: boolean,
  showQuantity: boolean,
  swipeoutOnPressRemove: () => {},
};

// ProductCard DeleteButton
const DeleteButton = ({onPress}) => (
  <View style={styles.deleteButtonContainer}>
    <TouchableItem onPress={onPress} style={styles.deleteButton}>
      <Icon name={DELETE_ICON} size={26} color={Colors.error} />
    </TouchableItem>
  </View>
);

// ProductCard
export default class ProductCard extends Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      quantity: this.props.quantity,
    };
  }

  onPressAdd = () => {
    const {onPressAdd = () => {}} = this.props;
    onPressAdd();
  };
  selectMember = () => {
    const {selectMember = () => {}} = this.props;
    selectMember();
  };
  onPressRemove = () => {
    const {onPressRemove = () => {}} = this.props;
    onPressRemove();
  };
  onPressDelete = () => {
    const {onPressDelete = () => {}} = this.props;
    onPressDelete();
  };

  render() {
    const {
      activeOpacity,
      onPress,
      title,
      status,
      description,
      price = 0,
      quantity,
      swipeoutDisabled,
      showQuantity,
      swipeoutOnPressRemove,
    } = this.props;

    return (
      <SwipeRow
        disableLeftSwipe={isRTL ? true : swipeoutDisabled}
        disableRightSwipe={isRTL ? swipeoutDisabled : true}
        directionalDistanceChangeThreshold={16}
        rightOpenValue={isRTL ? 0 : -88}
        leftOpenValue={isRTL ? 88 : 0}>
        <View style={styles.cardBack}>
          <DeleteButton onPress={this.onPressRemove} />
        </View>

        <View style={styles.bg}>
          <TouchableItem
            onPress={onPress}
            activeOpacity={activeOpacity}
            useForeground>
            <View style={styles.container}>
              <View style={styles.textContainer}>
                <View style={styles.firstLine}>
                  <Text style={styles.title}>{title}</Text>
                  <Text style={styles.quantity}>({this.state.quantity})</Text>
                  <Text style={styles.priceText}>
                    {`$ ${price.toFixed(2)}`}
                  </Text>
                </View>

                {/* <View style={styles.thirdLine}>
                  <View style={styles.amountButtonsContainer}>
                    <Text style={styles.quantity}>{this.state.quantity}</Text>
                  </View>
                  <Text style={styles.priceText}>
                    {`$ ${price.toFixed(2)}`}
                  </Text>
                </View> */}
              </View>
            </View>
          </TouchableItem>
        </View>
      </SwipeRow>
    );
  }
}
