package com.contoso.reactnativedemolibrary.internal;

import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.BaseJavaModule;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import javax.annotation.Nonnull;

/**
 * Expose a simple {@code DemoLibrary.getName(} method to JavaScript.
 */
class DemoLibraryNativeModule extends BaseJavaModule {

    /**
     * @return the name of this module as seen by JavaScript.
     */
    @Override
    public String getName() {
        return "DemoLibrary";
    }


    @ReactMethod
    void getName12(@Nonnull Promise promise) {
        promise.resolve("React Native Demo Library aaa");
    }

//    @ReactMethod
//    public void show(String message) {
//        Log.e("data" , message);
//    }
}
