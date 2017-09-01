This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).


## How to run 

- run `npm install`
- run `npm start`
- go to `localhost:3000`

## How to add this to your own create-react-app project?

- run `create-react-app projectfolder`

- `npm install babel-plugin-import --save-dev`

- `npm install antd-mobile --save`

- run `npm run eject` (NB: This will permanently eject your project- separting your webpack etc. into a config folder)

- go to `config/webpack.config.dev.js` and update it using the below steps:

- Change the babel section to this:
	```
      {
        test: /\.(js|jsx)$/,
        include: paths.appSrc,
        loader: require.resolve('babel-loader'),
        options: {
          cacheDirectory: true,
          plugins: [
            ["import", { "libraryName": "antd-mobile", "style": "css" }]
          ],
        },
      },
      ```
- Then at extensions, add `.web.js`, so it looks like this: `extensions: ['.web.js', '.js', '.json', '.jsx']`

- NB: I removed the `''` extension from the example as it would not allow empty values.

- in index html, added script for HD fix (in <head></head>):

```
/* é«˜æ¸…æ–¹æ¡ˆè®¾ç½®ä»£ç ï¼Œè¯¦æƒ…è§ https://github.com/ant-design/ant-design-mobile/wiki/antd-mobile-0.8-%E4%BB%A5%E4%B8%8A%E7%89%88%E6%9C%AC%E3%80%8C%E9%AB%98%E6%B8%85%E3%80%8D%E6%96%B9%E6%A1%88%E8%AE%BE%E7%BD%AE */
!function(e){function t(a){if(i[a])return i[a].exports;var n=i[a]={exports:{},id:a,loaded:!1};return e[a].call(n.exports,n,n.exports,t),n.loaded=!0,n.exports}var i={};return t.m=e,t.c=i,t.p="",t(0)}([function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=window;t["default"]=i.flex=function(e,t){var a=e||100,n=t||1,r=i.document,o=navigator.userAgent,d=o.match(/Android[\S\s]+AppleWebkit\/(\d{3})/i),l=o.match(/U3\/((\d+|\.){5,})/i),c=l&&parseInt(l[1].split(".").join(""),10)>=80,p=navigator.appVersion.match(/(iphone|ipad|ipod)/gi),s=i.devicePixelRatio||1;p||d&&d[1]>534||c||(s=1);var u=1/s,m=r.querySelector('meta[name="viewport"]');m||(m=r.createElement("meta"),m.setAttribute("name","viewport"),r.head.appendChild(m)),m.setAttribute("content","width=device-width,user-scalable=no,initial-scale="+u+",maximum-scale="+u+",minimum-scale="+u),r.documentElement.style.fontSize=a/2*s*n+"px"},e.exports=t["default"]}]);flex(100, 1);
```


And voilia! The great work of the antd-team. This project is even react-native friendly.