import React, { Component } from 'react';
import {
  ImageBackground,
  ScrollView,
  Button,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert
} from 'react-native';
import Color from 'color';
// import utils
import getImgSource from '../../utils/getImgSource.js';
import { connect } from 'react-redux';
// import components
import Divider from '../../component/divider/Divider';
import { Heading6 } from '../../component/text/CustomText';
import GradientContainer from '../../component/gradientcontainer/GradientContainer';
import LinkButton from '../../component/buttons/LinkButton';
import ProductCard from '../../component/cards/ProductCard';
import SafeAreaView from '../../component/SafeAreaView';
import ActivityIndicatorModal from '../../component/modals/ActivityIndicatorModal';
import Icon from '../../component/icon/Icon';

// import colors
import Colors from '../../theme/colors';

// HomeB Config
const imgHolder = require('../../assets/img/test.jpg');
//api
import * as productApi from '../../api/ProductService';
import * as api from '../../api/AuthService';
import * as txnApi from '../../api/TransactionService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// HomeB Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    // backgroundColor: Colors.background,
    backgroundColor: '#e3e3e3',
    paddingBottom: 0,
  },
  container: {
    flex: 1,
  },
  categoriesContainer: {
    // paddingBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 12,
    // backgroundColor: 'red',
  },
  titleText: {
    // fontWeight: '700',
    color: 'orange',
    fontSize: 22,
  },
  viewAllText: {
    color: Colors.primaryColor,
  },
  categoriesList: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    margin: 10,
    borderRadius: 20,
  },
  grad: {
    borderRadius: 20,
  },
  categoryContainer: {
    marginBottom: 22,
    width: 155,
    height: 155,
    backgroundColor: 'orange',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 5.46,
    elevation: 9,
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
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 6,
    justifyContent: 'center',
    flexDirection: 'column',
    marginVertical: '20%',
  },
  tableNumber: {
    textAlign: 'center',
    fontSize: 30,
    color: Colors.accentColor,
  },
  tableLine: {
    flexDirection: 'row',
    // alignSelf: 'center',
    height: 20,
    bottom: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  releaseTable: {
    // marginLeft:15,
    height: 55,
    width: 55,
    justifyContent: 'center',
    alignItems: 'center',
    // borderColor:'#fff',
    // borderRadius:15,
    // borderWidth:1,
    // backgroundColor: '#fff',
  },
  releaseText: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign:'center',
    position:'absolute',
    // color:'#fff'
    // borderColor: '#fff',
    // borderRadius: 15,
    // borderWidth: 1,
    // backgroundColor: '#fff',
    // height: 15,
    // width: 15,
    
    marginLeft: 20
  },
  tableLineRed: {
    alignSelf: 'center',
    //bottom: 12,
    backgroundColor: 'red',
    borderRadius: 15,
    // position: 'absolute',
    // justifyContent:'center',
    // alignItems:'center',
    // paddingLeft:20,
    marginLeft:20,
    height: 15,
    width: 15,
  },
  tableLineGreen: {
    alignSelf: 'center',
    bottom: 0,
    backgroundColor: 'green',
    borderRadius: 15,
    position: 'absolute',
    height: 15,
    width: 15,
  },
  categoryNameText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.accentColor,
    letterSpacing: 0.6,
    textTransform: 'capitalize',
    marginTop: 10,
  },
});
// let postLoginData = {};
let restaurant = {};
let userDetails = {};
let userCart = {};
let userProfile = {

};
// HomeB
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // postLoginData: postLoginData,
      restaurant: restaurant,
      // user: userDetails.firstName,
      selectedCatId: '',
      tableList: [],
      modalVisible: false,
      loggedInUser: userProfile,
      table: [
        {
          key: 1,
          name: 'Vaibhav',
          number: '1',
          color: 'red',
        },
      ],
      categories: [
        {
          key: 1,
          imageUri: require('../../assets/img/pizza_3.jpg'),
          name: 'No 1',
        },
      ],
      products: [
        {
          imageUri: require('../../assets/img/pizza_1.jpg'),
          name: 'Pizza Margarita 35cm',
          price: 10.99,
          description:
            'Made with San Marzano tomatoes, mozzarella cheese, fresh basil, salt and extra-virgin olive oil',
          quantity: 0,
        },
      ],
    };
  }

  navigateTo = (screen) => () => {
    const { navigation } = this.props;
    navigation.navigate(screen);
  };

  componentDidMount = () => {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {

      this._bootstrap();
    });
  };
  componentWillUnmount() {
    this.unsubscribe();
  }

  _bootstrap = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      console.log("token Id", userToken);
      // const resId = this.state.restaurant.id;
      let resId = await AsyncStorage.getItem('resId')
      
      this.setState({
        restraunt: resId,
        modalVisible: true,
      })
      let getTableListResponse = await api.getTableList(resId);
      
      if (getTableListResponse.data) {
        this.setState({
          modalVisible: false,
          tableList: getTableListResponse.data,
        });
      }
    } catch (e) {
      this.setState({
        modalVisible: false,
        tableList: null,
      });
    }
  };
  onCategorySelect = (id, group) => async () => {
    try {
      const { navigation } = this.props;
      const { dispatch } = this.props;;
      //console.log("group", group.tableStatus);

      if (group.tableStatus !== "INACTIVE") {
        // if(group.tableStatus !==null){
        navigation.navigate('OrderDetail', {
          id: id,
          groupNumber: group.groupNumber,
          restId: group.restraunt.id,
        });
        // }
      } else {
        navigation.navigate('Group', {
          id: id,
        });
      }
    }
    catch (e) {
      console.log(e);
    }
  };

  confirm = () => {
    // console.warn(this.state.tableList);
    this.state.tableList.map((table) => {
      console.warn(table.restrauntGroup);
    });
  };

  keyExtractor = (item, index) => index.toString();

  renderSeparator = () => <Divider />;

  releaseTable = async (id, group) => {
    const { navigation } = this.props;
    // this.setState({modalVisible: true})

    try {
      let user_Id = await AsyncStorage.getItem("userProfile");
      let userId = JSON.parse(user_Id)
      //console.log("user Id :", userId.id);

      let releaseTableJson = {};
      releaseTableJson.resId = group.restraunt.id;
      releaseTableJson.groupNumber = group.groupNumber;
      releaseTableJson.tableNumber = group.tableNumber;
      releaseTableJson.ownerId = userId.id;
      //console.log("releaseTableJson :", releaseTableJson);

      let response = await api.releaseTable(releaseTableJson);
      //console.log("response :", response);
      if (response) {
        navigation.navigate('Home');
        this._bootstrap();
        alert(response.data);
      }
    }
    catch (e) {
      console.log(e);
      // this.setState({modalVisible: false})
    }
  }
  deleteTable = async (id, group) => {
    // this.setState({modalVisible: true})
    try {
      Alert.alert(
        "Release Table",
        "Do you want to release the table ?",
        [
          {
            text: "No",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "Yes", onPress: () => this.releaseTable(id, group) }
        ]
      );
      // this.setState({modalVisible: false})
    }
    catch (e) {
      console.log(e);
      // this.setState({modalVisible: false})
    }
  }

  render() {
    const {
      categories,
      products,
      modalVisible,
      table,
      tableList,
      restaurant,
    } = this.state;
    console.log("getTableListResponse.data Id", tableList);
    return (
      <SafeAreaView style={styles.screenContainer}>
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="dark-content"
        />

        <View style={styles.container}>
          {/* <ImageBackground source={imgHolder} style={styles.image}> */}
          <ScrollView>
            <View style={styles.categoriesContainer}>
              <View style={styles.titleContainer}>
                <Heading6 style={styles.titleText}>Tables</Heading6>
              </View>

              <ScrollView
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesList}>
                {tableList == null ? (
                  <Text>No Table Found</Text>
                ) : (
                  tableList.map((table, index) => (
                    <View style={styles.categoryContainer}>
                      {/* <View> */}
                        <TouchableOpacity
                          activeOpacity={0.7}
                          key={index}
                          onPress={this.onCategorySelect(
                            table.tableNumber,
                            table.restrauntGroup,
                          )}>
                          <View >
                            <View style={styles.categoryName}>
                              <Text style={styles.tableNumber}>
                                {table.tableNumber}
                              </Text>
                              <Text style={styles.categoryNameText}>
                                {table.restrauntGroup ? (
                                  <Text>
                                    {table.restrauntGroup.tableStatus == 'ACTIVE'
                                      ? table.restrauntGroup.members[0].firstName
                                      : 'N/A'}
                                  </Text>
                                ) : (
                                  <Text>{ }</Text>
                                )}
                              </Text>
                            </View>

                          </View>
                        </TouchableOpacity>
                      {/* </View> */}
                      <View>
                        {table.restrauntGroup && (table.restrauntGroup.tableStatus === "INACTIVE") ? (

                          <View style={styles.tableLineGreen}></View>

                        ) : (

                          <View style={styles.tableLine}>
                            <View style={styles.tableLineRed}></View>

                            <View style={styles.releaseTable}>
                              <TouchableOpacity
                                style={styles.releaseText}
                                key={index}
                                onPress={() => this.deleteTable(
                                  table.tableNumber,
                                  table.restrauntGroup)}
                              >
                                <Icon
                                    name={"open-outline"}
                                    size={20}
                                    color={"red"}
                                    // style={{fontWeight:"300"}}
                                  />
                                {/* <Text style={{color:'#000',fontSize:10,bottom:0,fontSize:8}}>TR</Text> */}
                              </TouchableOpacity>

                            </View>
                          </View>
                        )
                        }
                      </View>
                    </View>
                  ))
                )}
              </ScrollView>
            </View>
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

  //console.log("user", state.postLoginData);
  userProfile = state.postLoginData;
  restaurant = state.restaurant;
  return {
    registeruser: state.postLoginData
  };
};
export default connect(mapStateToProps)(Home);
