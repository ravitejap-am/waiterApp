import React, {Component, Fragment} from 'react';
import {
  FlatList,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Color from 'color';

// import utils
import getImgSource from '../../utils/getImgSource.js';

// import components
import TouchableItem from '../../component/TouchableItem';

// import colors, layout
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';
import * as productApi from '../../api/ProductService';
// CategoriesB Config
// CARD_WIDTH = (SCREEN_WIDTH - 2 * categoriesContainer.padding - 4 * card.margin) / 2
const CARD_WIDTH = (Layout.SCREEN_WIDTH - 2 * 8 - 4 * 8) / 2;
const CARD_HEIGHT = CARD_WIDTH * 1.08;
const CARD_BORDER_RADIUS = 6;

// CategoriesB Styles
const styles = StyleSheet.create({
  topArea: {flex: 0, backgroundColor: Colors.primaryColor},
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  categoriesContainer: {
    padding: 8,
  },
  cardImg: {
    borderRadius: CARD_BORDER_RADIUS,
  },
  card: {
    margin: 8,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    resizeMode: 'cover',
  },
  cardOverlay: {
    flex: 1,
    borderRadius: CARD_BORDER_RADIUS,
    // backgroundColor: Color(Colors.overlayColor).alpha(0.24),
    backgroundColor: '#b90039',
    overflow: 'hidden',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cardTitle: {
    paddingBottom: 2,
    fontWeight: '700',
    fontSize: 20,
    color: Colors.white,
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.88)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  items: {
    paddingBottom: 28,
    fontWeight: '700',
    fontSize: 13,
    color: Colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.88)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
});

// CategoriesB
export default class CategoriesB extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categories: [
        {
          key: 1,
          imageUri: require('../../assets/img/pizza_3.jpg'),
          name: 'Pizza',
          items: 17,
        },
        {
          key: 2,
          imageUri: require('../../assets/img/meat_1.jpg'),
          name: 'Grill',
          items: 48,
        },
        {
          key: 3,
          imageUri: require('../../assets/img/spaghetti_2.jpg'),
          name: 'Pasta',
          items: 23,
        },
        {
          key: 4,
          imageUri: require('../../assets/img/soup_1.jpg'),
          name: 'Soups',
          items: 9,
        },
        {
          key: 5,
          imageUri: require('../../assets/img/salad_1.jpg'),
          name: 'Salads',
          items: 15,
        },
        {
          key: 6,
          imageUri: require('../../assets/img/cake_2.jpg'),
          name: 'Dessert',
          items: 26,
        },
      ],
    };
  }
  componentDidMount = () => {
    this._bootstrap();
  };

  _bootstrap = async () => {
    try {
      let categorList = [];
      let catResp = await productApi.getAllCategories(1);

      catResp.map((category, index) => {
        let cat = {};
        cat.key = index;
        cat.name = category.name;
        cat.imageUri = require('../../assets/img/cake_2.jpg');
        cat.items = 10;
        cat.id = category.id;

        categorList.push(cat);
      });
      this.setState({
        categories: categorList,
      });
    } catch (error) {
      // alert(' =error= Categories' + error);
      // Error retrieving data
    }
  };
  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };
  onCategorySelect = (id, name) => () => {
    const {navigation} = this.props;
    navigation.navigate('Category', {
      id: id,
      name: name,
    });
    //this.navigateTo('Category');
  };
  navigateTo = (screen) => () => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };

  keyExtractor = (item) => item.key;

  renderCategoryItem = ({item, index}) => (
    <ImageBackground
      key={index}
      source={getImgSource(item.imageUri)}
      imageStyle={styles.cardImg}
      style={styles.card}>
      <View style={styles.cardOverlay}>
        <TouchableItem
          onPress={this.onCategorySelect(item.id, item.name)}
          style={styles.cardContainer}
          // borderless
        >
          <Fragment>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.items}>{`${item.items} items`}</Text>
          </Fragment>
        </TouchableItem>
      </View>
    </ImageBackground>
  );

  render() {
    const {categories} = this.state;

    return (
      <Fragment>
        <SafeAreaView style={styles.topArea} />
        <SafeAreaView style={styles.screenContainer}>
          <StatusBar
            backgroundColor={Colors.primaryColor}
            barStyle="light-content"
          />

          <FlatList
            data={categories}
            showsHorizontalScrollIndicator={false}
            alwaysBounceHorizontal={false}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderCategoryItem}
            numColumns={2}
            contentContainerStyle={styles.categoriesContainer}
          />
        </SafeAreaView>
      </Fragment>
    );
  }
}
