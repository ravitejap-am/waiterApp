import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component, Fragment } from 'react';
import {
	FlatList,
	SafeAreaView,
	StatusBar,
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	Modal,
	Dimensions,
	ScrollView,
	Alert
} from 'react-native';

// import components
import OrderItem from '../../component/cards/OrderItemB';
import * as txnApi from '../../api/TransactionService';
// import * as txnApi from '../../api/TransactionService';

// import colors
import Colors from '../../theme/colors';
import ActivityIndicatorModal from '../../component/modals/ActivityIndicatorModal';
import SimpleLineIcons from "react-native-vector-icons/dist/SimpleLineIcons";
import DatePicker from 'react-native-datepicker';
import moment from "moment";
import EmptyState from '../../component/emptystate/EmptyState';

// OrdersC Styles
const styles = StyleSheet.create({
	topArea: { flex: 0, backgroundColor: Colors.primaryColor },
	container: {
		flex: 1,
		backgroundColor: '#efefef',
	},
	productsContainer: {
		paddingVertical: 8,
	},
	orderHeader: {
		borderWidth: 1,
		borderColor: '#ccc',
		padding: 10,
		height: 50,
		justifyContent: 'center'
  },
	centeredView: {
		height: '70%',
		marginTop: 'auto',

	},
	modalView: {
		height: '100%',
		width: '100%',
		backgroundColor: "#F0F3F4",
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		shadowColor: "#000",
		shadowOffset: {
			width: 10,
			height: 10
		},
		shadowOpacity: 1.0,
		shadowRadius: 4,
		elevation: 5
	},
	listTab: {
		marginLeft: 5,
		width: '30%',

	},
	btnTab: {
		// width: Dimensions.get('window').width / 5,
		// flexDirection: 'row',
		borderWidth: 0.5,
		borderColor: '#fff',
		// padding: 10,
		justifyContent: 'center',

	},
	listStatus: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		// padding:10,
		marginLeft: 5
	},
	textStyle: {
		textAlign: 'center',
		paddingLeft: 5,
		paddingRight: 5
	},
	orderStatus: {

		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: '#F0F3F4',
		height: 40,
		width: 90,
		borderRadius: 5,
		marginLeft: 7,
		// padding:10,
		marginTop: 7,

	},
	datepicker: {
		width: Dimensions.get('window').width / 2,
		color: '#000',
		padding: 10
	},

	bottom: {
		width: '100%',
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
		bottom: 0,
		marginLeft: '35%'
	},
	bottomView: {
		width: '40%',
		height: 40,
		backgroundColor: Colors.primaryColor,
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
		// bottom: 0, 
		borderRadius: 10,
	},
	bottomViewtextStyle: {
		color: '#fff',
		fontSize: 18,
		marginBottom: 3
	},
	headerContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
	}
});

const listTab = [
	{
		status: "All"
	},
	{
		status: "Ready"
	},
	{
		status: "Pending"
	},
	{
		status: "Confirm"
	},
	{
		status: "Delivered"
	},
	{
		status: "Cancel"
	}

]

// OrdersC
export default class OrdersC extends Component {
	constructor(props) {
		super(props);

		this.state = {
			modalVisible: false,
			orderslist: [],
			isVisible: false,
			// allTabs: listTab,
			allTabs: [
				{ label: 'All ', value: 'All Orders' },
				{ label: 'Pending ', value: 'Pending Orders' },
				{ label: 'Confirmed ', value: 'Confirmed Orders' },
				{ label: 'Ready ', value: 'Ready Orders' },
				{ label: 'Delivered ', value: 'Delivered Orders' },
				{ label: 'Paid ', value: 'Paid Orders' },
				{ label: 'Completed ', value: 'Completed Orders' },
				{ label: 'Cancel', value: 'Cancel Orders' },
			],
			// orders1: 'allOrders',
			status: "",
			lableStatus: "All Orders",
			statusPressed: null,
			bg: Colors.primaryColor,
			bg2: '#ccc',
			startDate: "",
			endDate: "",
			iconName: "food-fork-drink",
			title: "Order not found",
			message: "",
			endDateDisable:true
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
			
			let response = await txnApi.getAllOrdersByRestrauntId(restId);
			let orderslist = response && response.orderResponseList;
			console.log("orderslist", orderslist[3].productList);
			console.log("orderslist", orderslist[3].productList[0].sharedUsers);
			this.setState({ orderslist: orderslist });
			if (response.orderResponseList !== null) {
				this.setState({ modalVisible: false });
			}

		}
		catch (e) {
			console.log(e);
			this.setState({ modalVisible: false });
		}
	}


