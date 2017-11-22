(function (w, d, $, ko, undefined) {
    'use strict';

    /** @type jQuery */
    var $map,
        $sidebar;

    var mapOptions = {
        center: undefined,
        zoom: 17,
        styles: mapStyles
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
                                alert('Error occurred while performing Foursquare API request, please retry.');
                            });
                    })
                    .fail(function () {
                        alert('Error occurred while performing Foursquare API request, please retry.');
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
            if ($sidebar.hasClass('opened')) {
                $sidebar.removeClass('opened').addClass('closed');
            }
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
        mapOptions.center = new google.maps.LatLng(12.9701, 77.609);
        ko.applyBindings(new AppViewModel());
    };

    $(function () {
        $sidebar = $('.sidebar', d);
        $map = $('#map', d);
        $.getScript('https://maps.googleapis.com/maps/api/js?v=3&key=AIzaSyAxw8Sd8TB3LCxf6clAXj8wfWtod54F6dQ&callback=mapsOnLoad')
            .fail(function () {
                alert('Error occurred while loading Google Maps API, please retry.');
            });
    });

    $(d)
        .on('click', '.sidebar-open', function () {
            if ($sidebar.hasClass('closed')) {
                $sidebar.removeClass('closed').addClass('opened');
            }
        })
        .on('click', '.sidebar-close', function () {
            if ($sidebar.hasClass('opened')) {
                $sidebar.removeClass('opened').addClass('closed');
            }
        });
})(window, document, jQuery, ko);