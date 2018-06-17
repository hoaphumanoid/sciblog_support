// Based on https://www.amcharts.com/demos/custom-html-elements-map-markers/ 

function Location(title, latitude, longitude) {
    this.title = title;
    this.latitude = latitude;
    this.longitude = longitude;
    this.scale = 0.5;
    this.zoomLevel = 5;
}

function getLA() {
    var latitude = 34.05;
    var longitude = -118.24;
    var title = "Los Angeles";
    return new Location(title, latitude, longitude);
}

function getMadrid() {
    var latitude = 40.4167;
    var longitude = -3.7033;
    var title = "Madrid";
    return new Location(title, latitude, longitude);
}

function getTokio() {
    var latitude = 35.6785;
    var longitude = 139.6823;
    var title = "Tokyo";
    return new Location(title, latitude, longitude);
}

function getNewDelhi() {
    var latitude = 28.6353;
    var longitude = 77.2250;
    var title = "New Delhi";
    return new Location(title, latitude, longitude);
}

function generateLocations() {
    var mapImages = [];
    mapImages.push(getLA());
    mapImages.push(getMadrid());
    mapImages.push(getTokio());

    //     newImages = [
    //         {% for location in locations %}
    // {
    //     "title": {% location.title %},
    //     "latitude": {% location.latitude %},
    //     "longitude": {% location.longitude %},
    //     "scale": 0.5,
    //         "zoomLevel": 5
    // }
    // //{ { if not loop.last } } , { { endif } }
    // {% endfor %}
    // ];

    //mapImages.push(newImages);


    return mapImages;
}



var map = AmCharts.makeChart("chartdiv", {
    "type": "map",
    "theme": "none",
    "projection": "miller",

    "imagesSettings": {
        "rollOverColor": "#089282",
        "rollOverScale": 3,
        "selectedScale": 3,
        "selectedColor": "#089282",
        "color": "#13564e"
    },

    "areasSettings": {
        "unlistedAreasColor": "#222222" /* change color of the map */
    },
    "dataProvider": {
        "map": "worldLow",
        "images": generateLocations()
    },
});


// add events to recalculate map position when the map is moved or zoomed
map.addListener("positionChanged", updateCustomMarkers);


// this function will take current images on the map and create HTML elements for them
function updateCustomMarkers(event) {
    // get map object
    var map = event.chart;

    // go through all of the images
    for (var x in map.dataProvider.images) {
        // get MapImage object
        var image = map.dataProvider.images[x];

        // check if it has corresponding HTML element
        if ('undefined' == typeof image.externalElement)
            image.externalElement = createCustomMarker(image);

        // reposition the element accoridng to coordinates
        var xy = map.coordinatesToStageXY(image.longitude, image.latitude);
        image.externalElement.style.top = xy.y + 'px';
        image.externalElement.style.left = xy.x + 'px';
    }
}

// this function creates and returns a new marker element
function createCustomMarker(image) {
    // create holder
    var holder = document.createElement('div');
    holder.className = 'map-marker';
    holder.title = image.title;
    holder.style.position = 'absolute';

    // maybe add a link to it?
    if (undefined != image.url) {
        holder.onclick = function () {
            window.location.href = image.url;
        };
        holder.className += ' map-clickable';
    }

    // create dot
    var dot = document.createElement('div');
    dot.className = 'dot';
    holder.appendChild(dot);

    // create pulse
    var pulse = document.createElement('div');
    pulse.className = 'pulse';
    holder.appendChild(pulse);

    // append the marker to the map container
    image.chart.chartDiv.appendChild(holder);

    return holder;
}
