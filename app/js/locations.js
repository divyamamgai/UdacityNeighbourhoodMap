var Location = function (location) {
    this.id = Location.count++;
    this.title = location.title;
    this.lat = location.lat;
    this.lng = location.lng;
};

Location.count = 0;

/**
 * @returns {google.maps.Marker}
 */
Location.prototype.getMarker = function () {
    return new google.maps.Marker({
        position: {
            lat: this.lat,
            lng: this.lng
        },
        title: this.title,
        lat: this.lat,
        lng: this.lng,
        id: this.id,
        animation: google.maps.Animation.DROP
    });
};

var locations = [
    new Location({
        title: 'PlanB',
        lat: 12.9680058,
        lng: 77.6068975
    }),
    new Location({
        title: 'Kobe Sizzlers',
        lat: 12.9700973,
        lng: 77.6099778
    }),
    new Location({
        title: 'Coffee World',
        lat: 12.9723127,
        lng: 77.60676549999999
    }),
    new Location({
        title: 'Olive Bar And Kitchen',
        lat: 12.966975,
        lng: 77.608058
    }),
    new Location({
        title: 'Kanti Sweets',
        lat: 12.9705515,
        lng: 77.60667549999999
    }),
    new Location({
        title: 'Just Bake',
        lat: 12.9701259,
        lng: 77.6104053
    }),
    new Location({
        title: 'Meghana Foods',
        lat: 12.9729674,
        lng: 77.6092793
    }),
    new Location({
        title: 'Stars \'N\' Stripes',
        lat: 12.971009,
        lng: 77.6067204
    }),
    new Location({
        title: 'Arbor Brewing Company',
        lat: 12.9701406,
        lng: 77.61091060000001
    }),
    new Location({
        title: 'Communiti Brew',
        lat: 12.9722659,
        lng: 77.60830869999999
    })
];