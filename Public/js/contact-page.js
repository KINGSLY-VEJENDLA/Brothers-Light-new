document.addEventListener("DOMContentLoaded", function () {

    const mapElement = document.getElementById("globalMap");

    if (!mapElement) return;


    const map = L.map("globalMap", {

        center: [25, 20],

        zoom: 2,

        minZoom: 2,

        maxZoom: 6,

        worldCopyJump: true,

        scrollWheelZoom: false

    });


    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,

            attribution:
                '&copy; OpenStreetMap contributors'
        }
    ).addTo(map);


    /* =================================
       LOCATIONS
    ================================= */

    const locations = [

        {
            name: "India",
            city: "Hyderabad",
            lat: 17.3850,
            lng: 78.4867
        },

        {
            name: "USA",
            city: "United States",
            lat: 37.0902,
            lng: -95.7129
        },

        {
            name: "UK",
            city: "United Kingdom",
            lat: 54.3781,
            lng: -3.4360
        },

     //    {
     //        name: "UAE",
     //        city: "Dubai",
     //        lat: 25.2048,
     //        lng: 55.2708
     //    }

    ];


    /* =================================
       CUSTOM MARKER
    ================================= */

    const markerIcon = L.divIcon({

        className: "custom-map-marker",

        html: `
            <div class="marker-pulse"></div>
        `,

        iconSize: [20, 20],

        iconAnchor: [10, 10]

    });


    locations.forEach(location => {

        const marker = L.marker(

            [location.lat, location.lng],

            {
                icon: markerIcon
            }

        ).addTo(map);


        marker.bindPopup(`

            <div style="
                font-family:Poppins,sans-serif;
                min-width:150px;
            ">

                <strong style="
                    font-size:16px;
                ">
                    ${location.name}
                </strong>

                <br>

                <span style="
                    color:#777;
                    font-size:12px;
                ">
                    ${location.city}
                </span>

            </div>

        `);

    });


    /* =================================
       RESPONSIVE MAP
    ================================= */

    window.addEventListener("resize", function () {

        setTimeout(() => {

            map.invalidateSize();

        }, 200);

    });

});