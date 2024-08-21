import React, {Component} from 'react';
import {
  ImageBackground,
  ScrollView,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Color from 'color';
// import utils
import getImgSource from '../../utils/getImgSource.js';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
// import components
import Divider from '../../component/divider/Divider';
import {Heading6} from '../../component/text/CustomText';
import LinkButton from '../../component/buttons/LinkButton';
import ProductCard from '../../component/cards/ProductCard';
import SafeAreaView from '../../component/SafeAreaView';
import ActivityIndicatorModal from '../../component/modals/ActivityIndicatorModal';

// import colors
import Colors from '../../theme/colors';

// HomeB Config
const imgHolder = require('../../assets/img/imgholder.png');
//api
import * as productApi from '../../api/ProductService';
import * as txnApi from '../../api/TransactionService';

// HomeB Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    marginTop: -50,
  },
  categoriesContainer: {
    paddingBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  titleText: {
    fontWeight: '700',
  },
  viewAllText: {
    color: Colors.primaryColor,
  },
  categoriesList: {
    paddingTop: 4,
    paddingRight: 16,
    paddingLeft: 6,
  },
  categoryContainer: {
    marginLeft: 10,
    width: 112,
    height: 112,
  },
  categoryThumbnail: {
    borderRadius: 8,
    width: '100%',
    height: '100%',
  },
  categoryImg: {
    borderRadius: 8,
  },
  categoryName: {
    position: 'absolute',
    top: 6,
    left: 6,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(128, 128, 128, 0.84)',
  },
  categoryNameText: {
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 0.6,
  },
  grpNumText: {
    fontWeight: '700',
    fontSize: 16,
    color: Colors.primaryColor,
    textAlign: 'left',
  },
});

let restaurant = {};
let userDetails = {};
var BUTTONS = ['Male', 'Female', 'Other', 'Close'];
// HomeB
class HomeB extends Component {
  constructor(props) {
    super(props);
    let user = userProfile;
    this.state = {
      restaurant: restaurant,
      userDetails: userDetails,
      groupNumber: this.props.route.params.groupNumber,
      selectedCatId: '',
      modalVisible: false,
      categoryName: '',
      categories: [],
      products: [],
      groupNotCreated: true,
      selectedCatId: '',
    };

    console.warn(this.state.groupNumber);
  }

