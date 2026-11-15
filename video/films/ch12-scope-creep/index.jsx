import {registerRoot} from 'remotion';
import {filmRoot} from '../../src/shell.jsx';
import {Film, ID} from './Film.jsx';
import timings from './timings.json';

registerRoot(filmRoot(ID, Film, timings));
