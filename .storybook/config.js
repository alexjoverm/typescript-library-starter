import React from 'react';

import { configure, addDecorator } from '@storybook/react';
import BR, { BlueRainProvider } from '@blueeast/bluerain-os';


// Add BlueRain
const BRConfigs = require('../bluerain');
BRConfigs.renderApp = false;
const BluerainApp = BR.boot(BRConfigs);
const BlueRainDecorator = (storyFn) => (<BlueRainProvider>{storyFn()}</BlueRainProvider>);
addDecorator(BlueRainDecorator);

// automatically import all files ending in *.stories.js
const req = require.context('../src', true, /.stories.tsx$/);
function loadStories() {
	req.keys().forEach((filename) => req(filename));
}
configure(loadStories, module);
