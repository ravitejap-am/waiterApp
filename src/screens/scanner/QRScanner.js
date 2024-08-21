import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  SafeAreaView,
} from 'react-native';
import SelectMultiple from 'react-native-select-multiple';

import * as productApi from '../../api/ProductService';
import {connect} from 'react-redux';
const styles = StyleSheet.create({
  centerText: {
    marginLeft: 150,
    marginBottom: 40,
    fontSize: 21,
    justifyContent: 'center',
    fontWeight: '500',
    color: '#fff',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
  },
  buttonTouchable: {},
});

const fruits = [
  'Apples',
  'Oranges',
  'Pears',
  'Apricots',
  'Avocado',
  'Blackcurrant',
  'Breadfruit',
  'Blueberries',
  'Clementine',
  'Cherry',
  'Date',
  'Blueberry',
  'Elderberries',
  'Grapefruit',
  'Watermelons',
  'Bananas',
  'Mangoes',
  'Raspberries',
  'Strawberries',
];

const renderLabel = (label, style) => {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <Image
        style={{width: 42, height: 42}}
        source={{uri: 'https://dummyimage.com/100x100/52c25a/fff&text=V'}}
      />
      <View style={{marginLeft: 10}}>
        <Text style={style}>{label}</Text>
      </View>
    </View>
  );
};

class QRScanner extends Component {
  constructor(props) {
    super(props);
    // this.props.navigation.setOptions({title: this.props.route.params.name});
    this.state = {selectedFruits: []};
  }
  onSelectionsChange = (selectedFruits) => {
    // selectedFruits is array of { label, value }
    this.setState({selectedFruits});
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View>
          <Text style={{fontSize: 30, padding: 10, marginBottom: 20}}>
            FRUIT LISTS
          </Text>
        </View>
        <SelectMultiple
          items={fruits}
          renderLabel={renderLabel}
          selectedItems={this.state.selectedFruits}
          onSelectionsChange={this.onSelectionsChange}
        />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.loggedIn,
    profile: state.profile,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps)(QRScanner);
