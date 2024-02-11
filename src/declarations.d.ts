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
			count: number;
			callCall: number;
			callInThisCampaign: number;
			timeInCallInThisCampaign: number;
			total: number;
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
};

type Area = {
	_id: string;
	name: string;
};
