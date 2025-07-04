function campaignSorter(a: Campaign, b: Campaign) {
	return a.name.localeCompare(b.name);
}

export { campaignSorter };
