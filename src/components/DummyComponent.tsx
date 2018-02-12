import React from 'react';
import { withBlueRain } from '@blueeast/bluerain-os';

const DummyComponent = (props: any) => {
	const BR = props.bluerain;
	const Text = BR.Components.get('Text');
	return <Text>Hello, World! 😀 😎 👍 💯</Text>;
};

export default withBlueRain(DummyComponent);
