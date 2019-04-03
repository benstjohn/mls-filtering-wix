// For full API documentation, including code examples, visit http://wix.to/94BuAAs

$w.onReady(function() {
  //TODO: write your page related code here...
  let items = [];

  let current = $w("#dynamicDataset").getCurrentItem();
  console.log(current.images.length);
  let price = numberWithCommas(current.listPrice);
  for (var i = 0; i < current.images.length; i++) {
    items.push(current.images[i]);
  }

  items.push({
    src:
      "https://static.wixstatic.com/media/555a87_2876b7aa39e54b47b30032c2b2d77a65~mv2.png",
    title: "Title"
  });
  $w("#gallery1").items = items;

  let address =
    current.street +
    " " +
    current.streetName +
    " " +
    current.city +
    " " +
    current.state +
    ", " +
    current.zipCode;
  console.log(address);
  $w("#text18").text = address;
  $w("#addrForm").value = address;
  $w("#text29").text = price;
  console.log(current.lattitude + "+" + current.longitude);
  $w("#googleMaps1").location = {
    latitude: current.latitude,
    longitude: current.longitude,
    description: address
  };

  $w("#dynamicDataset").onReady(() => {
    if (
      current.totalBaths !== null &&
      current.totalBaths !== undefined &&
      current.totalBaths !== ""
    ) {
      $w("#text22").text = current.totalBaths.toString();
    } else {
      $w("#text22").text = "Ø";
    }
    if (
      current.totalBedrooms !== null &&
      current.totalBedrooms !== undefined &&
      current.totalBedrooms !== ""
    ) {
      $w("#text21").text = current.totalBedrooms.toString();
    } else {
      $w("#text21").text = "Ø";
    }

    $w("#text23").text = numberWithCommas(current.lotSquareFootage);
  });
});

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
