const React = require('react');
const YouTube = require('react-youtube');

class Controller extends React.Component {
  constructor() {
    super();

    // YouTube Player event-handlers
    this._onReady = this._onReady.bind(this);
    this._onStateChange = this._onStateChange.bind(this);

    // CollectionManager event-handlers
    this._play = this._play.bind(this);

    // Private member variables
    this.player = null;
    this.isBuffered = false;
  }

  /**
   * React.Component Interface
   */
  componentDidMount() {
    this.props.connectionManager.onPlay(this._play);
  }

  render() {
    const opts = {
      height: '390',
      width: '640',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 0,
      },
    };

    return (
      <YouTube
        onPlay={this._onStateChange}
        onReady={this._onReady}
        onStateChange={this._onStateChange}
        opts={opts}
        url={'https://www.youtube.com/watch?v=LiAWP_mcIzY'}
      />
    );
  }


  /**
   * CollectionManager event-handlers
   */
  _play(data) {
    let {startTime} = data;
    console.log('start playing at time %d', startTime);
    let curTime = Date.now();
    if (startTime >= curTime) {
      // Wait until startTime and then start playing video
      setTimeout(() => {
        this.player.playVideo();
      }, startTime - curTime);
    } else {
      // TODO: Need to extrapolate if timestamp is in the past
      throw Error('Something went terribly wrong');
    }
  }

  /**
   * YouTube Player event-handlers
   */
  _onReady(event) {
    // Once YouTube Player is loaded, start buffering
    this.player = event.target;
    this.player.seekTo(0, true);  // this will start buffering
  }

  _onStateChange(event) {
    if (event.data === window.YT.PlayerState.PLAYING && !this.isBuffered) {
      // This is the first play (started just to buffer the video)
      this._bufferingPlayStarted();
    }
  }

  /*
   * Other internal helpers
   */
  _bufferingPlayStarted() {
    let BUFFER_TIME = 2000;  // wait a bit before pinging that we are ready
    this.player.pauseVideo();

    setTimeout(() => {
      // YouTube player is loaded / buffered
      console.log('client is ready');
      this.isBuffered = true;
      this.props.connectionManager.signalReady();
    }, BUFFER_TIME);
  }
}

Controller.propTypes = {
  connectionManager: React.PropTypes.object.isRequired,
};

module.exports = Controller;
