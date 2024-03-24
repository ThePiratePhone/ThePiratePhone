declare module '*.png';
declare module '*.svg';

type LoginResponse = {
	OK: boolean;
	Message: string;
	data:
		| {
				caller: Caller;
				areaCombo: AreaCombo;
		  }
		| undefined;
};

type ProgressResponse =
	| {
			totalClientCalled: number;
			totalDiscution: number;
			totalCall: number;
			totalUser: number;
			totalConvertion: number;
			timeInCall: number;
	  }
	| undefined;

type Caller = {
	name: string;
	phone: string;
	pinCode: string;
	callTime: Map<string, number>;
};

type CallStatus = 'Called' | 'Calling' | 'Not responded' | 'Todo';

type User = {
	name: string;
	phone: string;
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
	URL: string;
};

type AreaCombo = {
	area: Area;
	campaignAvailable: Array<Campaign>;
};

type Campaign = {
	name: string;
	_id: string;
	areaId: string;
	areaName: string;
	callHoursStart: Date | null;
	callHoursEnd: Date | null;
};

type Area = {
	_id: string;
	name: string;
};

type Theme = {
	name: string;
	CSS: React.CSSProperties;
};

type ScoreBoard = {
	yourPlace: number;
	scoreBoard: Array<{ name: string; nbCall: number; timeInCall: number }>;
};
