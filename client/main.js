require('babel-polyfill');
require('./style.css');
require('font-awesome-webpack');

const React = require('react');
const Controller = require('./components/Controller');
const ConnectionManager = require('./ConnectionManager');

// prevent iOS from scorlling the page
document.addEventListener('touchmove', function(e) { e.preventDefault(); }, false);
document.addEventListener('touchstart', function() {}, false);

window.onload = () => {
  const manager = new ConnectionManager();
  React.render(
    <Controller connectionManager={manager} />,
    document.getElementById('root'),
  );
};
