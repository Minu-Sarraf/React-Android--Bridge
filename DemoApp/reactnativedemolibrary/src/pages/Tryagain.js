import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';

const Tryagain = ({retry}) => {
  return (
    <View style={styles.open}>
      <View style={styles.openChild}>
        <Text style={styles.title}>PAIR MY</Text>
        <Image
          style={{width: 100, height: 25}}
          source={require('../img/logo.png')}
          resizeMode="cover"
        />
      </View>

      <View style={styles.openChild1}>
        <Text style={styles.body}>NO device detected!</Text>
      </View>

      <TouchableOpacity style={styles.openChild3} onPress={() => retry()}>
        <View style={styles.selectBtn}>
          <Text style={{color: '#FFF', fontFamily: 'BarlowCondensed-Bold'}}>
            TRY AGAIN
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Tryagain;

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
  title: {
    fontSize: 20,
    color: '#000',
    fontFamily: 'BarlowCondensed-Bold',
    textAlign: 'center',
  },
  openChild1: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  openChild3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectBtn: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
});
