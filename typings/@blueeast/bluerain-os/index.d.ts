declare module '@blueeast/bluerain-os';

// export type BlueRain = { Filters: { add: (name: string, func: (params?: any) => void) => void }};
export type BlueRainType = {
	Apps: any,
	Components: any,
	Configs: any,
	Events: any,
	Filters: any,
	Plugins: any,

	Utils: {
		parseJsonSchema: any
	},

	refs: { [id: string]: {} },

	boot: any
};

export type Plugin = any;

export function withBlueRain (Component: any) : any;
