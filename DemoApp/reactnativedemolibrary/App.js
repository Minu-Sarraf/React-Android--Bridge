/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  Platform,
  Alert,
  PermissionsAndroid,
  Image,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import InitPage from './src/pages/InitPage';
import SelectToPair from './src/pages/SelectToPair';
import Tryagain from './src/pages/Tryagain';
import useListenerState from './src/utils/useListenerState';
import BleModule from './src/utils/BleModule';
import TestConnectNative from './src/utils/TestConnectNative';

const BluetoothManager = new BleModule();

const BluetoothComponent = () => {
  const [init, setinit] = useState(false);
  const [scanning, setscanning] = useState(false);
  const [show, setShow] = useState(1);
  const [connected, setConnected] = useState(false);
  const [isMonitoring, setisMonitoring] = useState(false);

  const [dataRef, setData] = useListenerState([]);
  const [peripheralIdRef, setperipheralId] = useListenerState('');
  let deviceMap = new Map();

  const initListeners = () => {
    console.log('ya xirya xa ki nai?');
    BluetoothManager.addListener('BleManagerDidUpdateState', handleUpdateState);
    BluetoothManager.addListener(
      'BleManagerConnectPeripheral',
      handleConnectPeripheral,
    );
    BluetoothManager.addListener(
      'BleManagerDisconnectPeripheral',
      handleDisconnectPeripheral,
    );
    BluetoothManager.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      handleUpdateValue,
    );
    BluetoothManager.addListener('BleManagerStopScan', handleStopScan);
    BluetoothManager.addListener(
      'BleManagerDiscoverPeripheral',
      handleDiscoverPeripheral,
    );
  };

  const removeListeners = () => {
    BluetoothManager.removeAllListeners('BleManagerDidUpdateState');
    BluetoothManager.removeAllListeners('BleManagerConnectPeripheral');
    BluetoothManager.removeAllListeners('BleManagerDisconnectPeripheral');
    BluetoothManager.removeAllListeners(
      'BleManagerDidUpdateValueForCharacteristic',
    );
    BluetoothManager.removeAllListeners('BleManagerStopScan');
    BluetoothManager.removeAllListeners('BleManagerDiscoverPeripheral');
    disconnect();
  };

  const handleUpdateState = args => {
    console.log('BleManagerDidUpdateStatea:', args);
    if (args.state === 'on') {
      connect();
    } else if (args.state === 'off') {
      enableBluetooth();
    }
    if (args.state !== 'on') {
      setConnected(false);
    }
  };
  const handleConnectPeripheral = args => {
    console.log('connect peripheral', args);
    setConnected(true);
    setTimeout(() => {
      startnotify();
    }, 5000);
  };
  const handleDisconnectPeripheral = args => {
    console.log('disconnect peripheral', args);
    setConnected(false);
    BluetoothManager.initUUID();
    stopnotify();
  };
  const handleUpdateValue = args => {
    console.log('just checking update value', args);

    let value = args.value;
    let all = '',
      grip = '';
    let electricity = 0,
      isGrip = 0;
    for (var i = 0; i < value.length; i++) {
      var str = String.fromCharCode(value[i]);
      if (i == 1) {
        electricity = (Number(str) + 1) * 10;
      } else if (i == 2) {
        isGrip = str;
      } else if (i > 2) {
        grip += str;
      }
      all += str;
    }
    // if( isGrip == 1 && grip > 0 )
    const newgrips = parseFloat(grip * 2.2).toFixed(1);
    TestConnectNative.sendMessage(newgrips);
    // console.log('checking pressure kG: ', grip, '    lb:   ', newgrips);
  };
  const handleStopScan = args => {
    const data = dataRef.current;
    setscanning(false);
    let newPeripheralId = '';
    if (data.length > 0) {
      setShow(2);
      if (data.length == 1) {
        newPeripheralId = data[0].id;
      }
      setperipheralId(newPeripheralId);
      return;
    }
    setShow(4);
  };
  const handleDiscoverPeripheral = args => {
    console.log('just checking discover peripheral', args);

    if (!args.id || !args.name || args.name !== 'weixin-nini') {
      return;
    }
    let id;
    let macAddress;
    if (Platform.OS === 'android') {
      macAddress = args.id;
      id = macAddress;
    } else {
      macAddress = BluetoothManager.getMacAddressFromIOS(args);
      id = args.id;
    }

    args.macAddress = macAddress;
    deviceMap.set(id, args);

    setData([...deviceMap.values()]);
  };

  const initBlutooth = async () => {
    await BluetoothManager.start()
      .then(() => {
        setinit(true);
      })
      .catch(err => {
        setinit(false);
      });

    if (Platform.OS === 'android' && Platform.Version >= 23) {
      const value = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      );
      console.log('checking the location permission', value);
      if (!value) {
        try {
          const granted = PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
            {
              title: 'Location Permission for Bluetooth',
              message:
                'Android 6.0 and later requires Location Services to be enabled for new Bluetooth connections. ' +
                'This option can be disabled once you have paired your Squegg.' +
                'For more details: https://mysquegg.com/pages/faq',
              // buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the camera');
          } else {
            console.log('Camera permission denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    }

    initListeners();

    BluetoothManager.checkState();
    scanSequence();
  };

  useEffect(() => {
    if (!init) {
      initBlutooth();
    }
    return () => {
      removeListeners();
    };
  }, [init]);

  const startScan = () => {
    if (!scanning) {
      setShow(1);
      console.log('feri scan garna thalyo?');
      BluetoothManager.scan([], 5, true)
        .then(() => {
          setscanning(true);
        })
        .catch(err => {
          setShow(4);
          setscanning(false);
          console.log('checking scanning error', err);
          BluetoothManager.checkState();
        });
    }
  };

  const stopScan = () => {
    BluetoothManager.stopScan()
      .then(() => {
        setscanning(false);
        console.log('Scan stopped');
      })
      .catch(err => {
        console.log('Scan stopped fail', err);
      });
  };

  const scanSequence = () => {
    startScan();
    // setTimeout(() => {
    //   stopScan();
    // }, 5000);
  };

  const enableBluetooth = () => {
    setShow(3);

    if (Platform.OS === 'ios') {
      Alert.alert('Prompt', 'Please turn on bluetooth', [
        {
          text: 'OK',
          onPress: () => {
            BluetoothManager.enableBluetooth();
          },
        },
      ]);
    } else {
      Alert.alert('Prompt', 'Please turn on bluetooth', [
        {
          text: 'NO',
        },
        {
          text: 'OK',
          onPress: () => {
            BluetoothManager.enableBluetooth();
          },
        },
      ]);
    }
  };

  const retry = () => {
    startScan();
    deviceMap = new Map();
    setData([]);
    // BluetoothManager.disconnect();
  };

  const select = id => {
    setperipheralId(id);
    connect(id);
  };

  const connect = id => {
    if (scanning) {
      //当前正在扫描中，连接时关闭扫描

      BluetoothManager.stopScan();
      setscanning(false);
    }

    setShow(5);

    const currentId = id || peripheralIdRef.current;

    if (currentId) {
      BluetoothManager.connect(currentId)
        .then(peripheralInfo => {
          console.log('Checking peripheral info', peripheralInfo);
        })
        .catch(err => {
          if (err.indexOf('Wrong UUID') == -1) {
            Alert.alert('Prompt', 'The connection fails:' + err, [
              {
                text: 'One more time',
                onPress: () => {
                  retry();
                },
              },
            ]);
          }
        });
    } else {
      setShow(4);
    }
  };

  const disconnect = () => {
    BluetoothManager.disconnect(peripheralIdRef.current);
  };

  const startnotify = () => {
    BluetoothManager.startNotification(peripheralIdRef.current)
      .then(() => {
        setisMonitoring(true);
        setShow(6);
      })
      .catch(err => {
        setisMonitoring(false);
      });
  };

  const stopnotify = () => {
    BluetoothManager.stopNotification()
      .then(() => {
        setisMonitoring(false);
      })
      .catch(err => {
        setisMonitoring(true);
      });
  };
  //   console.log('checking the show', show);
  //   console.log('checking the peripheraliD', peripheralId);
  //   console.log('checking the data', data);
  return (
    <>
      <StatusBar
        backgroundColor="#F39A78"
        barStyle="light-content"
        hidden={true}
      />
      <SafeAreaView style={{flex: 1, backgroundColor: '#F39A78'}}>
        <View style={styles.content}>
          {/* {!init ? <ActivityIndicator /> : <InitPage />} */}

          {show === 1 && <InitPage />}
          {show === 4 && <Tryagain retry={retry} />}
          {show === 2 && (
            <SelectToPair
              data={dataRef.current}
              peripheralId={peripheralIdRef.current}
              retry={retry}
              select={select}
              connect={connect}
            />
          )}
          {show == 3 && (
            <View style={styles.open}>
              <View style={styles.openChild}>
                <Text style={styles.title}>PAIR MY</Text>
                <Image
                  style={{width: 100, height: 25}}
                  source={require('./src/img/logo.png')}
                  resizeMode="cover"
                />
              </View>

              <View style={styles.openChild1}>
                <Text style={styles.body}>Enable Bluetooth</Text>
                <Text style={styles.body}>to begin pairing</Text>
                <Text style={styles.body}>your device</Text>
              </View>
            </View>
          )}
          {show === 5 && (
            <View style={styles.open}>
              <View style={styles.bodyWarp}>
                <Text style={styles.body}>Pairing...</Text>
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  content: {
    height: Dimensions.get('window').height + 65,
    backgroundColor: '#F39A78',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 65,
  },
  body: {
    fontSize: 23,
    color: '#000',
    fontFamily: 'BarlowCondensed-Light',
  },
  open: {
    height: '45%',
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 40,
  },
  bodyWarp: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BluetoothComponent;
