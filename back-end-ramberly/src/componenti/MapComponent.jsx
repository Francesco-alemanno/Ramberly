import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import html2canvas from "html2canvas";

export function MapComponent() {
  //impostiamo i riferimenti per la manipolzione della mappa e per la gestione del suo conteniutore
  const mapRef = useRef();
  const mapContainerRef = useRef();

  //imposto lo useState della posizione del mio utente per gestirla in seguito all'interno dello useEffect e determinare quindi le coordinate dello user
  const [userLocation, setUserLocation] = useState(null);
  const [marker, setMarker] = useState(null); // Per tenere traccia del marker aggiunto
  const [distance, setDistance] = useState(null); // Stato per la distanza calcolata
  const [routeLayer, setRouteLayer] = useState(null); // Stato per il layer del percorso
  const [searchQuery, setSearchQuery] = useState(""); // Stato per la query di ricerca
  const [suggestions, setSuggestions] = useState([]); // Stato per memorizzare i suggerimenti

  const [countM2, setCountM2] = useState(0); // serve a contare i marker nella mappa
  const [countM, setCountM] = useState(0); // serve a contare i marker nella mappa
  const [position, setPosition] = useState(null);
  const [destination, setDestination] = useState(null);
  const [searchQueryR, setSearchQueryR] = useState(""); // Stato per la query di ricerca
  const [markerR, setMarkerR] = useState(null); // Per tenere traccia del marker aggiunto
  const [suggestionsR, setSuggestionsR] = useState([]); // Stato per memorizzare i suggerimenti

  useEffect(() => {
    //controllo l'esistenza di navigator.geolocation prima di andare a recuperare le informazioni delle coordinate
    if (navigator.geolocation) {
      //uso getcurrent position per ottenere i valori di latitudine e longitudine e li destrutturo partendo dal position.coords
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([longitude, latitude]);
          setPosition([longitude, latitude]);
          getAddressFromCoords(position[0], position[1]);
        },
        //in caso di errore nel caricamento della posizione imposto una posizione generica di render, in questo caso newyork
        (error) => {
          console.error("Error fetching location:", error.message);
          setUserLocation([-74.006, 40.7128]);
        }
      );
    } else {
      //se navigator.geolocation non è a tru imposto un else per avere in console un errore e impostare comunque la mia posizione di default
      console.error("Geolocation is not supported by your browser.");
      setUserLocation([-74.006, 40.7128]);
    }
  }, []);

  useEffect(() => {
    //controllo che userLocation esista prima di operare ulteriormente

    if (!userLocation) return;

    //impostiamo un valore a mapboxgl.accessToken per avere il riferimento al profilo utilizzato per la libreria
    mapboxgl.accessToken =
      "pk.eyJ1Ijoia2FyYXN1MDBnIiwiYSI6ImNtNmMxb2RjODBjNGQyanNjYWh2anl3aDYifQ.6Y73zxmEAj307vBJe-AmIw";
    //richiamno i riferimenti alla mappa e al suo contenitore per inizializzare la mappa
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: userLocation,
      zoom: 10,
      preserveDrawingBuffer: true,
    });
    // Aggiungo il marker alla mappa

    setMarker(
      new mapboxgl.Marker().setLngLat(userLocation).addTo(mapRef.current)
    );

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [userLocation]); //impostiamo la dipendenza con userLocation in modo che ogni volta che questo valore cambia la mappa venga reinizializzata

  const markers = []; // Array per tenere traccia dei marker

  const clickMap = (e) => {
    if (markers.length >= 2) {
      return; // Esce dalla funzione se ci sono già 2 marker
    }

    if (routeLayer) {
      if (mapRef.current.getLayer("route")) {
        mapRef.current.removeLayer("route");
      }
      if (mapRef.current.getSource("route")) {
        mapRef.current.removeSource("route");
      }
    }

    handleMapClick(e);

    setTimeout(() => {
      if (markers.length > 1) {
        markers[0].remove();
        markers.shift(); // Rimuove il riferimento dall'array
      }
    }, 1000);
  };

  // Gestisce il click sulla mappa e posiziona un marker
  const handleMapClick = async (e) => {
    if (markerR) {
      markerR.remove();
    }

    setSuggestions([]);
    setSuggestionsR([]);

    if (e.lngLat) {
      const { lngLat } = e;

      const newMarker = new mapboxgl.Marker()
        .setLngLat([lngLat.lng, lngLat.lat])
        .addTo(mapRef.current);

      markers.push(newMarker);

      //calcolo la nuova rotta

      if (!position || ![lngLat.lng, lngLat.lat]) return; // mi assicuro che ci siano sia la posizione dell'utente che il marker

      getAddressFromCoordsD(lngLat.lng, lngLat.lat);

      const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${position[0]},${position[1]};${lngLat.lng},${lngLat.lat}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0].geometry.coordinates;
          const distanceInMeters = data.routes[0].distance;
          const distanceInKilometers = (distanceInMeters / 1000).toFixed(2);

          setDistance(distanceInKilometers);

          // Rimuovo il percorso precedente se esistente
          if (routeLayer) {
            if (mapRef.current.getLayer("route")) {
              mapRef.current.removeLayer("route");
            }
            if (mapRef.current.getSource("route")) {
              mapRef.current.removeSource("route");
            }
          }

          const newRouteLayer = {
            id: "route", // Identificativo unico per il layer della linea
            type: "line", // Tipo di layer: in questo caso una linea per rappresentare il percorso
            source: {
              type: "geojson", // Tipo di sorgente: formato GeoJSON per rappresentare i dati geografici
              data: {
                type: "Feature", // Specifica che stiamo usando una "feature" GeoJSON
                properties: {}, // Proprietà opzionali della feature (può essere usato per metadati)
                geometry: {
                  type: "LineString", // Tipo di geometria: una linea con coordinate connesse
                  coordinates: route, // Coordinate del percorso ottenute dalla Directions API
                },
              },
            },
            layout: {
              "line-join": "round", // Unisce i segmenti della linea con angoli arrotondati
              "line-cap": "round", // Termina le estremità della linea in modo arrotondato
            },
            paint: {
              "line-color": "#ff0000", // Colore della linea: rosso (#ff0000)
              "line-width": 4, // Spessore della linea in pixel
            },
          };
          // Aggiungi la rotta alla mappa
          mapRef.current.addLayer(newRouteLayer);
          setRouteLayer(newRouteLayer);

          // ***AGGIUNGIAMO LO ZOOM AUTOMATICO***
          const bounds = new mapboxgl.LngLatBounds();

          // Aggiunge tutte le coordinate al bounding box
          route.forEach((coord) => bounds.extend(coord));

          // Applica lo zoom per includere l'intero percorso
          mapRef.current.fitBounds(bounds, {
            padding: 50, // Distanza dai bordi
            maxZoom: 15, // Zoom massimo
            duration: 1000, // Durata animazione in ms
          });
        }
      } catch (error) {
        console.error("Error fetching directions:", error);
      }
    }
  };

  // Funzione per calcolare la rotta
  const calculateRoute = async () => {
    if (marker || markerR || markers > 0) {
      marker.remove();
      markerR.remove();
    }
    if (!position || !destination) return; // mi assicuro che ci siano sia la posizione dell'utente che il marker

    const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${position[0]},${position[1]};${destination[0]},${destination[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0].geometry.coordinates;
        const distanceInMeters = data.routes[0].distance;
        const distanceInKilometers = (distanceInMeters / 1000).toFixed(2);

        setDistance(distanceInKilometers);

        // Rimuovo il percorso precedente se esistente
        if (routeLayer) {
          if (mapRef.current.getLayer("route")) {
            mapRef.current.removeLayer("route");
          }
          if (mapRef.current.getSource("route")) {
            mapRef.current.removeSource("route");
          }
        }

        const newRouteLayer = {
          id: "route", // Identificativo unico per il layer della linea
          type: "line", // Tipo di layer: in questo caso una linea per rappresentare il percorso
          source: {
            type: "geojson", // Tipo di sorgente: formato GeoJSON per rappresentare i dati geografici
            data: {
              type: "Feature", // Specifica che stiamo usando una "feature" GeoJSON
              properties: {}, // Proprietà opzionali della feature (può essere usato per metadati)
              geometry: {
                type: "LineString", // Tipo di geometria: una linea con coordinate connesse
                coordinates: route, // Coordinate del percorso ottenute dalla Directions API
              },
            },
          },
          layout: {
            "line-join": "round", // Unisce i segmenti della linea con angoli arrotondati
            "line-cap": "round", // Termina le estremità della linea in modo arrotondato
          },
          paint: {
            "line-color": "#ff0000", // Colore della linea: rosso (#ff0000)
            "line-width": 4, // Spessore della linea in pixel
          },
        };
        // Aggiungi la rotta alla mappa
        mapRef.current.addLayer(newRouteLayer);
        setRouteLayer(newRouteLayer);

        // ***AGGIUNGIAMO LO ZOOM AUTOMATICO***
        const bounds = new mapboxgl.LngLatBounds();

        // Aggiunge tutte le coordinate al bounding box
        route.forEach((coord) => bounds.extend(coord));

        // Applica lo zoom per includere l'intero percorso
        mapRef.current.fitBounds(bounds, {
          padding: 50, // Distanza dai bordi
          maxZoom: 15, // Zoom massimo
          duration: 1000, // Durata animazione in ms
        });
      }
    } catch (error) {
      console.error("Error fetching directions:", error);
    }
  };

  // Funzione per resettare la posizione sulla mappa (centrando sulla posizione dell'utente)
  const handleResetPosition = () => {
    if (markerR) {
      markerR.remove();
    }

    setSuggestions([]);
    setSuggestionsR([]);

    setSearchQuery("");
    setSearchQueryR("");

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: userLocation,
      zoom: 10,
      preserveDrawingBuffer: true,
    });

    setMarker(
      new mapboxgl.Marker().setLngLat(userLocation).addTo(mapRef.current)
    );
    setPosition(userLocation);
  };

  //HandleinputChange serve a far si che quando si cerca qualcosa nel campo input, suggestion che è un array vuoto, si carica con i consigli della mappa.

  const handleInputChange = async () => {
    if (!searchQuery) return;

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      searchQuery
    )}.json?access_token=${mapboxgl.accessToken}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setSuggestions(data.features); // Salviamo i suggerimenti nel nostro stato
    } catch (error) {
      console.error("Error fetching geocoding data:", error);
    }
  };

  const handleInputChangeR = async () => {
    if (!searchQueryR) return;

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      searchQueryR
    )}.json?access_token=${mapboxgl.accessToken}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setSuggestionsR(data.features); // Salviamo i suggerimenti nel nostro stato
    } catch (error) {
      console.error("Error fetching geocoding data:", error);
    }
  };

  //Funzione di ritorno per cercare un luogo tramite il nome e ottenere i suggerimenti in tempo reale
  const handleSearchR = async () => {
    if (!searchQueryR) return;

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      searchQueryR
    )}.json?access_token=${mapboxgl.accessToken}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setSuggestionsR(data.features); // Salviamo i suggerimenti nel nostro stato

      const firstResult = data.features[0];

      if (firstResult) {
        const [longitude, latitude] = firstResult.center;
        // Centriamo la mappa sulla posizione trovata

        // Rimuovo il marker precedente se esiste
        if (markerR) {
          markerR.remove();
        }

        // Creo un nuovo marker sulla posizione trovata
        const newMarker = new mapboxgl.Marker()
          .setLngLat([longitude, latitude])
          .addTo(mapRef.current);

        setMarkerR(newMarker);
        // Calcolo il percorso verso la nuova posizione cercata
        setDestination([longitude, latitude]);
      } else {
        alert("No results found!");
      }
    } catch (error) {
      console.error("Error fetching geocoding data:", error);
    }
  };

  // Funzione per cercare un luogo tramite il nome e ottenere i suggerimenti in tempo reale
  const handleSearch = async () => {
    if (!searchQuery) return;

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      searchQuery
    )}.json?access_token=${mapboxgl.accessToken}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setSuggestions(data.features); // Salviamo i suggerimenti nel nostro stato

      const firstResult = data.features[0];

      if (firstResult) {
        const [longitude, latitude] = firstResult.center;
        // Centriamo la mappa sulla posizione trovata

        // Rimuovo il marker precedente se esiste
        if (marker) {
          marker.remove();
        }

        // Creo un nuovo marker sulla posizione trovata
        const newMarker = new mapboxgl.Marker()

          .setLngLat([longitude, latitude])
          .addTo(mapRef.current);

        setMarker(newMarker);

        // Calcolo il percorso verso la nuova posizione cercata

        setPosition([longitude, latitude]);
      } else {
        alert("No results found!");
      }
    } catch (error) {
      console.error("Error fetching geocoding data:", error);
    }
  };

  // Funzione per gestire la selezione di un suggerimento dalla lista
  const handleSuggestionSelect = (suggestion) => {
    setSearchQuery(suggestion.place_name); // Impostiamo il nome del luogo nel campo di ricerca

    // Calcoliamo il percorso
  };

  const handleSuggestionSelectR = (suggestionR) => {
    setSearchQueryR(suggestionR.place_name); // Impostiamo il nome del luogo nel campo di ricerca

    // Calcoliamo il percorso
  };
  // const takeScreenshot = async () => {
  //   if (!mapContainerRef.current) return null;
  //   const { scrollWidth, scrollHeight } = mapContainerRef.current;

  //   return new Promise((resolve, reject) => {
  //     html2canvas(mapContainerRef.current, {
  //       width: scrollWidth,
  //       height: scrollHeight,
  //       scale: 1,
  //     }) // 🔥 Riduci la risoluzione
  //       .then((canvas) => {
  //         const base64Image = canvas.toDataURL("image/jpeg"); // 🔥 JPEG per ridurre dimensioni
  //         resolve(base64Image); // 🔥 Restituisce direttamente la stringa Base64
  //       })
  //       .catch(reject);
  //   });
  // };
  const takeScreenshot = async () => {
    if (!mapContainerRef.current || !mapRef.current) return null;

    // Salva lo stato originale della mappa
    const originalZoom = mapRef.current.getZoom();
    const originalCenter = mapRef.current.getCenter();
    const originalPadding = mapRef.current.getPadding();

    try {
      // Imposta un padding per mantenere il percorso visibile
      mapRef.current.setPadding(40, 40, 0, 0);

      // Calcola i bounds del percorso se esiste
      const routeSource = mapRef.current.getSource("route");
      if (routeSource) {
        const routeData = routeSource._data;
        const coordinates = routeData.geometry.coordinates;

        const bounds = coordinates.reduce(
          (bounds, coord) => bounds.extend(coord),
          new mapboxgl.LngLatBounds(coordinates[0], coordinates[0])
        );

        // Applica un fitBounds con zoom ridotto
        mapRef.current.fitBounds(bounds, {
          padding: 50,
          maxZoom: 20, // Regola questo valore per lo zoom desiderato
          duration: 0,
        });
      } else {
        // Zoom di default se non c'è percorso
        mapRef.current.setZoom(12);
      }

      // Aspetta il completamento del rendering
      await new Promise((resolve) => mapRef.current.once("idle", resolve));

      // Cattura lo screenshot
      const { scrollWidth, scrollHeight } = mapContainerRef.current;
      const canvas = await html2canvas(mapContainerRef.current, {
        width: scrollWidth,
        height: scrollHeight,
        scale: 1,
        useCORS: true,
      });

      return canvas.toDataURL("image/jpeg");
    } finally {
      // Ripristina lo stato originale
      mapRef.current.jumpTo({
        zoom: originalZoom,
        center: originalCenter,
      });
      mapRef.current.setPadding(originalPadding);
    }
  };

  //con getAddress ci è possibile catturare la posizione di un marker e ricavare la via e il nome della citta.
  useEffect(() => {
    if (position && position.length === 2) {
      getAddressFromCoords(position[0], position[1]);
    }
  }, [position]);

  const getAddressFromCoordsD = (lng, lat) => {
    if (!lng || !lat) return;
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}
`)
      .then((response) => response.json())
      .then((data) => {
        if (data.features.length > 0) {
          const place = data.features.find((feature) =>
            feature.place_type.includes("place")
          ); // Nome della città
          const street = data.features.find((feature) =>
            feature.place_type.includes("address")
          ); // Nome della via

          const address = `${street ? street.text : "Sconosciuto"}, ${
            place ? place.text : "Sconosciuto"
          }`;

          setCountM2(address);

          setSearchQueryR(address);
        }
      })
      .catch((error) =>
        console.error("Errore nella richiesta di geocoding:", error)
      );
  };

  const getAddressFromCoords = (lng, lat) => {
    if (!lng || !lat) return;
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${position[0]},${position[1]}.json?access_token=${mapboxgl.accessToken}
`)
      .then((response) => response.json())
      .then((data) => {
        if (data.features.length > 0) {
          const place = data.features.find((feature) =>
            feature.place_type.includes("place")
          ); // Nome della città
          const street = data.features.find((feature) =>
            feature.place_type.includes("address")
          ); // Nome della via

          const address = `${street ? street.text : "Sconosciuto"}, ${
            place ? place.text : "Sconosciuto"
          }`;

          setCountM(address);

          setSearchQuery((c) => (c ? c : address));
        }
      })
      .catch((error) =>
        console.error("Errore nella richiesta di geocoding:", error)
      );
  };

  return {
    mapRef,
    mapContainerRef,
    userLocation,
    marker,
    distance,
    searchQuery,
    setSearchQuery,
    suggestions,
    setSuggestions,
    searchQueryR,
    setSearchQueryR,
    suggestionsR,
    setSuggestionsR,
    markerR,
    handleSearchR,
    handleMapClick,
    handleSearch,
    handleResetPosition,
    takeScreenshot,
    handleSuggestionSelectR,
    handleSuggestionSelect,
    handleInputChange,
    handleInputChangeR,
    calculateRoute,
    destination,
    screen,
    clickMap,
    position,
  };
}
