export function buildCategories(categories) {
	let catString = '';
  if (!categories.length) {
    return '';
  }
	categories.map((category, i) => {
		catString += (i < categories.length - 1 ? `${category} - ` : category)
	});
	return catString;
}