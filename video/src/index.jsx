import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Film} from './Film.jsx';
import timings from './timings.json';

const Root = () => (
  <Composition id="Ch09Callback" component={Film} durationInFrames={Math.round(timings.total * 30)} fps={30} width={1280} height={720} />
);
registerRoot(Root);
