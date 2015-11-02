const React = require('react');
const YouTube = require('react-youtube');

class Controller extends React.Component {
  componentDidMount() {
    this.props.connectionManager.onPlay((data) => {
      let {startTime} = data;
      console.log('start playing at time %d', startTime);
    });

    // Call this when YouTube player is loaded / buffered
    console.log('client is ready');
    this.props.connectionManager.signalReady();
  }

  render() {
    const opts = {
      height: '390',
      width: '640',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 1
      }
    };

    return (
      <YouTube
        url={'http://www.youtube.com/watch?v=kG9KSWYg-Jc'}
        opts={opts}
        onReady={this._onReady}
      />
    );
  }

  _onReady(event) {
    // access to player in all event handlers via event.target
    //event.target.pauseVideo();
  }
}

Controller.propTypes = {
  connectionManager: React.PropTypes.object.isRequired,
};

module.exports = Controller;
