package com.aifitness.app;

import android.app.Application;
import dagger.hilt.android.HiltAndroidApp;

@HiltAndroidApp
public class AiFitnessApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
    }
}