	readyOrder = (item, index) => () => {
		try {
			Alert.alert(
				"Ready Order",
				"Do you want to ready order ?",
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

	keyExtractor = (item) => item.orderNumber.toString();


	componentDidMount = () => {
		this.unsubscribe = this.props.navigation.addListener('focus', () => {
			this.orderList();
		});
		if(this.state.startDate === " "){
			this.setState({
				endDate:disabled
			})
		}
	};
	componentWillUnmount() {
		this.unsubscribe();

	}


	filter = async (show) => {
		await AsyncStorage.removeItem('selectedOrderStatus');
		this.setState({
			isVisible: show,
			status:"",
			statusPressed: null,
			startDate: "",
			endDate: "",
			endDateDisable:true
		})
	}

	closeModal = async (close) => {
		// let selectedStatus = await AsyncStorage.getItem("selectedOrderStatus");
		this.setState({
			isVisible: close,
		})
		// console.log("Order Status :", this.state.status);
	}

	selectOrderStatusType = async (id, type) => {
		try {
			this.setState({
				statusPressed: id
			})
			await AsyncStorage.setItem('selectedOrderStatus', this.state.allTabs[id].value);
			// console.log("status results:", this.state.allTabs[id].value);

			let selectedStatus = await AsyncStorage.getItem("selectedOrderStatus");
			this.setState({
				lableStatus: selectedStatus,
				status: selectedStatus
			})
			console.log("status:", this.state.status);
		}
		catch (e) {
			console.log(e);
		}
	}

	setStartDate = (event, date) => {
		var startDate = moment(date).format("YYYY-MM-DD");
		this.setState({
			startDate: startDate,
			endDateDisable:false
		})
	};

	setEndDate = (event, date) => {
		var endDate = moment(date).format("YYYY-MM-DD");
		this.setState({
			endDate: endDate
		})
	};

	getAllOrdersByDate = async () => {
		let selectedStatus = await AsyncStorage.getItem("selectedOrderStatus");
		this.setState({
			status: selectedStatus,
			lableStatus: selectedStatus
		})
		console.log("selectedStatus:", selectedStatus);
		try {
			if (this.state.status === "All Orders") {
				this.setState({
					status: ["CONFIRMED", "READY", "COMPLETED", "PENDING", "PAID", "CANCEL", "DELIVERED"]
				})
			}
			if (this.state.status === "Pending Orders") {
				this.setState({
					status: ["PENDING"]
				})
			}
			if (this.state.status === "Confirmed Orders") {
				this.setState({
					status: ["CONFIRMED"]
				})
			}
			if (this.state.status === "Delivered Orders") {
				this.setState({
					status: ["DELIVERED"]
				})
			}
			if (this.state.status === "Ready Orders") {
				this.setState({
					status: ["READY"]
				})
			}
			if (this.state.status === "Paid Orders") {
				this.setState({
					status: ["PAID"]
				})
			}
			if (this.state.status === "Completed Orders") {
				this.setState({
					status: ["COMPLETED"]
				})
			}
			if (this.state.status === "Cancel Orders") {
				this.setState({
					status: ["CANCEL"]
				})
			}

			let ordersInRangeJson = {};
			ordersInRangeJson.status = this.state.status;
			ordersInRangeJson.startDate = this.state.startDate;
			ordersInRangeJson.endDate = this.state.endDate;
		
			let ordersInRangeResponse = await txnApi.getAllOrdersInRange(ordersInRangeJson)
			let orderslist = ordersInRangeResponse && ordersInRangeResponse.orderResponseList;
			console.log("orderslist :", orderslist);
			if (ordersInRangeResponse.orderResponseList) {
				this.setState({
					orderslist: orderslist,
					modalVisible: false
				});
			}

		}
		catch (e) {
			alert("Requested details not found")
			console.log(e);
			// this.orderList();
			// this.setState({
			// 	lableStatus: "All Orders"
			// })

		}
	}
	filterOrderStatus = async (id, type) => {
		
		let selectedStatus = await AsyncStorage.getItem("selectedOrderStatus");
		this.setState({
			isVisible: false,
			status: selectedStatus,
			// lableStatus:selectedStatus
		})
		
		
		this.setState({ modalVisible: true });
		try {
			if(selectedStatus === null){
				alert("Please select order status");
				this.setState({
					modalVisible: false
				});
			}
			if(this.state.startDate){
				if(this.state.endDate === ""){
					alert("Please select end Date")
				}
			}
			
			
			let restId = await AsyncStorage.getItem('resId');
			let response = await txnApi.getAllOrdersByRestrauntId(restId);
			let orderslist = response && response.orderResponseList;

			let confirmed = orderslist.filter(it => it.orderStatus === 'CONFIRMED');
			let delivered = orderslist.filter(it => it.orderStatus === 'DELIVERED');
			let cancel = orderslist.filter(it => it.orderStatus === 'CANCEL');
			let pending = orderslist.filter(it => it.orderStatus === 'PENDING');
			let ready = orderslist.filter(it => it.orderStatus === 'READY');
			let paid = orderslist.filter(it => it.orderStatus === 'PAID');
			let completed = orderslist.filter(it => it.orderStatus === 'COMPLETED');

			if (this.state.status === "All Orders") {
				if (this.state.startDate && this.state.endDate) {
					this.getAllOrdersByDate();
					this.setState({
						modalVisible: false
					});
				} else {
					this.setState({
						orderslist: orderslist,
						modalVisible: false
					});
				}

			}
			else if (this.state.status === "Pending Orders") {
				if (this.state.startDate && this.state.endDate) {
					this.getAllOrdersByDate();
					this.setState({
						modalVisible: false
					});
				} else {
					this.setState({ orderslist: pending, modalVisible: false });
				}
			}
			else if (this.state.status === "Confirmed Orders") {
				if (this.state.startDate && this.state.endDate) {
					this.getAllOrdersByDate();
					this.setState({
						modalVisible: false
					});
				} else {
					this.setState({ orderslist: confirmed, modalVisible: false });
				}
			}
			else if (this.state.status === "Delivered Orders") {
				if (this.state.startDate && this.state.endDate) {
					this.getAllOrdersByDate();
					this.setState({
						modalVisible: false
					});
				} else {
					this.setState({ orderslist: delivered, modalVisible: false });
				}
			}

			else if (this.state.status === "Ready Orders") {
				if (this.state.startDate && this.state.endDate) {
					this.getAllOrdersByDate();
					this.setState({
						modalVisible: false
					});
				} else {
					this.setState({ orderslist: ready, modalVisible: false });
				}
			}
			else if (this.state.status === "Cancel Orders") {
				if (this.state.startDate && this.state.endDate) {
					this.getAllOrdersByDate();
					this.setState({
						modalVisible: false
					});
				} else {
					this.setState({ orderslist: cancel, modalVisible: false });
				}
			}
			else if (this.state.status === "Paid Orders") {
				if (this.state.startDate && this.state.endDate) {
					this.getAllOrdersByDate();
					this.setState({
						modalVisible: false
					});
				} else {
					this.setState({ orderslist: paid, modalVisible: false });
				}
			}
			else if (this.state.status === "Completed Orders") {
				if (this.state.startDate && this.state.endDate) {
					this.getAllOrdersByDate();
					this.setState({
						modalVisible: false
					});
				} else {
					this.setState({ orderslist: completed, modalVisible: false });
				}
			}



		}
		catch (e) {
			console.log(e);
			this.setState({ modalVisible: false });
		}

	}

	renderItem = ({ item, index }) => (
		<OrderItem
			key={index}
			activeOpacity={0.8}
			orderNumber={item.orderNumber}
			orderPlacedDate={item.orderPlacedDate}
			total={item.total}
			orderStatus={item.orderStatus}
			productList={item.productList}
			tip={item.tip}
			serviceCharges={item.serviceCharges}
			salesTax={item.salesTax}
			readyOrder={this.readyOrder(item, index)}
			cancelOrder={this.cancelOrder(item, index)}
		/>
	);

	render() {
		const { modalVisible, orderslist, statusPressed, bg, bg2 } = this.state;

		return (
			<Fragment>
				<SafeAreaView style={styles.container}>
					<StatusBar
						backgroundColor={Colors.primaryColor}
						barStyle="light-content"
					/>

					<View style={styles.headerContainer}>
						<View style={{ flexDirection: 'row', flex: 4 }}>
							<View style={[styles.orderHeader, { flex: 3 }]}>
								<Text>{this.state.lableStatus}</Text>
							</View>
							<View style={[styles.orderHeader, { flex: 1, alignItems: 'center' }]}>
								<TouchableOpacity
									style={{ flexDirection: 'row' }}
									onPress={() => this.filter(true)}
								>
									<View style={{ marginRight: 10 }}>

										<Text>Filter</Text>

									</View>

									<View style={{ justifyContent: 'center' }}>
										<SimpleLineIcons
											style={{ font: 'bold' }}
											name={"arrow-down"}
											size={12}
											color={'#000'}
										/>
									</View>
								</TouchableOpacity>
							</View>

						</View>
					</View>

					{this.state.orderslist.length === 0 ? (
							<EmptyState
								showIcon
								iconName={this.state.iconName}
								title={this.state.title}
								message={this.state.message}
							/>
						) : (
					
						<FlatList
							data={orderslist}
							renderItem={this.renderItem}
							keyExtractor={this.keyExtractor}
							contentContainerStyle={styles.productsContainer}
						/>
					
					)}
				</SafeAreaView>


				<Modal
					animationType={"slide"}
					transparent={true}
					visible={this.state.isVisible}>
					<View style={styles.centeredView}>
						<View style={styles.modalView}>
							<View style={{ padding: 20 }}>
								<TouchableOpacity
									style={{ justifyContent: 'center', alignItems: 'flex-end' }}
									onPress={() => this.closeModal(false)}>
									<Text style={{ fontWeight: 'bold' }}>Close</Text>
								</TouchableOpacity>
							</View>

							<View
								style={{
									borderBottomColor: '#ccc',
									borderBottomWidth: 1,
								}}
							/>
							<View style={{ padding: 10, }}>
								<Text style={{ fontSize: 16, fontWeight: 'bold' }}>Order Status</Text>
							</View>
							<View>
								<View style={styles.listStatus}>
									{this.state.allTabs.length > 0 && this.state.allTabs.map((item, index) => {
										return (
											<TouchableOpacity onPress={() => this.selectOrderStatusType(index)}
												style={[styles.orderStatus, { backgroundColor: statusPressed === index ? bg : bg2 }]}
											>
												<Text
													key={`allTabs-${index}`}
													style={styles.textStyle}>
													{item.label}
												</Text>
											</TouchableOpacity>
										);
									})}
								</View>
							</View>

							<View style={{ padding: 10, paddingTop: 10 }}>
								<Text style={{ fontSize: 16, fontWeight: 'bold', paddingTop: 10 }}>Filter Order By Date</Text>
							</View>

							<View style={{ flexDirection: 'row' }}>
								<View>
									<DatePicker
										style={styles.datepicker}
										date={this.state.startDate}
										mode="date"
										placeholder="Start date"
										format="YYYY-MM-DD"
										confirmBtnText="Confirm"
										cancelBtnText="Cancel"
										minDate={moment().subtract(100, "years")}
										maxDate={moment().subtract(0, "years")}
										showIcon={true}
										onDateChange={this.setStartDate}
										customStyles={{
											dateInput: {
												borderLeftWidth: 0,
												borderRightWidth: 0,
												borderTopWidth: 0,
											}
										}}
									/>
								</View>
								<View>
									<DatePicker
										style={styles.datepicker}
										date={this.state.endDate}
										mode="date"
										placeholder="End date"
										format="YYYY-MM-DD"
										confirmBtnText="Confirm"
										cancelBtnText="Cancel"
										// minDate={this.state.startDate}
										minDate={new Date(this.state.startDate)}
										maxDate={moment().subtract(0, "years")}
										onDateChange={this.setEndDate}
										disabled={this.state.endDateDisable}
										showIcon={true}
										customStyles={{
											dateInput: {
												borderLeftWidth: 0,
												borderRightWidth: 0,
												borderTopWidth: 0,
											}
										}}
									/>
								</View>

							</View>


							<View style={styles.bottom}>
								<View style={styles.bottomView}>
									{/* <Text style={styles.bottomViewtextStyle}>Filter Order</Text> */}
									<TouchableOpacity
										onPress={this.filterOrderStatus}
									>
										<Text style={styles.bottomViewtextStyle}>Apply</Text>
									</TouchableOpacity>
								</View>

							</View>


						</View>

					</View>

				</Modal>
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