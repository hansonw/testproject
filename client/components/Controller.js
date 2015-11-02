const React = require('react');
const YouTube = require('react-youtube');

class Controller extends React.Component {
  constructor() {
    super();
    this._onReady = this._onReady.bind(this);
    this.player = null;
  }

  componentDidMount() {
    this.props.connectionManager.onPlay((data) => {
      let {startTime} = data;
      console.log('start playing at time %d', startTime);
      let curTime = Date.now();
      if (startTime >= curTime) {
        // Wait until startTime and then start playing video
        setTimeout(() => {
          // ASSUMES this.player is set
          alert("yo!");
          //this.player.playVideo();
        }, startTime-curTime);
      } else {
        // TODO: Need to extrapolate if timestamp is in the past
        throw Error("Something went terribly wrong");
      }
    });
  }

  render() {
    const opts = {
      height: '390',
      width: '640',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 0
      }
    };

    return (
      <YouTube
        url={'https://www.youtube.com/watch?v=LiAWP_mcIzY'}
        opts={opts}
        onReady={this._onReady}
      />
    );
  }

  _onReady(event) {
    // Call this when YouTube player is loaded / buffered
    console.log('client is ready');
    this.player = event.target;
    this.props.connectionManager.signalReady();
  }
}

Controller.propTypes = {
  connectionManager: React.PropTypes.object.isRequired,
};

module.exports = Controller;
