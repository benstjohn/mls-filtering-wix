import wixData from "wix-data";
import { session } from "wix-storage";
$w.onReady(() => {
	loadRepeater();
});

function loadRepeater() {

	$w("#repeater3").onItemReady(($item, itemData, index) => {

		let description = (itemData.marketingRemarks);
		let price = numberWithCommas(itemData.listPrice);

		if (description.length > 200) {
			description = description.slice(0, 200) + "...";
		}
		$item('#text38').text = (itemData.marketingRemarks).slice(0, 200);
		$item('#text34').text = price;

		if (itemData.totalBaths !== null && itemData.totalBaths !== undefined && itemData.totalBaths !== "") {
			$item("#bathText").text = (itemData.totalBaths).toString();
		} else {
			$item("#bathText").text = "Ø";
		}
		if (itemData.totalBedrooms !== null && itemData.totalBedrooms !== undefined && itemData.totalBedrooms !== "") {
			$item("#bedText").text = (itemData.totalBedrooms).toString();
		} else {
			$item("#bedText").text = "Ø";
		}

		$item("#dimensionText").text = numberWithCommas(itemData.lotSquareFootage);

	});

}

function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

let lastFilterTitle = "";
let debounceTimer;
let onlyAgent = false;
let existingFilter = null;
let onlyOffice = false;
let filteringBy = "city";
let minPrice = 0;
let maxPrice = 250000;
let minBeds = 0;
let maxBeds = 7;
let garageFilter = "Yes";
let checkSquare = false;
let checkAcres = false;
let checkBed = false;
let checkBath = false;
let checkGarage = false;
let checkBasement = false;
let checkAccess = false;
let checkFront = false;
let checkView = false;
let checkNewConstruct = false;
let checkPool = false;
let checkFence = false;
let checkFire = false;
let checkSingleFam = false;
let checkCondo = false;
let checkMobileHome = false;
let checkCategory = false;
let checkFarm = false;
let checkYear = false;
let checkStories = false;
let minBaths = 0;
let maxBaths = 7;
let lotDimensionMin = 0;
let lotDimensionMax = 20000;
let lotDimensionMinAcres = 0;
let lotDimensionMaxAcres = 25;
let minStories = 0;
let yearMin = 1900;
let yearMax = 2019;
let sortType = "priceHigh";
let ascend = false;
let category = "NONE";

function filter(title) {

	let newFilter = wixData.filter();

	//Setting the value to only display listings within the office or agnecy. Must change big value per site
	if (onlyOffice) { newFilter = newFilter.contains('officeID', "20140618172716626230000000"); }
	//Setting the value to only display listings for an individual agent. Must change big value per site
	if (onlyAgent) { newFilter = newFilter.contains('agentID', "20150625160001727563000000"); }
	//Giving constraints to the number of beds both [min] and [max]
	if (checkBed) { newFilter = newFilter.ge("totalBedrooms", maxBeds); }
	//Giving constraints to the number of baths both [min] and [max]
	if (checkBath) { newFilter = newFilter.ge("totalBaths", maxBaths); }

	//category
	if (checkCategory && category !== "NONE") {
		console.log("category");
		newFilter = newFilter.contains("propertyType", category);
	}

	//Giving constraints to the price of the listing both [min] and [max]
	if (minPrice >= 0 && maxPrice >= 0) {
		newFilter = newFilter.between("listPrice", minPrice, maxPrice);
	}

	//Giving constraints to the dimensions of the listing both [0] and [max]
	if (checkSquare && lotDimensionMax >= 0 && lotDimensionMin >= 0) {
		newFilter = newFilter.between("lotSquareFootage", lotDimensionMin, lotDimensionMax);
	}

	if (checkAcres && lotDimensionMaxAcres >= 0 && lotDimensionMinAcres >= 0) {
		newFilter = newFilter.between("lotAcres", lotDimensionMinAcres, lotDimensionMaxAcres);
	}
	//Giving constraints to the year of the listing both [1990] and [max]
	if (checkYear && yearMin >= 0 && yearMax >= 0) {
		newFilter = newFilter.between("yearBuilt", yearMin, yearMax);
	}

	if (checkStories && minStories > 0) {
		newFilter = newFilter.ge("stories", minStories);
	}

	// Other filters to check

	if (checkGarage) { console.log("checkig garage");
		newFilter = newFilter.contains("garageGarage", garageFilter); }
	if (checkBasement) { newFilter = newFilter.contains("basement", "Yes"); }
	if (checkAccess) { newFilter = newFilter.contains("waterfrontOptionsWaterAccessYN", "Yes"); }
	if (checkFront) { newFilter = newFilter.contains("waterfront", ""); }
	if (checkView) { newFilter = newFilter.contains("waterfront", ""); }
	if (checkNewConstruct) { newFilter = newFilter.contains("newConstruction", "Yes"); }
	if (checkPool) { newFilter = newFilter.contains("pool", ""); }
	//if (checkFence) { newFilter = newFilter.contains("basement", "Yes"); }

	if (checkFire) { newFilter = newFilter.gt("totalFireplaces", 0); }

	if (checkSingleFam) { newFilter = newFilter.contains("propertySubType", "Single Family Residence"); }
	if (checkCondo) { newFilter = newFilter.contains("propertySubType", "Condominium"); }
	if (checkMobileHome) { newFilter = newFilter.contains("propertySubType", "Stock Cooperative"); }
	if (checkFarm) { newFilter = newFilter.contains("propertySubType", "Farm"); }

	//actually setting the filter to the dataset and then re-loading our repeater

	$w("#loader").show();
	$w('#dataset3').setFilter(newFilter).then(() => {
		console.log("is it hidden")
		$w('#loader').hide();
	}).catch((error) => {
		console.log(error)
	});

	console.log("beds: " + minBeds + " to " + maxBeds);
	console.log("baths: " + minBaths + " to " + maxBaths);
	console.log("price: " + minPrice + " to " + maxPrice);
	console.log("dimensions: " + 0 + " to " + lotDimensionMax + "true: " + checkSquare);
	console.log("dimensions: " + 0 + " to " + lotDimensionMaxAcres + "true: " + checkAcres);
	console.log("year: " + 1900 + " to " + yearMax);
	lastFilterTitle = title;

}

