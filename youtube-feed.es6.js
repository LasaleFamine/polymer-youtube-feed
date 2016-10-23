'use strict'

const Polymer = window.Polymer
const CustomEvent = window.CustomEvent
const requestAnimationFrame = window.requestAnimationFrame
const fetch = window.fetch

class youtubeFeed {
  get behaviors () {
    return []
  }

  beforeRegister () {
    this.is = 'youtube-feed'

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
    }

    this.observers = [
      '_propChanged(order, q)'
    ]
  }

  attached () {
    this.loadContent()
  }

  loadContent () {
    this._loadContent()
      .then(res => {
        this.set('_videos', this._makeItems(res))
      })
      .catch(err => {
        throw new Error(err)
      })
  }

  showVideoPlay (videoId) {
    this.set('_clicked', videoId)
    this.set('_showPlayer', true)
      // let spinner = this.querySelector(`#video${videoId} .spinner`)
    let message = this.querySelector(`#video-${videoId} .message`)
    this._fade('in', message)
  }

  /** ===============
   * Private methods
   **/

  _propChanged (order, q) {
     // Check for _endpoint defined
     // Basically this avoid to run this when the componet is attached
    if (this._endpoint) {
      this.loadContent()
    }
  }

  _fade (type, el) {
    el.style.opacity = type === 'in' ? 0 : 1
    el.style.display = type === 'in' ? 'block' : 'none'
    const tick = () => {
      switch (type) {
        case 'in':
          el.style.opacity = +el.style.opacity + 0.01
          if (+el.style.opacity < 1) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
          }
          break
        default:
          el.style.opacity = +el.style.opacity - 0.01
          if (+el.style.opacity === 0) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
          }
          break
      }
    }
    tick()
  }

  _loadContent () {
    let resource = this._endpoint
    let query = `&order=${this.order}&q=${this.q}&safeSearch=${this.safeSearch}&type=${this._type}&videoDefinition=${this.videoDefinition}&key=${this.key}`

    resource += query
    return fetch(resource)
      .then(res => {
        return res.json()
      })
      .catch(err => {
        throw new Error(err)
      })
  }

  _makeItems (res) {
    return res.items.reduce((acc, item) => {
      let singleItem = {
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        channelTitle: item.snippet.channelTitle,
        pubDate: item.snippet.publishedAt,
        thumb: item.snippet.thumbnails[`${this.thumbDefinition}`]
      }
      return acc.concat(singleItem)
    }, [])
  }

  _setBackgroundImages() {
    this.querySelectorAll('.card').forEach((item, i) => {
      item.style.backgroundImage = `url(${this._videos[i].thumb.url})`
    })
  }

  _computeVideoLink (videoId) {
    return `https://www.youtube.com/watch?v=${videoId}`
  }

  _computeShowPlayer (clicked, videoId) {
    return clicked === videoId
  }

  _computeActiveClass (clicked, videoId) {
    return clicked === videoId ? 'active' : ''
  }

  _videosChanged (videos) {
    if (videos.length > 0) {
      setTimeout(() => {
        this._setBackgroundImages()
        this.dispatchEvent(new CustomEvent('youtube-feed-ready'))
      })
    }
  }

  _onClickPlay (evt) {
    console.info('Video id clicked:', evt.target.dataset.videoid)
    this.showVideoPlay(evt.target.dataset.videoid)
  }

}

// Register the element using Polymer's constructor.
Polymer(youtubeFeed)
