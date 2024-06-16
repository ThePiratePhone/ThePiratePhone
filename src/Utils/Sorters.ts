function areaSorter(a: Area, b: Area) {
	if (a.name > b.name) {
		return 1;
	} else if (a.name < b.name) {
		return -1;
	}
	return 0;
}

function campaignSorter(a: Campaign, b: Campaign) {
	if (a.areaName > b.areaName) {
		return 1;
	} else if (a.areaName < b.areaName) {
		return -1;
	}
	return 0;
}

export { areaSorter, campaignSorter };