function sortData() {
	let newSort = wixData.sort();

	if (ascend) { newSort = newSort.ascending(sortType); } else { newSort = newSort.descending(sortType); }

	//setting the way we are going to sort

	$w("#loader").show();
	$w("#dataset3").setSort(newSort).then(() => {
		$w('#loader').hide();
		loadRepeater();
	});
}

export function propertyCat_change(event) {
	//Add your code for this event here: 
	checkCategory = true;
	category = $w("#propertyCat").value;
	filter(lastFilterTitle);
}

export function bedroomFilter_change(event) {
	//Add your code for this event here: 
	checkBed = true;
	maxBeds = parseInt($w("#bedroomFilter").value, 10);
	filter(lastFilterTitle);
}

export function bathroomFilter_change(event) {
	//Add your code for this event here: 
	checkBath = true;
	maxBaths = parseInt($w("#bathroomFilter").value, 10);
	filter(lastFilterTitle);
}

export function garageFilter_change(event) {
	//Add your code for this event here: 

	let garageNum = parseInt($w("#garageFilter").value, 10);
	if (garageNum === 0) {
		checkGarage = false;
	} else {
		garageFilter = "Yes";
		checkGarage = true;
	}
	filter(lastFilterTitle);
}

export function squareFeetFilter_keyPress(event) {
	//Add your code for this event here: 
	checkSquare = true;
	checkAcres = false;
	if (debounceTimer) {
		clearTimeout(debounceTimer);
		debounceTimer = undefined;
	}
	debounceTimer = setTimeout(() => {
		lotDimensionMin = parseInt($w("#squareFeetFilter").value, 10);
		filter(lastFilterTitle);
	}, 500);
}

export function squareFeetFilterMax_keyPress(event) {
	//Add your code for this event here: 
	checkSquare = true;
	checkAcres = false;
	if (debounceTimer) {
		clearTimeout(debounceTimer);
		debounceTimer = undefined;
	}
	debounceTimer = setTimeout(() => {
		lotDimensionMax = parseInt($w("#squareFeetFilterMax").value, 10);
		filter(lastFilterTitle);
	}, 500);
}

export function acreFilter_keyPress(event) {
	//Add your code for this event here: 
	checkAcres = true;
	checkSquare = false;
	if (debounceTimer) {
		clearTimeout(debounceTimer);
		debounceTimer = undefined;
	}
	debounceTimer = setTimeout(() => {
		lotDimensionMinAcres = parseInt($w("#acreFilter").value, 10);
		filter(lastFilterTitle);
	}, 500);
}

export function acreFilterMax_keyPress(event) {
	//Add your code for this event here: 
	checkAcres = true;
	checkSquare = false;
	if (debounceTimer) {
		clearTimeout(debounceTimer);
		debounceTimer = undefined;
	}
	debounceTimer = setTimeout(() => {
		lotDimensionMaxAcres = parseInt($w("#acreFilterMax").value, 10);
		filter(lastFilterTitle);
	}, 500);
}

export function yearFilter_keyPress(event) {
	//Add your code for this event here: 
	checkYear = true;
	if (debounceTimer) {
		clearTimeout(debounceTimer);
		debounceTimer = undefined;
	}
	debounceTimer = setTimeout(() => {
		yearMin = parseInt($w("#yearFilter").value, 10);
		filter(lastFilterTitle);
	}, 500);
}

export function yearFilteMax_keyPress(event) {
	//Add your code for this event here: 
	checkYear = true;
	if (debounceTimer) {
		clearTimeout(debounceTimer);
		debounceTimer = undefined;
	}
	debounceTimer = setTimeout(() => {
		yearMax = parseInt($w("#yearFilteMax").value, 10);
		filter(lastFilterTitle);
	}, 500);
}

