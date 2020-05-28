import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';

const SelectToPair = ({data, peripheralId, retry, connect, select}) => {
  console.log('checking peripheral id inside select to pair', peripheralId);
  return (
    <View style={styles.open1}>
      <View style={styles.openCd}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={{flex: 1}} />
          <Text style={styles.title}>PAIR MY</Text>
          <TouchableOpacity style={styles.cancelWarp} onPress={() => retry()}>
            <Image
              style={{width: 18, height: 18}}
              source={require('../img/cancel.png')}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>

        <Image
          style={{width: 100, height: 25}}
          source={require('../img/logo.png')}
          resizeMode="cover"
        />
      </View>

      <View
        style={{height: data.length === 1 ? 100 : 160, paddingVertical: 20}}>
        <FlatList
          data={data}
          extraData={{peripheralId, data}}
          keyExtractor={(item, index) => item.id}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => select(item.id)}
              key={item.id}
              style={styles.itemWarp}>
              {data.length > 1 && (
                <View style={styles.item}>
                  <Text style={styles.peripheral}>
                    {item.id.substr(item.id.length - 8) || '未知设备'}
                  </Text>
                  <View style={styles.bodyWarp}>
                    <View style={styles.itemCheckWarp}>
                      {peripheralId === item.id && (
                        <Text style={styles.itemCheck}>√</Text>
                      )}
                    </View>
                  </View>
                </View>
              )}

              {data.length == 1 && (
                <View style={styles.item}>
                  <Text style={[styles.peripheral, {fontSize: 23}]}>
                    {item.id.substr(item.id.length - 8) || '未知设备'}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        />
      </View>
      <TouchableOpacity
        disabled={peripheralId ? false : true}
        onPress={() => connect()}
        style={styles.selectBtnWarp}>
        <View style={styles.selectBtn}>
          <Text style={{color: '#FFF', fontFamily: 'BarlowCondensed-Bold'}}>
            {peripheralId ? 'CONNECT' : 'SELECT TO PAIR'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SelectToPair;

const styles = StyleSheet.create({
  open1: {
    backgroundColor: '#FFF',
    width: '80%',
    borderRadius: 40,
    paddingVertical: 15,
  },
  openCd: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    color: '#000',
    fontFamily: 'BarlowCondensed-Bold',
    textAlign: 'center',
    flex: 5,
  },
  cancelWarp: {
    flex: 1,
    marginTop: 0,
  },
  itemWarp: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  peripheral: {
    flex: 1.5,
    textAlign: 'center',
    color: '#F39A78',
    fontFamily: 'BarlowCondensed-Light',
  },
  bodyWarp: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemCheckWarp: {
    height: 15,
    width: 15,
    borderWidth: 1,
    borderColor: '#F39A78',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemCheck: {
    fontFamily: 'BarlowCondensed-Light',
    color: '#F39A78',
  },
  selectBtnWarp: {
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
