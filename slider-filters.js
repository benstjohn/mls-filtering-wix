import wixData from "wix-data";
import { session } from "wix-storage";
$w.onReady(() => {
  $w("#priceSlider").max = 5000000;
  $w("#priceSlider").value = 500000;
  $w("#yearMax").text = "2019";
  $w("#priceMax").text = "$500,000";
  $w("#squareFootage").text = "100,000";
  loadRepeater();
  if (session.getItem("homeSearch")) {
    if (session.getItem("homeSearch").length > 0) {
      $w("#searchVal").value = session.getItem("homeSearch");
    }
  }
});

function loadRepeater() {
  $w("#repeater3").onItemReady(($item, itemData, index) => {
    let description = itemData.marketingRemarks;
    let price = numberWithCommas(itemData.listPrice);

    if (description.length > 200) {
      description = description.slice(0, 200) + "...";
    }
    $item("#text38").text = itemData.marketingRemarks.slice(0, 200);
    $item("#text34").text = price;

    if (
      itemData.totalBaths !== null &&
      itemData.totalBaths !== undefined &&
      itemData.totalBaths !== ""
    ) {
      $item("#bathText").text = itemData.totalBaths.toString();
    } else {
      $item("#bathText").text = "Ø";
    }
    if (
      itemData.totalBedrooms !== null &&
      itemData.totalBedrooms !== undefined &&
      itemData.totalBedrooms !== ""
    ) {
      $item("#bedText").text = itemData.totalBedrooms.toString();
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
let onlyOffice = true;
let filteringBy = "city";
let minPrice = 0;
let maxPrice = 500000;
let minBeds = 0;
let maxBeds = 7;
let checkBed = false;
let checkBath = false;
let minBaths = 0;
let maxBaths = 7;
let lotDimensionMax = 100000;
let yearMax = 2019;
let sortType = "entryTimestamp";
let ascend = false;

function filter(title) {
  let newFilter = wixData.filter();

  if (filteringBy === "district" && !!title) {
    newFilter = newFilter.contains("schoolDistrict", title);
  } else if (filteringBy === "city" && !!title) {
    newFilter = newFilter.contains("city", title);
  }

  //Setting the value to only display listings within the office or agnecy. Must change big value per site
  if (onlyOffice) {
    newFilter = newFilter.contains("officeID", "20140618172717129086000000");
    console.log("testing123");
  }
  //Setting the value to only display listings for an individual agent. Must change big value per site
  if (onlyAgent) {
    newFilter = newFilter.contains("agentID", "20150625160001727563000000");
  }
  //Giving constraints to the number of beds both [min] and [max]
  if (checkBed) {
    newFilter = newFilter.between("totalBedrooms", minBeds, maxBeds);
  }
  //Giving constraints to the number of baths both [min] and [max]
  if (checkBath) {
    newFilter = newFilter.between("totalBaths", minBaths, maxBaths);
  }
  //Giving constraints to the price of the listing both [min] and [max]
  newFilter = newFilter = newFilter.lt("listPrice", maxPrice);
  //Giving constraints to the dimensions of the listing both [0] and [max]
  newFilter = newFilter = newFilter.lt("lotSquareFootage", lotDimensionMax);
  //Giving constraints to the year of the listing both [1990] and [max]
  //newFilter = newFilter = newFilter.le("yearBuilt", yearMax);

  //actually setting the filter to the dataset and then re-loading our repeater
  $w("#dataset3").setFilter(newFilter);

  console.log("beds: " + minBeds + " to " + maxBeds);
  console.log("baths: " + minBaths + " to " + maxBaths);
  console.log("price: " + minPrice + " to " + maxPrice);
  console.log("dimensions: " + 0 + " to " + lotDimensionMax);
  console.log("year: " + 1900 + " to " + yearMax);
  lastFilterTitle = title;
}

function sortData() {
  let newSort = wixData.sort();

  if (ascend) {
    newSort = newSort.ascending(sortType);
  } else {
    newSort = newSort.descending(sortType);
  }

  //setting the way we are going to sort
  $w("#dataset3")
    .setSort(newSort)
    .then(() => {
      loadRepeater();
    });
}

export function searchVal_keyPress(event) {
  //Add your code for this event here:
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = undefined;
  }
  debounceTimer = setTimeout(() => {
    filter($w("#searchVal").value);
  }, 500);
}

export function contentID_change(event) {
  //Add your code for this event here:
  filteringBy = $w("#contentID").value;
}

/*
export function checkbox1_change(event) {
	//Add your code for this event here: 
	if ($w('#checkbox1').checked) {
		onlyAgent = true;
		filter(lastFilterTitle);
	} else {
		onlyAgent = false;
		filter(lastFilterTitle);
	}
}*/

export function checkbox2_change(event) {
  if ($w("#checkbox2").checked) {
    onlyOffice = true;
  } else {
    onlyOffice = false;
  }
  filter(lastFilterTitle);
}

export function minBeds_change(event) {
  //Add your code for this event here:
  checkBed = true;
  minBeds = parseInt($w("#minBeds").value, 10);
  filter(lastFilterTitle);
}

export function maxBeds_change(event) {
  //Add your code for this event here:
  checkBed = true;
  maxBeds = parseInt($w("#maxBeds").value, 10);
  filter(lastFilterTitle);
}

export function minBaths_change_1(event) {
  //Add your code for this event here:
  checkBath = true;
  minBaths = parseInt($w("#minBaths").value, 10);
  filter(lastFilterTitle);
}

export function maxBaths_change(event) {
  //Add your code for this event here:
  checkBath = true;
  maxBaths = parseInt($w("#maxBaths").value, 10);
  filter(lastFilterTitle);
}

export function dimensionSlider_change(event) {
  //Add your code for this event here:
  lotDimensionMax = parseInt($w("#dimensionSlider").value, 10);
  $w("#squareFootage").text = numberWithCommas(lotDimensionMax);
  filter(lastFilterTitle);
}

export function priceSlider_change(event) {
  //Add your code for this event here:
  maxPrice = parseInt($w("#priceSlider").value, 10);
  $w("#priceMax").text = "$" + numberWithCommas(maxPrice);
  filter(lastFilterTitle);
}

export function yearSlider_change(event) {
  //Add your code for this event here:
  yearMax = parseInt($w("#yearSlider").value, 10);
  $w("#yearMax").text = yearMax.toString(10);
  filter(lastFilterTitle);
}

export function sortByFeatures_change(event) {
  //Add your code for this event here:
  let valSort = $w("#sortByFeatures").value;
  if (valSort === "dateOld") {
    sortType = "entryTimestamp";
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
    sortType = "totalBedrooms";
    ascend = true;
  } else if (valSort === "bathsMost") {
    sortType = "totalBaths";
    ascend = false;
  } else if (valSort === "bathsLeast") {
    sortType = "totalBaths";
    ascend = true;
  } else if (valSort === "yearOld") {
    sortType = "yearBuilt";
    ascend = true;
  } else if (valSort === "yearNew") {
    sortType = "yearBuilt";
    ascend = false;
  }
  sortData();
}
