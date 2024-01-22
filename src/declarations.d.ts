declare module '*.png';
declare module '*.svg';

type LoginResponse = {
	OK: boolean;
	Message: string;
	data: Caller | undefined;
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

type Credentials = {
	phone: string;
	pinCode: string;
	area: string;
};
