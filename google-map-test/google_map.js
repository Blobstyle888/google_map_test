
    var google_map = {
        bangSueLocation: "", // กำหนด defalut map อยู่ที่ บางซื่อ
        map: "", // เอาไว้เรียกใช้ google map api service
        place: "", // เอาไว้เรียกใช้ google map api service

        markers: [], // กำหนดตำแหน่ง marker ร้านอาหารหลาย ๆ ที่ max 20 ร้าน

        searchBox: "", // กำหนด google search Box service
        countryRestrict: "", // กำหนด ประเทศ
        autoSearch: true,

        divMap: "", // กำหนด div #map    
        results: "", // กำหนด tbody #results
        inputsearchBoxCounty: "", // กำหนด input #county

        init() {
            this.divMap = document.getElementById('map'); // กำหนด ID ของ map html 
            this.inputsearchBoxCounty = document.getElementById('county'); // กำหนด ID ของ Input html
            this.results = document.getElementById('results');

            this.countryRestrict = { 'country': 'th' }; // กำหนดเป็นประเทศไทยในการค้นหา
            this.bangSueLocation = { lat: 13.820777, lng: 100.524160 }; // กำหนด ตำแหน่งที่ตั้งของสถานที่

            google_map.getinitMap();
            google_map.getSearchBox();

            if (google_map.autoSearch) {
                google_map.searchFN();
                google_map.autoSearch = false;
            }

        },

        getinitMap() {
            this.map = new google.maps.Map(this.divMap, {
                zoom: 13,
                center: this.bangSueLocation,
                mapTypeId: 'roadmap',
                mapTypeControl: false,
                panControl: false,
                zoomControl: false,
                streetViewControl: false
            }); // กำหนด google map ในตำแหน่งที่ระบุไว้

            this.place = new google.maps.places.PlacesService(this.map); // place service

            this.searchBox = new google.maps.places.SearchBox(this.inputsearchBoxCounty, { // search textbox 
                types: ['(regions)'],
                componentRestrictions: google_map.countryRestrict
            });

        },

        // search text box สถานที่ในการค้นหา
        getSearchBox() {
            this.searchBox.addListener('places_changed', this.onPlaceChangedFN);
        },

        // สร้าง list ร้านอาหาร
        addListRestaurant(result, i, index) {


            // div html
            var divRoot = document.createElement('div');
            var divContainer = document.createElement('div');
            var divContet = document.createElement('div');
            var divFooter = document.createElement('div');

            divRoot.classList.add('col-md-6');
            divContainer.classList.add('row', 'no-gutters', 'border', 'rounded', 'overflow-hidden', 'flex-md-row', 'mb-4', 'shadow-sm', 'h-md-250', 'position-relative');
            divContet.classList.add('col', 'p-4', 'd-flex', 'flex-column', 'position-static')
            divFooter.classList.add('col-auto', 'd-none', 'd-lg-block')

            // div content 
            // var strongContent = document.createElement('strong');
            var hContet = document.createElement('h3');
            var numContent = document.createElement('div');
            var pContent = document.createElement('p');

            // strongContent.classList.add('d-inline-block', 'mb-2', 'text-primary');
            hContet.classList.add('mb-0');
            numContent.classList.add('mb-1', 'text-muted');
            pContent.classList.add('card-text', 'mb-auto');

            // text Content
            // var strongTxtContent = document.createTextNode(result.name);
            var hTxtConent = document.createTextNode(result.name)
            var numTextContent = document.createTextNode('No.' + index);
            var pTxtContent = document.createTextNode(result.vicinity);

            //appendTextContent
            // strongContent.append(strongTxtContent);
            hContet.append(hTxtConent);
            numContent.append(numTextContent);
            pContent.append(pTxtContent);

            //appendContent
            // divContet.appendChild(strongContent);
            divContet.appendChild(hContet);
            divContet.appendChild(numContent);
            divContet.appendChild(pContent);


            var imgFooter = document.createElement('img');
            imgFooter.src = result.photos === undefined ? "./No_Image.png" : result.photos[0].getUrl({ 'maxWidth': 200, 'maxHeight': 250 });
            imgFooter.width = 200;
            imgFooter.height = 250;

            divFooter.appendChild(imgFooter);


            //appendContainer
            divContainer.appendChild(divContet);
            divContainer.appendChild(divFooter);


            //appendRoot
            divRoot.appendChild(divContainer);

            //ShowResults
            results.appendChild(divRoot);


            // var tr = document.createElement('tr');
            // tr.style.backgroundColor = (i % 2 === 0 ? '#F0F0F0' : '#FFFFFF');
            // tr.onclick = function () {
            //     google.maps.event.trigger(google_map.markers[i], 'click');
            // };

            // var IdTd = document.createElement('td');
            // var nameTd = document.createElement('td');
            // var imgTd = document.createElement('td');

            // var img = document.createElement('img');
            // img.src = result.photos === undefined ? "" : result.photos[0].getUrl({ 'maxWidth': 500, 'maxHeight': 500 });
            // var id = document.createTextNode(index);
            // var name = document.createTextNode(result.name);

            // IdTd.appendChild(id);
            // imgTd.appendChild(img);
            // nameTd.appendChild(name);

            // tr.appendChild(IdTd);
            // tr.appendChild(imgTd);
            // tr.appendChild(nameTd);
            // this.results.appendChild(tr);
        },

        // สร้าง marker บน google map
        dropMarker(i) {
            return function () {
                google_map.markers[i].setMap(google_map.map);
            };
        },

        // เคลีย รายการร้านอาหาร
        clearRestaurant() {
            while (this.results.childNodes[0]) {
                google_map.results.removeChild(google_map.results.childNodes[0]);
            }
        },

        // เคลีย Marker ระบุตำแหน่งร้านอาหาร
        clearMarkers() {
            for (var i = 0; i < google_map.markers.length; i++) {
                if (google_map.markers[i]) {
                    google_map.markers[i].setMap(null);
                }
            }
            google_map.markers = [];
        },

        // function ในการ ค้นหาสถานที่ใน googlemap
        onPlaceChangedFN: function () {
            var place = google_map.searchBox.getPlaces();
            if (place[0].geometry) {
                google_map.map.panTo(place[0].geometry.location);
                google_map.map.setZoom(15);
                google_map.searchFN();

            } else {
                document.getElementById('county').placeholder = 'ค้นหาเขต';
            }
        },

        // function ในการ search ร้านอาหารใกล้เคียง
        searchFN: function () {

            var search;

            if (google_map.autoSearch) {
                search = {
                    location: google_map.bangSueLocation,
                    radius: 700,
                    types: ['restaurant']
                }
                google_map.map.setZoom(15);
            }
            else {
                search = {
                    bounds: google_map.map.getBounds(),
                    types: ['restaurant']
                }
            }

            // search หาร้านอาหารใกล้เคียงกับตำแหน่งที่ค้นหา
            this.place.nearbySearch(search, function (results, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    google_map.clearRestaurant();
                    google_map.clearMarkers();
                    let index = 1;


                    // สร้าง marker ที่หาเจอ ของร้านอาหาร
                    for (var i = 0; i < results.length; i++) {
                        // Use marker animation to drop the icons incrementally on the map.

                        // สร้าง marker โดยกำหนด ข้อความ 1,2,3,4,5,6 etc.
                        google_map.markers[i] = new google.maps.Marker({
                            position: results[i].geometry.location,
                            label: index.toString()
                        });

                        // ระบุตำแหน่ง marker ของร้านอาหาร
                        google_map.markers[i].placeResult = results[i];
                        setTimeout(google_map.dropMarker(i), i * 100);

                        // สร้าง list ของร้านอาหาร
                        google_map.addListRestaurant(results[i], i, index);
                        index++;
                    }
                }
            });
        },


    }
