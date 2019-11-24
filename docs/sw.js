/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "index.html",
    "revision": "4297ece281542b20993d45b38222b3f2"
  },
  {
    "url": "build/app-93d25773.js"
  },
  {
    "url": "build/core-c2ec3f06.js",
    "revision": "bf1a2759b54b62a785e43421157e2f5e"
  },
  {
    "url": "build/css-shim-978387b1-1e75855f.js",
    "revision": "b23c18189b172b7e2b83302e4e5344e2"
  },
  {
    "url": "build/dom-96781eef-a2fb04dd.js",
    "revision": "a93639f5a73a9b22a971bfd84437fba7"
  },
  {
    "url": "build/index.esm.js",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "build/my-component.entry.js",
    "revision": "34dc0d85f69af096d8dc9caa810eff03"
  },
  {
    "url": "build/p-affe7c09.js"
  },
  {
    "url": "build/p-d0882b30.js"
  },
  {
    "url": "build/p-d8631f0b.js"
  },
  {
    "url": "build/p-d87f4611.js"
  },
  {
    "url": "build/p-hpubzjyl.entry.js"
  },
  {
    "url": "build/polaris-wf.entry.js",
    "revision": "e2fa11ca6c2d42bc1ad70ff7919a4f68"
  },
  {
    "url": "build/shadow-css-4889ae62-23996f3f.js",
    "revision": "121a72dffe019db9d046569d159930f3"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
