const React = require('react');

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
    return (
      <div>
        hello world
      </div>
    );
  }
}

Controller.propTypes = {
  connectionManager: React.PropTypes.object.isRequired,
};

module.exports = Controller;
