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

type CallStatus = 'In progress' | 'to recall' | 'Done' | 'deleted';

type Satisfaction = 0 | 1 | 2 | 3 | 4;

type Client = {
	name: string;
	firstname: string;
	phone: string;
	institution: string | null;
	createdAt: Date;
	campaigns: Array<Campaign>;
};

type Call = {
	client: Client;
	caller: Caller;
	campaign: Campaign;
	satisfaction: Satisfaction;
	comment: string | null;
	status: CallStatus;
	start: Date;
	duration: number | null;
	lastInteraction: Date;
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
	topfiveUsers: Array<{ _id: string; name: string; count: number; totalDuration: number; you: boolean }>;
	yourPlace: number;
};
