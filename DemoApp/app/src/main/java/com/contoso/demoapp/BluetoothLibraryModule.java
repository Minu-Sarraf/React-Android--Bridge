package com.contoso.demoapp;

import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import javax.annotation.Nonnull;


    public class BluetoothLibraryModule extends ReactContextBaseJavaModule {
        private ReactApplicationContext cntx;
        public BluetoothLibraryModule(@Nonnull ReactApplicationContext reactContext) {
            super(reactContext);
            cntx = reactContext;
        }

        @Nonnull
        @Override
        public String getName() {
            return "Bluetooth";
        }

        @ReactMethod
        public void show(String message) {
            Log.e("data", message);
            Toast.makeText(getReactApplicationContext(), message, Toast.LENGTH_LONG).show();
        }
        @ReactMethod
        void getName12(@Nonnull Promise promise) {
            promise.resolve("React Native Demo Library aaa");
        }
    }


