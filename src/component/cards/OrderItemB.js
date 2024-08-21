/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Color from 'color';

// import components
import Button from '../buttons/Button';
import { Caption, Subtitle1, Subtitle2 } from '../text/CustomText';
import TouchableItem from '../TouchableItem';

// import colors, layout
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';

// OrderItemB Config

// OrderItemB Styles
const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    marginHorizontal: 12,
    borderRadius: 16,
    backgroundColor: Colors.background,
  },
  content: {
    width: Layout.SCREEN_WIDTH - 2 * 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  orderNumber: {
    paddingBottom: 2,
    fontWeight: 'bold',
    color: Colors.primaryColorDark,
    textAlign: 'left',
  },
  flexEnd: {
    alignItems: 'flex-end',
  },
  divider: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#efefef',
  },
  circleMask: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#efefef',
  },
  leftCircle: {
    left: -9,
  },
  rightCircle: {
    right: -9,
  },
  pv8: {
    paddingVertical: 8,
  },
  itemContainer: {
    marginVertical: 4,
    backgroundColor: Colors.background,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 36,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  extraSmallButton: {
    width: 100,
    height: 34,
    borderRadius: 17,
    paddingLeft: 40
  },
  status: {
    textAlign: 'left',
  },
  onTheWay: {
    color: Colors.tertiaryColor,
  },
  pending: {
    color: Colors.secondaryColor,
  },
  delivered: {
    color: Colors.primaryColor,
  },
  paid:{
    color: Colors.primaryColorDark,
  },
  completed:{
    color: Colors.primaryColorDark,
  },
  ready:{
    color: Colors.primaryColorDark,
  }
});

const renderOrderItemsTotal = (items) => {
  const total = items.reduce((prev, next) => prev + next.price, 0);
  return total;
};

// OrderItemB Props
type Props = {
  onPress: () => {},
  readyOrder: () => void,
  cancelOrder: () => void,
  activeOpacity: number,
  orderNumber: number,
  orderPlacedDate: string,
  userId: String,
  orderItems: Array,
  productList: Array,
  orderStatus: string,
  total: Number,
};

