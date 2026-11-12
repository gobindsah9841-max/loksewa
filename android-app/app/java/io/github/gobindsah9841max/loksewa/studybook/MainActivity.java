package io.github.gobindsah9841max.loksewa.studybook;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.ViewGroup;
import android.view.ViewParent;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/**
 * The whole app is one WebView that shows the pages packed in assets/www.
 * Nothing is loaded from a network; the app has no INTERNET permission.
 * Links that leave the book (the source references) are handed to the phone's browser.
 */
public class MainActivity extends Activity {

    private static final String ASSETS = "file:///android_asset/";
    private static final String HOME = ASSETS + "www/index.html";

    private WebView web;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        web = new WebView(this);
        WebSettings settings = web.getSettings();
        settings.setJavaScriptEnabled(true);          // the reader is a small script
        settings.setDomStorageEnabled(true);          // remembers reading position and scores
        settings.setDefaultTextEncodingName("utf-8");
        settings.setAllowFileAccess(false);           // packed assets stay readable; other files do not
        settings.setAllowContentAccess(false);
        settings.setAllowFileAccessFromFileURLs(false);
        settings.setAllowUniversalAccessFromFileURLs(false);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);

        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url == null || url.startsWith(ASSETS)) {
                    return false;                     // a page of the book: open it here
                }
                try {
                    startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));
                } catch (Exception noAppForThisLink) {
                    // no browser installed: ignore the tap
                }
                return true;
            }
        });
        web.setWebChromeClient(new WebChromeClient());
        setContentView(web);

        if (savedInstanceState == null || web.restoreState(savedInstanceState) == null) {
            web.loadUrl(HOME);
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        web.saveState(outState);
    }

    @Override
    public void onBackPressed() {
        if (web.canGoBack()) {
            web.goBack();                             // previous screen of the book
        } else {
            super.onBackPressed();                    // leave the app
        }
    }

    @Override
    protected void onPause() {
        web.onPause();
        super.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        web.onResume();
    }

    @Override
    protected void onDestroy() {
        if (web != null) {
            web.stopLoading();
            ViewParent parent = web.getParent();
            if (parent instanceof ViewGroup) {
                ((ViewGroup) parent).removeView(web);
            }
            web.destroy();
            web = null;
        }
        super.onDestroy();
    }
}
