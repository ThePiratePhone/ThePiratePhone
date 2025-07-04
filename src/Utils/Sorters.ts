function campaignSorter(a: Campaign, b: Campaign) {
	console.log('a', a, 'b', b);
	return a.name.localeCompare(b.name);
}

export { campaignSorter };
