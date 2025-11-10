declare module '*.png';
declare module '*.svg';

type LoginResponse = {
	OK: boolean;
	Message: string;
	data:
		| {
				caller: Caller;
				campaignAvailable: Array<Campaign>;
		  }
		| undefined;
};

type ProgressResponse = {
	totalClientCalled: number;
	totalDiscution: number;
	totalCall: number;
	totalUser: number;
	totalConvertion: number;
	timeInCall: number;
};

type Caller = {
	name: string;
	phone: string;
	pinCode: string;
	callTime: Map<string, number>;
};

type CallStatus = {
	name: string;
	toRecall: boolean;
};

type Satisfaction = 0 | 1 | 2 | 3 | 4;

type Client = {
	_id: string;
	name: stirng;
	firstname: string;
	phone: string;
	area: string;
	priority:
		| [
				{
					campaign: String;
					id: String;
				}
		  ]
		| undefined;
};

type Call = {
	client: Client;
	campaign: Campaign;
	satisfaction: Satisfaction;
	comment: string | null;
	status: CallStatus;
	start: Date;
	duration: number | null;
	lastInteraction: Date;
};

type CredentialsV2 = {
	phone: string;
	pinCode: string;
	URL: string;
	campaign: string;
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
	endTime: Date | null;
	status: Array<CallStatus>;
	callPermited: boolean;
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
	topfiveUsers: Array<{ _id: string; name: string; count: number; totalDuration: number; you: boolean }>;
	yourPlace: number;
};
