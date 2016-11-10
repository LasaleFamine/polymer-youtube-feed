# `<youtube-feed>` Polymer (ES6)

[![Build status](https://travis-ci.org/LasaleFamine/polymer-youtube-feed.svg?branch=master)](https://travis-ci.org/LasaleFamine/polymer-youtube-feed)
[![GitHub version](https://badge.fury.io/gh/LasaleFamine%2Fpolymer-youtube-feed.svg)](https://badge.fury.io/gh/LasaleFamine%2Fpolymer-youtube-feed)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Dependency Status](https://gemnasium.com/badges/github.com/LasaleFamine/polymer-youtube-feed.svg)](https://gemnasium.com/github.com/LasaleFamine/polymer-youtube-feed)



> Wrapper of [google-youtube](https://elements.polymer-project.org/elements/google-youtube) and [Google YouTube APIs](https://developers.google.com/youtube/v3/) as a customizable [Polymer 1.0](https://www.polymer-project.org/1.0/) WebComponent in ES6 syntax.  
:construction: ***Currently needs to be developed with more features.*** :construction:

## Usage

``` html
<link rel="import" href="[your_bower_folder]/polymer-youtube-feed/youtube-feed.html">

<youtube-feed key="[YourKey]" q="[yourSearchParam]"></youtube-feed>

```

### :warning: Some dependencies you need to include in your project.
> **The component will install them.**

#### ***Polyfills***
- [**webcomponents**](https://github.com/webcomponents/webcomponentsjs)
- [**fetch**](https://github.com/github/fetch)

## Install

    $ bower install polymer-youtube-feed


## Default Properties
``` js

/**
 * API key of YouTube APIs
 */
key: {
  type: String
},
/**
 * Order of items
 * (date|rating|relevance|title|videoCount|viewCount)
 */
order: {
  type: String,
  value: 'date'
},
/**
 * Param of search
 */
q: {
  type: String,
  value: 'Never Gonna Give You Up'
},
/**
 * Number of results
 */
maxResults: {
  type: Number,
  value: 5
},
/**
 * Safe search for explicit content or standard content
 * (moderate|none|strict)
 */
safeSearch: {
  type: String,
  value: 'moderate'
},
/**
 * Video definition of the results
 * (any|high|standard)
 */
videoDefinition: {
  type: String,
  value: 'any'
},
/**
 * Thumbnails definition of the results (also depending on size)
 * (high|medium|default)
 */
thumbDefinition: {
  type: String,
  value: 'high'
}

```

## API

#### .loadContent()
Load (or reload) content with the current properties if needed.

---

#### .showVideoPlay(videoId)
##### videoId
Type: `string`  
The video id related to the video you want to show.

---

### Events
#### youtube-feed-ready
After the correct loading of the videos feed.

### Usage note
Changing the following properties **will run a reload of the content**:
- `q`
- `order`

Other properties must be force-reloaded with the `loadContent()` method:
(e.g.)

``` js
var youtubeFeed = document.querySelector('youtube-feed');
youtubeFeed.set('videoDefinition', 'standard');
youtubeFeed.loadContent();
```

Of course you can set all properties directly on the element:
``` html
<youtube-feed
  key="[YourKey]"
  q="[yourSearchParam]"
  video-definition="high"
  order="title" thumb-definition="medium"></youtube-feed>
```
And so on.

## Develop

Clone the repository ***inside a folder*** (ex: `sandbox-youtube-feed/youtube-feed`) and inside the `youtube-feed` folder:

    $ yarn install && bower install

Developing mode: **watch** on base files and **Babel** that transpiles (http://localhost:8080/youtube-feed/demo)

    $ yarn start

Build: only the **Babel** action simply run

    $ yarn run build


## Test

[Standard](http://standardjs.com/) for coding style and [WCT](https://github.com/polymer/web-component-tester) for unit test:

    $ yarn test

## License

[MIT](https://github.com/LasaleFamine/youtube-feed/blob/master/LICENSE.md) &copy; LasaleFamine
