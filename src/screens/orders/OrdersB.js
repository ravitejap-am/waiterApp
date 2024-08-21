import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component, Fragment} from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

// import components
import OrderItem from '../../component/cards/OrderItemB';
import * as txnApi from '../../api/TransactionService'

// import colors
import Colors from '../../theme/colors';
import ActivityIndicatorModal from '../../component/modals/ActivityIndicatorModal';

// OrdersB Styles
const styles = StyleSheet.create({
  topArea: {flex: 0, backgroundColor: Colors.primaryColor},
  container: {
    flex: 1,
    backgroundColor: '#efefef',
  },
  productsContainer: {
    paddingVertical: 8,
  },
});

// OrdersB
export default class OrdersB extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible:false,
      orderList:[],
      // orders: [
      //   {
      //     orderNumber: '11',
      //     orderDate: '22 July, 2019',
      //     orderStatus: 'on-the-way',
      //     orderItems: [
      //       {
      //         name: 'Pizza',
      //         price: 4.99,
      //       },
      //       {
      //         name: 'Grill',
      //         price: 8.99,
      //       },
      //       {
      //         name: 'Pasta',
      //         price: 5.99,
      //       },
      //     ],
      //   },
      //   {
      //     orderNumber: '10',
      //     orderDate: '10 July, 2019',
      //     orderStatus: 'pending',
      //     orderItems: [
      //       {
      //         name: 'Pizza One',
      //         price: 7.99,
      //       },
      //       {
      //         name: 'Pizza Mozzarella',
      //         price: 8.99,
      //       },
      //       {
      //         name: 'Pizza Gorgonzola',
      //         price: 6.99,
      //       },
      //       {
      //         name: 'Pizza Funghi',
      //         price: 9.99,
      //       },
      //     ],
      //   },
      //   {
      //     orderNumber: '09',
      //     orderDate: '05 July, 2019',
      //     orderStatus: 'delivered',
      //     orderItems: [
      //       {
      //         name: 'Pizza Mozzarella',
      //         price: 8.99,
      //       },
      //       {
      //         name: 'Pizza Gorgonzola',
      //         price: 6.99,
      //       },
      //       {
      //         name: 'Pizza Funghi',
      //         price: 9.99,
      //       },
      //     ],
      //   },
      // ],
    };
  }

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  navigateTo = (screen) => () => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };
  orderList =async()=>{
    try{
      this.setState({ modalVisible: true });
      let restId = await AsyncStorage.getItem('resId');
      console.log("resId",restId);
      let response = await txnApi.getAllOrdersByRestrauntId(restId);
      // console.log("%%%%%% order response  %%%%%  : ",response.orderResponseList);
      // let orderslist = response?.data?.orderResponseList;
      let orderslist = response && response.orderResponseList;
      // console.log("%%%%%%%%%%%%%%%%%%%%  order list %%%%%%%%%%%%%%%%%%  : ", orderslist)
      // let paid = orderslist.filter(it => it.orderStatus === 'PAID');
      this.setState({ orderList:orderslist });
      if (response.orderResponseList !== null) {
        this.setState({ modalVisible: false });
      }

    }
    catch(e){
      console.log(e);
      this.setState({ modalVisible: false });
    }
  }

  componentDidMount(){
    this.orderList();
  }

  keyExtractor = (item) => item.orderNumber.toString();

  renderItem = ({item, index}) => (
    <OrderItem
      key={index}
      activeOpacity={0.8}
      orderNumber={item.orderNumber}
      orderPlacedDate={item.orderPlacedDate}
      total={item.total}
      orderStatus={item.orderStatus}
      productList={item.productList}
      // orderPlacedDate={item.orderItems}
      // orderStatus={item.orderStatus}
      // onPress={this.navigateTo('Product')}
    />
  );

  render() {
    const {modalVisible,orderList} = this.state;

    return (
      <Fragment>
        <SafeAreaView style={styles.topArea} />
        <SafeAreaView style={styles.container}>
          <StatusBar
            backgroundColor={Colors.primaryColor}
            barStyle="light-content"
          />

          <View style={styles.container}>
            <FlatList
              data={orderList}
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
              contentContainerStyle={styles.productsContainer}
            />
          </View>
        </SafeAreaView>
        <ActivityIndicatorModal
          message="Please wait . . ."
          onRequestClose={this.closeModal}
          statusBarColor={Colors.primaryColor}
          title="Loading.."
          visible={modalVisible}
        />
      </Fragment>
    );
  }
}



