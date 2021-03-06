package com.contoso.reactnativedemolibrary.internal;

import androidx.annotation.NonNull;

import com.contoso.reactnativedemolibrary.GripInterface;
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Exposes {@link DemoLibraryNativeModule} to JavaScript.
 */
public class DemoReactPackage implements ReactPackage {
    GripInterface grip;
    public DemoReactPackage (GripInterface gripInterface){
        grip = gripInterface;
    }

    @NonNull
    @Override
    public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
       // modules.add(new DemoLibraryNativeModule());
        modules.add(new BluetoothLibraryModule(reactContext,grip));

        return modules;
    }

    @NonNull
    @Override
    public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}
