package com.contoso.demoapp;

import android.util.Log;

import com.contoso.reactnativedemolibrary.GripInterface;

public class Rtext implements GripInterface {


    @Override
    public void onRecieve(float val) {
      Log.e("grip val client", val + "");
    }
}