// import AsyncStorage from '@react-native-community/async-storage';
// import React, {Component, Fragment} from 'react';
// import {
//   FlatList,
//   SafeAreaView,
//   StatusBar,
//   StyleSheet,
//   View,
// } from 'react-native';

// // import components
// import OrderItem from '../../component/cards/OrderItemB';

// // import colors
// import Colors from '../../theme/colors';

// // OrdersB Styles
// const styles = StyleSheet.create({
//   topArea: {flex: 0, backgroundColor: Colors.primaryColor},
//   container: {
//     flex: 1,
//     backgroundColor: '#efefef',
//   },
//   productsContainer: {
//     paddingVertical: 8,
//   },
// });

// // OrdersB
// export default class OrdersB extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       orders: [
//         {
//           orderNumber: '11',
//           orderDate: '22 July, 2019',
//           orderStatus: 'on-the-way',
//           orderItems: [
//             {
//               name: 'Pizza',
//               price: 4.99,
//             },
//             {
//               name: 'Grill',
//               price: 8.99,
//             },
//             {
//               name: 'Pasta',
//               price: 5.99,
//             },
//           ],
//         },
//         {
//           orderNumber: '10',
//           orderDate: '10 July, 2019',
//           orderStatus: 'pending',
//           orderItems: [
//             {
//               name: 'Pizza One',
//               price: 7.99,
//             },
//             {
//               name: 'Pizza Mozzarella',
//               price: 8.99,
//             },
//             {
//               name: 'Pizza Gorgonzola',
//               price: 6.99,
//             },
//             {
//               name: 'Pizza Funghi',
//               price: 9.99,
//             },
//           ],
//         },
//         {
//           orderNumber: '09',
//           orderDate: '05 July, 2019',
//           orderStatus: 'delivered',
//           orderItems: [
//             {
//               name: 'Pizza Mozzarella',
//               price: 8.99,
//             },
//             {
//               name: 'Pizza Gorgonzola',
//               price: 6.99,
//             },
//             {
//               name: 'Pizza Funghi',
//               price: 9.99,
//             },
//           ],
//         },
//       ],
//     };
//   }

//   goBack = () => {
//     const {navigation} = this.props;
//     navigation.goBack();
//   };

//   navigateTo = (screen) => () => {
//     const {navigation} = this.props;
//     navigation.navigate(screen);
//   };
//   orderList =async()=>{
//     try{
//       this.setState({ modalVisible: true });
//       let restId = await AsyncStorage.getItem('resId');
//       let response = await txnApi.getAllOrdersByRestrauntId(restId);
//       let orderslist = response && response.data && response.data.orderResponseList;
//       console.log("%%%%%%%%%%%%%%%%%%%%  order list %%%%%%%%%%%%%%%%%%", postList)
//       this.setState({ orderList:orderslist });
//       if (response.data.orderResponseList !== null) {
//         this.setState({ modalVisible: false });
//       }

//     }
//     catch(e){
//       console.log(e);
//       this.setState({ modalVisible: false });
//     }
//   }

//   componentDidMount(){
//     this.orderList();
//   }

//   keyExtractor = (item) => item.orderNumber.toString();

//   renderItem = ({item, index}) => (
//     <OrderItem
//       key={index}
//       activeOpacity={0.8}
//       orderNumber={item.orderNumber}
//       orderDate={item.orderDate}
//       orderItems={item.orderItems}
//       orderStatus={item.orderStatus}
//       // onPress={this.navigateTo('Product')}
//     />
//   );

//   render() {
//     const {orders} = this.state;

//     return (
//       <Fragment>
//         <SafeAreaView style={styles.topArea} />
//         <SafeAreaView style={styles.container}>
//           <StatusBar
//             backgroundColor={Colors.primaryColor}
//             barStyle="light-content"
//           />

//           <View style={styles.container}>
//             <FlatList
//               data={orders}
//               renderItem={this.renderItem}
//               keyExtractor={this.keyExtractor}
//               contentContainerStyle={styles.productsContainer}
//             />
//           </View>
//         </SafeAreaView>
//       </Fragment>
//     );
//   }
// }
