require('./style.css');
require('font-awesome-webpack');

const React = require('react');
const Controller = require('./components/Controller');

// prevent iOS from scorlling the page
document.addEventListener('touchmove', function(e) { e.preventDefault(); }, false);
document.addEventListener('touchstart', function() {}, false);

window.onload = () => {
  React.render(
    <Controller />,
    document.getElementById('root'),
  );
};
