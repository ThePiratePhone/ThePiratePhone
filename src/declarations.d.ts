declare module '*.png';
declare module '*.svg';

declare namespace NodeJS {
	interface ProcessEnv {
		URL: string;
	}
}

type LoginResponse = {
	OK: boolean;
	Message: string;
};

type Caller = {
	name: string;
	number: string;
	pin: string | null;
	callTime: Map<string, number>;
};

type CallStatus = 'Called' | 'Calling' | 'Not responded' | 'Todo';

type User = {
	name: string;
	number: string;
	callStatus: CallStatus;
	callerNumber: string | undefined;
	scriptVersion: number | undefined;
	callStart: Date | undefined;
	callEnd: Date | undefined;
};
