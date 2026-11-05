import './styles/base.css';
import './styles/animations.css';
import './styles/board.css';
import './styles/items.css';
import './styles/start.css';
import './styles/hud.css';
import './styles/dialogue.css';
import './styles/panel.css';
import './styles/preview.css';

import { $ } from './lib/dom.js';
import { createCamera } from './lib/camera.js';
import * as Sound from './components/SoundToggle.js';
import * as Dust from './components/DustCanvas.js';
import * as Start from './components/StartScreen.js';
import * as Board from './components/Board.js';
import * as Dialogue from './components/Dialogue.js';
import * as Preview from './components/LinkPreview.js';
import * as Panel from './components/SidePanel.js';
import * as Zoom from './components/ZoomControls.js';
import { initGame, startGame, canOpen, openEvidence, closeEvidence } from './game.js';

// Mount markup in stacking order, then wire each component.
$('app').innerHTML = [Sound.markup, Dust.markup, Start.markup, Board.markup, Zoom.markup, Dialogue.markup, Preview.markup, Panel.markup].join('\n');

const camera = createCamera($('vp'), $('world'));
Sound.initSoundToggle();
Dust.startDust();
Start.initStartScreen(startGame);
Board.mountBoard({ canOpen, onOpen: openEvidence });
Dialogue.initDialogue();
Preview.initLinkPreview();
Panel.initSidePanel(closeEvidence);
Zoom.initZoomControls(camera);
camera.center();
initGame(camera);
