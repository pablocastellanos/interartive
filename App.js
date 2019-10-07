import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Accelerometer from './Accelerometer'
import WebSocketDisplay from './WebSocketDisplay'

export default function App() {
  return (
    <View style={styles.container}>
      <WebSocketDisplay/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
