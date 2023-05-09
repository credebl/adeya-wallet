package com.credebl;
import android.os.Bundle;
import android.system.ErrnoException;
import android.system.Os;
import java.io.File;

import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "CredeBl";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this, R.style.SplashTheme,true);
    super.onCreate(savedInstanceState);

    try {
      Os.setenv("EXTERNAL_STORAGE", getExternalFilesDir(null).getAbsolutePath(), true);
      System.loadLibrary("indy");
    } catch (ErrnoException e) {
      e.printStackTrace();
    }
  }
}
