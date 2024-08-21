import React, {Component, Fragment} from 'react';
import {StatusBar, StyleSheet, View, FlatList} from 'react-native';
import remove from 'lodash/remove';

// import components
import Button from '../../component/buttons/Button';
import Divider from '../../component/divider/Divider';
import {Heading6, Subtitle1} from '../../component/text/CustomText';
import EmptyState from '../../component/emptystate/EmptyState';
import ProductCard from '../../component/cards/ProductCard';
import SafeAreaView from '../../component/SafeAreaView';
import {connect} from 'react-redux';
// import colors
import Colors from '../../theme/colors';

// CartB Config
const EMPTY_STATE_ICON = 'cart-remove';
//api
import * as productApi from '../../api/ProductService';
import * as txnApi from '../../api/TransactionService';
// CartB Styles
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
    backgroundColor: '#efefef',
  },
  button: {
    width: '48%',
  },
});
let userProfile = {};
let restaurantData = {};
let userCart = {};
// CartB
class CartB extends Component {
  constructor(props) {
    super(props);

    this.state = {
      total: 0.0,
      loggedInUser: userProfile,
      restaurant: restaurantData,
      products: [
        {
          id: 'product1',
          imageUri: require('../../assets/img/pizza_3.jpg'),
          name: 'Pizza One',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
          price: 7.99,
          quantity: 2,
        },
        {
          id: 'product3',
          imageUri: require('../../assets/img/barbecue_1.jpg'),
          name: 'Beef',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
          price: 8.99,
          quantity: 2,
        },
        {
          id: 'product4',
          imageUri: require('../../assets/img/spaghetti_1.jpg'),
          name: 'Fettuccine Pasta',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ',
          price: 11.99,
          quantity: 1,
        },
      ],
    };
  }

  componentDidMount = () => {
    this.updateTotalAmount();
    this.updateCart('');
    //this.updateTotalAmount();
  };

  navigateTo = (screen) => () => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };

  swipeoutOnPressRemove = (item) => () => {
    let {products} = this.state;
    const index = products.indexOf(item);

    products = remove(products, (n) => products.indexOf(n) !== index);

    this.setState(
      {
        products,
      },
      () => {
        this.updateTotalAmount();
      },
    );
  };

  onPressRemove = (item) => () => {
    let {quantity} = item;
    quantity -= 1;

    let {products} = this.state;
    const index = products.indexOf(item);

    if (quantity === 0) {
      products = remove(products, (n) => products.indexOf(n) !== index);
    } else {
      products[index].quantity = quantity;
    }

    this.setState(
      {
        products: [...products],
      },
      () => {
        this.updateTotalAmount();
      },
    );
  };
  updateCart = async (productId) => {
    let isProductListInCart = false;
    let products = [];
    let addCartJson = {};
    let total = 0.0;

    addCartJson.customerId = this.state.loggedInUser.id;

    try {
      let response = await txnApi.getCart(addCartJson);

      if (response.hasOwnProperty('data') && response.data != null) {
        if (
          response.data.hasOwnProperty('cartId') &&
          response.data.cartId != null
        ) {
          const {dispatch} = this.props;

          dispatch({type: 'CART.ID', payload: response.data.cartId});
        }
        if (
          response.data.hasOwnProperty('total') &&
          response.data.total != null
        ) {
          // await AsyncStorage.setItem('cartId', response.data.cartId);
          total = response.data.total;
        }

        if (
          response.data.hasOwnProperty('productList') &&
          response.data.productList != null
        ) {
          if (response.data.productList == null) {
            isProductListInCart = false;
          } else {
            isProductListInCart = true;
            const length = response.data.productList.length;
            let productsLists = response.data.productList;
            productsLists.map((product, index) => {
              let p = product;
              p.quantity = 0;

              products.push(p);
            });
            alert(JSON.stringify(response.data));
            /* this.setState({cartCount:length})*/

            /* const { dispatch } = this.props; 
                    dispatch({ type: 'SAVE_POST_LOGIN_DATA',
                    payload: length});*/
          }
        } else {
          isProductListInCart = false;
        }
        this.setState({
          total,
          products: products,
        });
        /* this.setState({
                
               products: products,
                total:total
            })*/
      }
    } catch (e) {
      alert(e);
    }
  };
  onPressAdd = (item) => async () => {
    const {quantity} = item;
    const {products} = this.state;

    let addCartJson = {};

    addCartJson.userId = this.state.loggedInUser.id;

    addCartJson.productIds = [item.id];
    try {
      /* this.setState({
            btnTxt: 'Please wait...'
        })*/
      this.setState({
        modalVisible: true,
      });

      let response = await txnApi.addToCart(addCartJson);
      // alert(" json "+JSON.stringify(response.data.id))
      // await AsyncStorage.setItem('cartId', response.data.data.token);

      const {dispatch} = this.props;
      dispatch({type: 'CART.INCREMENT'});
      dispatch({type: 'CART.ID', payload: response.data.id});
      const index = products.indexOf(item);
      products[index].quantity = quantity + 1;
      this.setState(
        {
          products: [...products],
        },
        () => {
          this.updateTotalAmount();
        },
      );
    } catch (e) {
      alert(e);
    }
    this.setState({
      modalVisible: false,
    });
  };

  updateTotalAmount = () => {
    const {products} = this.state;
    let total = 0.0;

    products.forEach((product) => {
      let {price} = product;
      const {discountPercentage, quantity} = product;

      if (typeof discountPercentage !== 'undefined') {
        price -= price * discountPercentage * 0.01;
      }
      total += price * quantity;
    });

    this.setState({
      total,
    });
  };

  keyExtractor = (item) => item.id.toString();

  renderProductItem = ({item}) => (
    <ProductCard
      key={item.id}
      onPress={this.navigateTo('Product')}
      onPressRemove={this.onPressRemove(item)}
      onPressAdd={this.onPressAdd(item)}
      activeOpacity={0.7}
      imageUri={item.imageUri}
      title={item.test}
      price={parseFloat(item.price)}
      quantity={item.quantity}
      description={item.description}
      swipeoutOnPressRemove={this.swipeoutOnPressRemove(item)}
    />
  );

  renderSeparator = () => <Divider />;

  render() {
    const {total, products} = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="dark-content"
        />

        <View style={styles.titleContainer}>
          <Heading6 style={styles.titleText}>Cart</Heading6>

          {products.length > 0 && (
            <View style={styles.inline}>
              <Subtitle1 style={styles.subTotalText}> Subtotal: </Subtitle1>
              <Heading6 style={styles.subTotalPriceText}>
                {`$ ${parseFloat(Math.round(total * 100) / 100).toFixed(2)}`}
              </Heading6>
            </View>
          )}
        </View>

        {products.length === 0 ? (
          <EmptyState
            showIcon
            iconName={EMPTY_STATE_ICON}
            title="Your Cart is Empty"
            message="Looks like you haven't added anything to your cart yet"
          />
        ) : (
          <Fragment>
            <FlatList
              data={products}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderProductItem}
              ItemSeparatorComponent={this.renderSeparator}
            />

            <View style={styles.bottomButtonsContainer}>
              <Button
                onPress={this.navigateTo('Home')}
                buttonStyle={styles.button}
                color={Colors.tertiaryColor}
                rounded
                title="Add More"
              />
              <Button
                onPress={this.navigateTo('Checkout')}
                buttonStyle={styles.button}
                rounded
                title="Checkout"
              />
            </View>
          </Fragment>
        )}
      </SafeAreaView>
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
export default connect(mapStateToProps)(CartB);
