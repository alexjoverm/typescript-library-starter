import React from 'react';

// tslint:disable-next-line:no-implicit-dependencies
import { storiesOf } from '@storybook/react';

import DummyComponent from './DummyComponent';

storiesOf('DummyComponent', module)
  .add('Simple', () => <DummyComponent />);