// OrderItemB
const OrderItemB = ({
  onPress,
  readyOrder,
  cancelOrder,
  activeOpacity,
  orderNumber,
  orderPlacedDate,
  userId,
  total,
  orderItems,
  productList,
  orderStatus,
  tip,
  serviceCharges,
  salesTax,

}: Props) => (
  <View style={styles.container}>
    <View style={styles.content}>
      <View style={styles.header}>
        <View>
          <Subtitle2 style={styles.orderNumber}>
            {`Order for Group #${orderNumber}`}
          </Subtitle2>
          <Caption>{orderPlacedDate}</Caption>
        </View>
        <View style={styles.flexEnd}>
          <Subtitle1>{`$ ${total.toFixed(2)}`}</Subtitle1>
          <Caption>{`${productList.length} items`}</Caption>
        </View>
      </View>

      <View style={styles.divider}>
        <View style={[styles.circleMask, styles.leftCircle]} />
        <View style={styles.dividerLine} />
        <View style={[styles.circleMask, styles.rightCircle]} />
      </View>

      <View style={styles.pv8}>
        {productList.length > 0 && productList.map((item, index) => (
          <View key={index.toString()} style={styles.itemContainer}>
            <TouchableItem onPress={onPress} activeOpacity={activeOpacity}>
              <View style={styles.item}>
                <Subtitle2 style={{ flex: 5 }}>{item.name}</Subtitle2>
                <Subtitle2 >{`$ ${(item.quantity*item.price).toFixed(2)}`}</Subtitle2>
              </View>
            </TouchableItem>
          </View>
        ))}

      </View>
      <View style={styles.divider}>
        <View style={[styles.circleMask, styles.leftCircle]} />
        <View style={styles.dividerLine} />
        <View style={[styles.circleMask, styles.rightCircle]} />
      </View>
      {orderStatus === 'COMPLETED' && (
        <View>
          <View style={styles.item}>
            <Subtitle2 style={styles.orderNumber}>Sale Tax</Subtitle2>
            <Subtitle2 >{`$ ${salesTax.toFixed(2)}`}</Subtitle2>
          </View>
          <View style={styles.item}>
            <Subtitle2 style={styles.orderNumber}>Service Charge</Subtitle2>
            <Subtitle2 >{`$ ${serviceCharges}`}</Subtitle2>
          </View>
          <View style={styles.item}>
            <Subtitle2 style={styles.orderNumber}>Tip</Subtitle2>
            <Subtitle2 >{`$ ${tip}`}</Subtitle2>
          </View>
          
        </View>
      )}
      {orderStatus === 'PAID' && (
        <View>
          <View style={styles.item}>
            <Subtitle2 style={styles.orderNumber}>Sale Tax</Subtitle2>
            <Subtitle2 >{`$ ${salesTax.toFixed(2)}`}</Subtitle2>
          </View>
          <View style={styles.item}>
            <Subtitle2 style={styles.orderNumber}>Service Charge</Subtitle2>
            <Subtitle2 >{`$ ${serviceCharges}`}</Subtitle2>
          </View>
          <View style={styles.item}>
            <Subtitle2 style={styles.orderNumber}>Tip</Subtitle2>
            <Subtitle2 >{`$ ${tip}`}</Subtitle2>
          </View>
        </View>
      )}
      {/* {orderStatus === 'PENDING' && (
        <View>
          <View style={styles.divider}>
            <View style={[styles.circleMask, styles.leftCircle]} />
            <View style={styles.dividerLine} />
            <View style={[styles.circleMask, styles.rightCircle]} />
          </View>
        </View>
      )} */}

      {orderStatus === 'PENDING' && (
        <View>
          <View style={styles.footer}>
            <View>
              <Subtitle2 style={styles.status}>Status</Subtitle2>
              <Subtitle2 style={styles.pending}>{orderStatus}</Subtitle2>
            </View>
            <View style={{ marginLeft: 20 }}>
              <View style={{ flexDirection: 'row' }}>

                <Button
                  color={Color(Colors.secondaryColor).alpha(0.12)}
                  title="Ready"
                  titleColor={Colors.secondaryColor}
                  buttonStyle={styles.extraSmallButton}
                  onPress={readyOrder}
                />
                <Button
                  color={Color(Colors.secondaryColor).alpha(0.12)}
                  title="Cancel"
                  titleColor={Colors.secondaryColor}
                  buttonStyle={styles.extraSmallButton}
                  onPress={cancelOrder}
                />
              </View>

            </View>

          </View>
        </View>
      )}

      {orderStatus === 'CONFIRMED' && (
        <View style={styles.footer}>
          <View>
            <Subtitle2 style={styles.status}>Status</Subtitle2>
            <Subtitle2 style={styles.delivered}>{orderStatus}</Subtitle2>
          </View>
          {/* <Button
            color={Color(Colors.primaryColor).alpha(0.16)}
            title="Reorder"
            titleColor={Colors.primaryColor}
            buttonStyle={styles.extraSmallButton}
          /> */}
        </View>
      )}
      {orderStatus === 'CANCEL' && (
        <View style={styles.footer}>
          <View>
            <Subtitle2 style={styles.status}>Status</Subtitle2>
            <Subtitle2 style={styles.pending}>{orderStatus}</Subtitle2>
          </View>
          {/* <Button
            color={Color(Colors.primaryColor).alpha(0.16)}
            title="Reorder"
            titleColor={Colors.primaryColor}
            buttonStyle={styles.extraSmallButton}
          /> */}
        </View>
      )}
      {orderStatus === 'READY' && (
        <View style={styles.footer}>
          <View>
            <Subtitle2 style={styles.status}>Status</Subtitle2>
            <Subtitle2 style={styles.ready}>{orderStatus}</Subtitle2>
          </View>
        </View>
      )}
      {orderStatus === 'DELIVERED' && (
        <View style={styles.footer}>
          <View>
            <Subtitle2 style={styles.status}>Status</Subtitle2>
            <Subtitle2 style={styles.delivered}>{orderStatus}</Subtitle2>
          </View>
          {/* <Button
            color={Color(Colors.primaryColor).alpha(0.16)}
            title="Reorder"
            titleColor={Colors.primaryColor}
            buttonStyle={styles.extraSmallButton}
          /> */}
        </View>
      )}
      {orderStatus === 'PAID' && (
        <View style={styles.footer}>
          <View>
            <Subtitle2 style={styles.status}>Status</Subtitle2>
            <Subtitle2 style={styles.paid}>{orderStatus}</Subtitle2>
          </View>
        </View>
      )}
      {orderStatus === 'COMPLETED' && (
        <View style={styles.footer}>
          <View>
            <Subtitle2 style={styles.status}>Status</Subtitle2>
            <Subtitle2 style={styles.completed}>{orderStatus}</Subtitle2>
          </View>
        </View>
      )}
    </View>
  </View>
);

export default OrderItemB;
