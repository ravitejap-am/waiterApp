import React from 'react';
import {
  ActivityIndicator,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Button,
} from 'react-native';

// import colors, layout
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';

// ActivityIndicatorModal Styles
const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.52)',
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    width: Layout.SCREEN_WIDTH - 3 * Layout.MEDIUM_MARGIN,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  title: {
    paddingVertical: 8,
    fontWeight: '700',
    fontSize: 15,
    color: '#000',
  },
  message: {
    marginBottom: 15,
    padding: 8,
    fontWeight: '400',
    fontSize: 15,
    color: '#212121',
    textAlign: 'center',
  },
});

// AddItemModal Props
type Props = {
  message: string,
  onRequestClose: () => {},
  statusBarColor: string,
  title: string,
  visible: boolean,
};

// AddItemModal

// const AddItemModal = (
//   {
//     message,
//     onRequestClose,
//     statusBarColor = 'rgba(0, 0, 0, 0.52)',
//     title,
//     visible,
//   }: Props,
//   {navigation},
// ) => (
//   <Modal
//     animationType="none"
//     transparent
//     visible={visible}
//     onRequestClose={onRequestClose}>
//     <StatusBar backgroundColor={statusBarColor} />
//     <View style={styles.modalWrapper}>
//       <View style={styles.modalContainer}>
//         <Text style={styles.title}>{title}</Text>
//         {message !== '' && message !== undefined && (
//           <Text style={styles.message}>{message}</Text>
//         )}
//         <Button
//           title="Current Menu"
//           //   onPress={() => this.props.navigation.navigate('AddExtraItem')}
//         />
//         <Button title="Add Extra Item" />
//       </View>
//     </View>
//   </Modal>
// );

// export default AddItemModal;