export function priceFilter_keyPress(event) {
	//Add your code for this event here: 
	if (debounceTimer) {
		clearTimeout(debounceTimer);
		debounceTimer = undefined;
	}
	debounceTimer = setTimeout(() => {
		minPrice = parseInt($w("#priceFilter").value, 10);
		filter(lastFilterTitle);
	}, 500);
}

export function priceFilterMax_keyPress(event) {
	//Add your code for this event here: 
	if (debounceTimer) {
		clearTimeout(debounceTimer);
		debounceTimer = undefined;
	}
	debounceTimer = setTimeout(() => {
		maxPrice = parseInt($w("#priceFilterMax").value, 10);
		filter(lastFilterTitle);
	}, 500);
}

export function singleFamFilter_change(event) {
	//Add your code for this event here: 
	if ($w('#singleFamFilter').checked) { checkSingleFam = true; } else { checkSingleFam = false; }
	filter(lastFilterTitle);
}

export function condoFilter_change(event) {
	//Add your code for this event here: 
	if ($w('#condoFilter').checked) { checkCondo = true; } else { checkCondo = false; }
	filter(lastFilterTitle);
}

export function mobileHomeFilter_change(event) {
	//Add your code for this event here: 
	if ($w('#mobileHomeFilter').checked) { checkMobileHome = true; } else { checkMobileHome = false; }
	filter(lastFilterTitle);
}

export function farmFilter_change(event) {
	//Add your code for this event here: 
	if ($w('#farmFilter').checked) { checkFarm = true; } else { checkFarm = false; }
	filter(lastFilterTitle);
}

export function storyFilter_change(event) {
	//Add your code for this event here: 
	checkStories = true;
	minStories = parseInt($w("#storyFilter").value, 10);
	filter(lastFilterTitle);
}

export function basementFilter_change(event) {
	//Add your code for this event here: 
	if ($w('#basementFilter').checked) { checkBasement = true; } else { checkBasement = false; }
	filter(lastFilterTitle);
}

export function accessFilter_change(event) {
	//Add your code for this event here: 
	if ($w('#accessFilter').checked) { checkAccess = true; } else { checkAccess = false; }
	filter(lastFilterTitle);
}

export function frontFilter_change(event) {
	//Add your code for this event here: 
	if ($w('#frontFilter').checked) { checkFront = true; } else { checkFront = false; }
	filter(lastFilterTitle);
}

export function viewFilter_change(event) {
	//Add your code for this event here: 
	if ($w('#viewFilter').checked) { checkView = true; } else { checkView = false; }
	filter(lastFilterTitle);
}

export function newConstruction_change(event) {
	//Add your code for this event here: 
	if ($w('#newConstruction').checked) { checkNewConstruct = true; } else { checkNewConstruct = false; }
	filter(lastFilterTitle);
}

export function poolFilter_change(event) {
	//Add your code for this event here: 
	if ($w('#poolFilter').checked) { checkPool = true; } else { checkPool = false; }
	filter(lastFilterTitle);
}

export function fenceFilter_change(event) {
	//Add your code for this event here: 
	if ($w('#fenceFilter').checked) { checkFence = true; } else { checkFence = false; }
	filter(lastFilterTitle);
}

export function fireFilter_change(event) {
	//Add your code for this event here:
	if ($w('#fireFilter').checked) { checkFire = true; } else { checkFire = false; }
	filter(lastFilterTitle);
}

export function sortByFeatures_change_1(event) {
	//Add your code for this event here: 
	let valSort = $w("#sortByFeatures").value;
	if (valSort === "dateOld") {
		sortType = "entryTimestamp"
		ascend = true;
	} else if (valSort === "dateNew") {
		sortType = "entryTimestamp";
		ascend = false;
	} else if (valSort === "priceLow") {
		sortType = "listPrice";
		ascend = true;
	} else if (valSort === "priceHigh") {
		sortType = "listPrice";
		ascend = false;
	} else if (valSort === "sqftSmall") {
		sortType = "lotSquareFootage";
		ascend = true;
	} else if (valSort === "sqftLarge") {
		sortType = "lotSquareFootage";
		ascend = false;
	} else if (valSort === "bedsMost") {
		sortType = "totalBedrooms";
		ascend = false;
	} else if (valSort === "bedsLeast") {
		sortType = "totalBedrooms"
		ascend = true;
	} else if (valSort === "bathsMost") {
		sortType = "totalBaths"
		ascend = false;
	} else if (valSort === "bathsLeast") {
		sortType = "totalBaths"
		ascend = true;
	} else if (valSort === "yearOld") {
		sortType = "yearBuilt"
		ascend = true;
	} else if (valSort === "yearNew") {
		sortType = "yearBuilt"
		ascend = false;
	}
	sortData();
}