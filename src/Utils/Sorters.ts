function areaSorter(a: Area, b: Area) {
	return a.name.localeCompare(b.name);
}

function campaignSorter(a: Campaign, b: Campaign) {
	return a.areaName.localeCompare(b.areaName);
}

export { areaSorter, campaignSorter };
