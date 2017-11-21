(function (w, d, $, ko, undefined) {
    'use strict';

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
            map: map,
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

    /** @type jQuery */
    var $map;

    var mapOptions = {
        center: undefined,
        zoom: 17,
        styles: [
            {
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#212121"
                    }
                ]
            },
            {
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#757575"
                    }
                ]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#212121"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#757575"
                    }
                ]
            },
            {
                "featureType": "administrative.country",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#9e9e9e"
                    }
                ]
            },
            {
                "featureType": "administrative.land_parcel",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative.locality",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#bdbdbd"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#757575"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#181818"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#616161"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#1b1b1b"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#2c2c2c"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#8a8a8a"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#373737"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#3c3c3c"
                    }
                ]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#4e4e4e"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#616161"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#757575"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#3d3d3d"
                    }
                ]
            }
        ]
    };

    /** @type google.maps.Map */
    var map;

    function AppViewModel() {
        var vm = this;

        vm.filterLocation = ko.observable('');
        vm.markers = [];

        /**
         * @param {google.maps.Marker} marker
         */
        vm.showInfoWindow = function (marker) {
            if (vm.infoWindow.marker !== marker) {
                $.getJSON('https://api.foursquare.com/v2/venues/search?ll=' + marker.getPosition().lat() + ',' + marker.getPosition().lng() +
                    '&client_id=1U50B2EYYGDZUCRWBKOUJORBGKRUHUM302IGKDA31UEZXNU3&client_secret=5GCCEHECDAZB54MUF1UC4RXUDFJLYSI3UDJPMKOS3ZHTQE5D&query=' + marker.getTitle() + '&v=20170708&m=foursquare')
                    .done(function (data) {
                        var venue = data.response.venues[0],
                            street = venue.location.formattedAddress[0],
                            city = venue.location.formattedAddress[1],
                            state = venue.location.formattedAddress[2],
                            country = venue.location.formattedAddress[3],
                            category = venue.categories[0].shortName;

                        $.getJSON('https://api.foursquare.com/v2/venues/' + venue.id + '/photos?client_id=1U50B2EYYGDZUCRWBKOUJORBGKRUHUM302IGKDA31UEZXNU3&client_secret=5GCCEHECDAZB54MUF1UC4RXUDFJLYSI3UDJPMKOS3ZHTQE5D&v=20170708&m=foursquare')
                            .done(function (data) {
                                var photo = data.response.photos.items[0],
                                    url;

                                if (photo) {
                                    url = photo.prefix + '100x100' + photo.suffix;
                                }
                                vm.infoWindow.setContent(
                                    '<div class="marker-info-window">' + (url ? ('<img class="photo float-left" src="' + url +
                                    '" width="100px" height="100px">') : '') +
                                    '<div class="text-container float-right"><span class="title">' + marker.getTitle() +
                                    '</span><br><span class="category">' + category +
                                    '</span><br><p title="Address">' + (street ? (street + '<br>') : '') +
                                    (city ? (city + '<br>') : '') + (state ? (state + '<br>') : '') +
                                    (country ? (country + '<br>') : '') + '</p></div></div>');
                            })
                            .fail(function (error) {
                                console.log(error);
                                alert('Error occurred while performing Foursquare API request!');
                            });
                    })
                    .fail(function () {
                        alert('Error occurred while performing Foursquare API request!');
                    });
                vm.infoWindow.marker = marker;
                vm.infoWindow.setContent('<div class="marker-info-window"><i class="glyphicon glyphicon-refresh loading"></i></div>');
                vm.infoWindow.open(map, marker);
                vm.infoWindow.addListener('closeclick', function () {
                    vm.infoWindow.marker = null;
                });
            }
        };

        vm.markerOnClick = function () {
            /** @type google.maps.Marker */
            var marker = this;
            vm.showInfoWindow(marker);
            marker.setAnimation(google.maps.Animation.Ro);
        };

        vm.initializeMap = function () {
            map = new google.maps.Map($map.get(0), mapOptions);
            vm.infoWindow = new google.maps.InfoWindow();
            for (var i = 0; i < locations.length; i++) {
                /** @type google.maps.Marker */
                var marker = locations[i].getMarker();
                marker.setMap(map);
                vm.markers.push(marker);
                marker.addListener('click', vm.markerOnClick);
            }
        };

        vm.initializeMap();

        vm.filteredLocations = ko.computed(function () {
            return $.grep(vm.markers, function (marker) {
                if (marker.getTitle().toLowerCase().includes(vm.filterLocation().toLowerCase())) {
                    marker.setVisible(true);
                    return true;
                } else {
                    marker.setVisible(false);
                    return false;
                }
            });
        });
    }

    w.mapsOnLoad = function () {
        $map = $('#map', d);
        mapOptions.center = new google.maps.LatLng(12.9701, 77.609);
        ko.applyBindings(new AppViewModel());
    };
})(window, document, jQuery, ko);