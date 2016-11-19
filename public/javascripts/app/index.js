import GameLayout from './views/game-layout';
import InfoBar from './views/info-bar';
import picture from './views/picture';
import players from './views/players-list';
import centerBar from './views/center-bar';

import clicks from './views/clicks';
import timeLeft from './views/time-left';
import score from './views/score';
import player from './views/player';

// import actions:
import click from './actions/click';

window.requestAnimFrame =
  window.requestAnimationFrame       ||
  window.webkitRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame    ||
  window.oRequestAnimationFrame      ||
  window.msRequestAnimationFrame     ||
  (callback => window.setTimeout(callback, 1000/60));

const
  assign = Object.assign,
  drawings = [],
  actions = [];

function load( path ) {
  const image = new Image();

  const promise = new Promise(( res, rej ) => {
    image.onload = () => { res( image ); };
  });

  image.src = path;

  return promise;
}

export default {
  init(canvas, socket, options) {
    const
      ctx = canvas.getContext('2d'),
      id = socket.id,
      p = options.players.find(p => p.id.substr(2) === id);

    options.name = p.name;

    load(options.path).then(function ( image ) {
      const
        layout = GameLayout(canvas, drawings, options),
        infoBar = InfoBar(canvas, drawings, options);

      layout.getRegion('infoBar').show( InfoBar );
      layout.getRegion('players').show( players );
      layout.getRegion('picture').show(picture.bind(null, image));
      layout.getRegion('centerBar').show( centerBar );

      infoBar.getRegion('clicks').show( clicks );
      infoBar.getRegion('timeLeft').show( timeLeft );
      infoBar.getRegion('score').show( score );
      infoBar.getRegion('player').show( player );

      const clickAction = click(canvas, socket, actions);

      const gameLoop = function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawings.forEach(drawing => {
          drawing( ctx );
        });

        actions.forEach(action => {
          if (action.opacity <= 0) {
            actions.splice(actions.indexOf( action ), 1);
          }
          action.update().draw( ctx );
        });

        requestAnimFrame(gameLoop);
      }();

      socket.emit('game-start');
    });
  }
};