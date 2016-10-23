'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Polymer = window.Polymer;
var CustomEvent = window.CustomEvent;
var requestAnimationFrame = window.requestAnimationFrame;
var fetch = window.fetch;

var youtubeFeed = function () {
  function youtubeFeed() {
    _classCallCheck(this, youtubeFeed);
  }

  _createClass(youtubeFeed, [{
    key: 'beforeRegister',
    value: function beforeRegister() {
      this.is = 'youtube-feed';

      this.properties = {
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
         * Paramenter of search
         */
        q: {
          type: String,
          value: 'Never Gonna Give You Up'
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
        },

        /**
         * **PRIVATE**
         * Type of content to return (comma separated list)
         */
        _videos: {
          type: Array,
          value: [],
          observer: '_videosChanged'
        },
        _clicked: {
          type: String,
          value: ''
        },
        _showPlayer: {
          type: Boolean,
          value: false
        },
        _type: {
          type: String,
          value: 'video'
        },
        _endpoint: {
          type: String,
          value: 'https://www.googleapis.com/youtube/v3/search?part=snippet'
        }
      };

      this.observers = ['_propChanged(order, q)'];
    }
  }, {
    key: 'attached',
    value: function attached() {
      this.loadContent();
    }
  }, {
    key: 'loadContent',
    value: function loadContent() {
      var _this = this;

      this._loadContent().then(function (res) {
        _this.set('_videos', _this._makeItems(res));
      }).catch(function (err) {
        throw new Error(err);
      });
    }
  }, {
    key: 'showVideoPlay',
    value: function showVideoPlay(videoId) {
      this.set('_clicked', videoId);
      this.set('_showPlayer', true);
      // let spinner = this.querySelector(`#video${videoId} .spinner`)
      var message = this.querySelector('#video-' + videoId + ' .message');
      this._fade('in', message);
    }

    /** ===============
     * Private methods
     **/

  }, {
    key: '_propChanged',
    value: function _propChanged(order, q) {
      // Check for _endpoint defined
      // Basically this avoid to run this when the componet is attached
      if (this._endpoint) {
        this.loadContent();
      }
    }
  }, {
    key: '_fade',
    value: function _fade(type, el) {
      el.style.opacity = type === 'in' ? 0 : 1;
      el.style.display = type === 'in' ? 'block' : 'none';
      var tick = function tick() {
        switch (type) {
          case 'in':
            el.style.opacity = +el.style.opacity + 0.01;
            if (+el.style.opacity < 1) {
              window.requestAnimationFrame && requestAnimationFrame(tick) || setTimeout(tick, 16);
            }
            break;
          default:
            el.style.opacity = +el.style.opacity - 0.01;
            if (+el.style.opacity === 0) {
              window.requestAnimationFrame && requestAnimationFrame(tick) || setTimeout(tick, 16);
            }
            break;
        }
      };
      tick();
    }
  }, {
    key: '_loadContent',
    value: function _loadContent() {
      var resource = this._endpoint;
      var query = '&order=' + this.order + '&q=' + this.q + '&safeSearch=' + this.safeSearch + '&type=' + this._type + '&videoDefinition=' + this.videoDefinition + '&key=' + this.key;

      resource += query;
      return fetch(resource).then(function (res) {
        return res.json();
      }).catch(function (err) {
        throw new Error(err);
      });
    }
  }, {
    key: '_makeItems',
    value: function _makeItems(res) {
      var _this2 = this;

      return res.items.reduce(function (acc, item) {
        var singleItem = {
          id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          channelTitle: item.snippet.channelTitle,
          pubDate: item.snippet.publishedAt,
          thumb: item.snippet.thumbnails['' + _this2.thumbDefinition]
        };
        return acc.concat(singleItem);
      }, []);
    }
  }, {
    key: '_setBackgroundImages',
    value: function _setBackgroundImages() {
      var _this3 = this;

      this.querySelectorAll('.card').forEach(function (item, i) {
        item.style.backgroundImage = 'url(' + _this3._videos[i].thumb.url + ')';
      });
    }
  }, {
    key: '_computeVideoLink',
    value: function _computeVideoLink(videoId) {
      return 'https://www.youtube.com/watch?v=' + videoId;
    }
  }, {
    key: '_computeShowPlayer',
    value: function _computeShowPlayer(clicked, videoId) {
      return clicked === videoId;
    }
  }, {
    key: '_computeActiveClass',
    value: function _computeActiveClass(clicked, videoId) {
      return clicked === videoId ? 'active' : '';
    }
  }, {
    key: '_videosChanged',
    value: function _videosChanged(videos) {
      var _this4 = this;

      if (videos.length > 0) {
        setTimeout(function () {
          _this4._setBackgroundImages();
          _this4.dispatchEvent(new CustomEvent('youtube-feed-ready'));
        });
      }
    }
  }, {
    key: '_onClickPlay',
    value: function _onClickPlay(evt) {
      console.info('Video id clicked:', evt.target.dataset.videoid);
      this.showVideoPlay(evt.target.dataset.videoid);
    }
  }, {
    key: 'behaviors',
    get: function get() {
      return [];
    }
  }]);

  return youtubeFeed;
}();

// Register the element using Polymer's constructor.


Polymer(youtubeFeed);