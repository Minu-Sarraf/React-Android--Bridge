import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';

const InitPage = () => {
  return (
    <View style={styles.open}>
      <View style={styles.openChild}>
        <Text style={styles.title}>PAIR MY</Text>
        <Image
          style={styles.image}
          source={require('../img/logo.png')}
          resizeMode="cover"
        />
      </View>

      <View style={styles.openChild1}>
        <Text style={styles.body}>Squeeze your device</Text>
        <Text style={styles.body}>for 3 second</Text>
        <Text style={styles.body}>to connect</Text>
      </View>
    </View>
  );
};

export default InitPage;

const styles = StyleSheet.create({
  open: {
    height: '45%',
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 40,
  },
  openChild: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  openChild1: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    fontSize: 23,
    color: '#000',
    fontFamily: 'BarlowCondensed-Light',
  },
  title: {
    fontSize: 20,
    color: '#000',
    fontFamily: 'BarlowCondensed-Bold',
    textAlign: 'center',
  },
  image: {
    width: 100,
    height: 25,
  },
});
