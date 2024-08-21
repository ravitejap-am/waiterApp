import React from 'react';

import {connect} from 'react-redux';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';

// import components
import TabBadgeIcon from '../component/navigation/TabBadgeIcon';

// import Home screen
import Home from '../screens/home/Home';

// import Search screen
// import Search from '../screens/search/SearchB';
import QRCode from '../screens/scanner/QRScanner';

// import Favorites screen
import AssignTable from '../screens/assignTable/AssignTable';

import PendingOrders from '../screens/orders/pendingOrders';

// import Cart screen
import Cart from '../screens/cart/CartB';

// import Settings screen
import Settings from '../screens/settings/SettingsB';

// import colors
import Colors from '../theme/colors';

// HomeNavigator Config

type Props = {
  color: string,
  focused: string,
  size: number,
};

// create bottom tab navigator
const Tab = createBottomTabNavigator();

// HomeNavigator
function HomeNavigator({cartCount}) {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      backBehavior="initialRoute"
      screenOptions={({route}) => ({
        tabBarIcon: ({color, focused, size}: Props) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = `home${focused ? '' : '-outline'}`;
          } else if (route.name === 'Group') {
            iconName = `table-chair`;
          } else if (route.name === 'PendingOrders') {
            iconName = `script${focused ? '' : '-outline'}`;
          } else if (route.name === 'Settings') {
            iconName = `account${focused ? '' : '-outline'}`;
          }

          // You can return any component that you like here!
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: Colors.primaryColor,
        inactiveTintColor: Colors.secondaryText,
        showLabel: false, // hide labels
        style: {
          backgroundColor: Colors.surface, // TabBar background
        },
      }}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Group" component={AssignTable} />
      <Tab.Screen name="PendingOrders" component={PendingOrders}/>
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}
const mapStateToProps = (state) => ({
  cartCount: {
    count: state.cart.cartCount,
  },
});

export default connect(mapStateToProps)(HomeNavigator);