  navigateTo = (screen) => () => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };
  selectMember = (screen, item, flag) => () => {
    const {navigation} = this.props;
    const {dispatch} = this.props;
    dispatch({type: 'PRODUCT_DATA', payload: item});
    navigation.navigate(screen, {
      action: flag,
      categoryId: this.state.selectedCatId,
    });
  };
  onPressRemove = (item) => async () => {
    let {quantity} = item;
    let cartId = '';
    if (userCart) {
      if (userCart.cartId) {
        cartId = userCart.cartId;
      }
    }
    try {
      let deleteCartJson = {};
      deleteCartJson.productId = item.id;
      deleteCartJson.cartId = cartId;
      this.setState({
        modalVisible: true,
      });
      let response = await txnApi.deleteFromCart(deleteCartJson);
      const {dispatch} = this.props;
      dispatch({type: 'CART.DECREMENT'});
      quantity -= 1;

      const {products} = this.state;
      const index = products.indexOf(item);

      if (quantity < 0) {
        return;
      }
      products[index].quantity = quantity;

      this.setState({
        products: [...products],
      });
    } catch (error) {
      alert(error);
    }

    this.setState({
      modalVisible: false,
    });
  };

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      //Will execute when screen is focused

      this._bootstrap();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }
  _bootstrap = async () => {
    // let groupNotCreated = false;
    let catName = '';
    // console.warn(this.props.route.prams);
    // if (this.props.route.params)
    //   groupNotCreated = this.props.route.params.groupNotCreated;
    // let resId = await AsyncStorage.getItem('resId');
    let products = [];
    // let restaurantId = this.state.restaurant.id;
    let restaurantId = await AsyncStorage.getItem('resId');
    let groupNumber = this.state.groupNumber;
    // if (this.state.userGroup) {
    //   groupNumber = this.state.userGroup.group_number;
    // }

    try {
      this.setState({
        modalVisible: true,
      });
      let catResp = await productApi.getAllCategories(restaurantId);
      console.warn(catResp);
      if (catResp.length > 0) {
        let catId = catResp[0].id;
        if (this.props.route.params) {
          console.log(' params ', this.props.route.params);
          if (this.props.route.params.categoryId)
            catId = this.props.route.params.categoryId;
        }

        let response = await productApi.getProductsByCategoryId(catId);

        //let response=await productApi.getAllMenu(restaurantId)

        response.map((product, index) => {
          let p = product;
          p.quantity = 1;
          products.push(p);
        });
        let category = catResp.filter((it) => it.id.includes(catId));
        catName = category.length > 0 ? category[0].name : 'NA';
        this.setState({
          products: products,
          categories: catResp,
          categoryName: catName,
          selectedCatId: catId,
          //   groupNotCreated: groupNotCreated,
        });
      }
    } catch (error) {
      alert(' =error=' + error);
      // Error retrieving data
    }
    this.setState({
      modalVisible: false,
    });
  };
  onCategorySelect = (id, name) => async () => {
    let products = [];
    try {
      let response = await productApi.getProductsByCategoryId(id);
      response.map((product, index) => {
        let p = product;
        p.quantity = 1;
        products.push(p);
      });
      this.setState({
        products: products,
        categoryName: name,
        selectedCatId: id,
      });
    } catch (error) {
      alert(' =error=' + error);
      // Error retrieving data
    }

    /* const {navigation} = this.props;
  navigation.navigate('Category',{
    "id": id,
    "name":name
  }); */
    //this.navigateTo('Category');
  };
  onPressAdd = (item) => async () => {
    const {quantity} = item;
    const {products} = this.state;

    let addCartJson = {};

    addCartJson.userId = this.state.userDetails.id;

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

      this.setState({
        products: [...products],
      });
    } catch (e) {
      alert(e);
    }
    this.setState({
      modalVisible: false,
    });
  };

  keyExtractor = (item, index) => index.toString();

  /*renderProductItem = ({item, index}) => (
    <ProductCard
      onPress={this.navigateTo('Product')}
      onPressRemove={this.onPressRemove(item)}
      onPressAdd={this.onPressAdd(item)}
      key={index}
      activeOpacity={0.7}
      imageUri={item.imageUri}
      title={item.name}
      price={item.price}
      description={item.description}
      quantity={item.quantity}
      swipeoutDisabled
    />
  );*/

  renderProductItem = ({item, index}) => (
    <ProductCard
      // onPress={this.navigateTo('Product')}
      selectMember={this.selectMember('GroupDetail', item, 'A')}
      onPressRemove={this.onPressRemove(item)}
      onPressAdd={this.onPressAdd(item)}
      key={index}
      activeOpacity={0.7}
      imageUri={require('../../assets/img/cake_1.jpg')}
      title={item.test}
      price={item.price}
      description={item.description}
      quantity={item.quantity}
      showProdImage={true}
      swipeoutDisabled
    />
  );

  renderSeparator = () => <Divider />;

  render() {
    const {categories, products, modalVisible} = this.state;

    return (
      <SafeAreaView style={styles.screenContainer}>
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="dark-content"
        />

        <View style={styles.container}>
          <ScrollView>
            <View style={styles.categoriesContainer}>
              <View style={styles.titleContainer}>
                <Heading6 style={styles.titleText}>Categories</Heading6>
                {!this.state.groupNotCreated ? (
                  <View style={styles.titleContainer}>
                    <Icon
                      name="account-group-outline"
                      size={20}
                      color={Colors.primaryColor}
                    />
                    <Text style={styles.grpNumText}>
                      {'  ' + this.state.userGroup.groupNumber}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.grpNumText}>
                    {/* {'  ' + this.state.userGroup.groupNumber} */}
                  </Text>
                )}
                {/* <LinkButton
                  title="View all"
                  titleStyle={styles.viewAllText}
                  onPress={this.navigateTo('Categories')}
               />*/}
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesList}>
                {categories.map((category) => (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    key={category.name}
                    onPress={this.onCategorySelect(category.id, category.name)}>
                    <View style={styles.categoryContainer}>
                      <ImageBackground
                        defaultSource={imgHolder}
                        source={getImgSource(
                          require('../../assets/img/pizza_3.jpg'),
                        )}
                        style={styles.categoryThumbnail}
                        imageStyle={styles.categoryImg}>
                        <View style={styles.categoryName}>
                          <Text style={styles.categoryNameText}>
                            {category.name}
                          </Text>
                        </View>
                      </ImageBackground>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.titleContainer}>
              <Heading6 style={styles.titleText}>
                {categories.length > 0 ? this.state.categoryName : ''}
              </Heading6>
              {/* <LinkButton
                title="View all"
                titleStyle={styles.viewAllText}
                onPress={this.navigateTo('SearchResults')}
             />*/}
            </View>

            <FlatList
              data={products}
              keyExtractor={this.keyExtractor}
              renderItem={this.renderProductItem}
              ItemSeparatorComponent={this.renderSeparator}
            />
          </ScrollView>
        </View>
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
    );
  }
}
const mapStateToProps = (state) => {
  restaurant = state.restaurant;
  userDetails = state.userDetails;
  console.warn(restaurant);
  console.warn(userDetails);
  userProfile = state.postLoginData;
  restaurantData = state.restarauntData;
  userCart = state.cart;
  userGroup = state.groupData;

  return {
    registeruser: state.postLoginData,
  };
};
export default connect(mapStateToProps)(HomeB);
