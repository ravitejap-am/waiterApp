import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component, Fragment } from 'react';
import {
    FlatList,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    View,
    Alert,
    ScrollView
} from 'react-native';
import { Heading6 } from '../../component/text/CustomText';
// import components
import OrderItem from '../../component/cards/OrderItemB';
import * as txnApi from '../../api/TransactionService';


// import colors
import Colors from '../../theme/colors';
import ActivityIndicatorModal from '../../component/modals/ActivityIndicatorModal';

// PendingOrder Styles
const styles = StyleSheet.create({
    topArea: { flex: 0, backgroundColor: Colors.primaryColor },
    // container: {
    //     flex: 1,
    //     backgroundColor: '#efefef',
    // },
    productsContainer: {
        paddingVertical: 8,
    },

    screenContainer: {
        flex: 1,
        // backgroundColor: Colors.background,
        backgroundColor: '#e3e3e3',
        paddingBottom: 0,
    },
    container: {
        flex: 1,
    },
    titleContainer: {
        // flexDirection: 'row',
        // justifyContent: 'space-between',
        // alignItems: 'center',
        // paddingTop: 16,
        // paddingHorizontal: 20,
        paddingHorizontal: 16,
        // paddingBottom: 12,
        backgroundColor: '#fff',
    },
    titleText: {
        paddingVertical: 16,
        fontWeight: '700',
        textAlign: 'left',
    },
});

// PendingOrder
export default class PendingOrder extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false,
            orderList: [],

        };
    }

    goBack = () => {
        const { navigation } = this.props;
        navigation.goBack();
    };

    navigateTo = (screen) => () => {
        const { navigation } = this.props;
        navigation.navigate(screen);
    };
    orderList = async () => {
        try {
            this.setState({ modalVisible: true });
            let restId = await AsyncStorage.getItem('resId');
            let response = await txnApi.getAllPendingOrdersByRestrauntId(restId);
            let orderslist = response && response.orderResponseList;
            // console.log("orderslist:",orderslist);
            // orderslist.map((item)=>{item.groupNumber})
            this.setState({ orderList: orderslist });
            if (response.orderResponseList !== null) {
                this.setState({ modalVisible: false });
            }
        }
        catch (e) {
            console.log(e);
            this.setState({ modalVisible: false });
        }
    }

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.orderList();
        });
    };
    componentWillUnmount() {
        this.unsubscribe();
    }

    keyExtractor = (item) => item.orderNumber.toString();

    readyOrder = (item, index) => () => {
        try {
            Alert.alert(
                "Completed Order",
                "Do you want to confirm order ?",
                [
                  {
                    text: "No",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                  },
                  { text: "Yes", onPress: () => this.readyPendingOrder(item) }
                ]
              );
        }
        catch (e) {
            console.log(e);
        }
    };
    readyPendingOrder = async (item) => {
        let resId = await AsyncStorage.getItem('resId')
        let confirmOrder = false;

        try {
            let data = {};
            data.orderId = item.id;
            data.resId = resId;
            data.status = "READY"
            console.log("requestJson :", data);
            let confirmOrderRes = await txnApi.changeOrderStatus(data);
            console.log("confirmOrderRes :", confirmOrderRes);
            if (confirmOrderRes) {
                confirmOrder = true;
                alert(confirmOrderRes.data);
                this.orderList();
            }
        } catch (e) {
            alert(e);
        }
        return confirmOrder;
    };

    cancelOrder = (item, index) => () => {
        try {
            Alert.alert(
                "Cancel Order",
                "Do you want to cancel the order ?",
                [
                  {
                    text: "No",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                  },
                  { text: "Yes", onPress: () => this.cancelPendingOrder(item) }
                ]
              );
        }
        catch (e) {
            console.log(e);
        }
    };
    cancelPendingOrder = async (item) => {
        let resId = await AsyncStorage.getItem('resId')
        let cancelPendingOrder = false;
        try {
            let data = {};
            data.orderId = item.id;
            data.resId = resId;
            data.status = "CANCEL"
            console.log("requestJson :", data);
            let confirmOrderRes = await txnApi.changeOrderStatus(data);
            console.log("confirmOrderRes :", confirmOrderRes);
            if (confirmOrderRes) {
                cancelPendingOrder = true;
                alert(confirmOrderRes.data);
                this.orderList();
            }
        } catch (e) {
            alert(e);
        }
        return cancelPendingOrder;
    };

    renderItem = ({ item, index }) => (
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
            readyOrder={this.readyOrder(item, index)}
            cancelOrder={this.cancelOrder(item,index)}
        />
    );

    render() {
        const { modalVisible, orderList } = this.state;

        return (
            <SafeAreaView style={styles.screenContainer}>
                <StatusBar
                    backgroundColor={Colors.statusBarColor}
                    barStyle="dark-content"
                />
                <View style={styles.container}>
                    {/* <ScrollView> */}
                    <View style={styles.categoriesContainer}>
                        <View style={styles.titleContainer}>
                            <Heading6 style={styles.titleText}>Pending Orders</Heading6>
                        </View>
                        <FlatList
                            data={orderList}
                            renderItem={this.renderItem}
                            keyExtractor={this.keyExtractor}
                            contentContainerStyle={styles.productsContainer}
                        />
                    </View>

                    {/* </ScrollView> */}
                </View>
                <ActivityIndicatorModal
                    message="Please wait . . ."
                    onRequestClose={this.closeModal}
                    statusBarColor={Colors.primaryColor}
                    title="Loading.."
                    visible={modalVisible}
                />
            </SafeAreaView>
        );
    }
}




