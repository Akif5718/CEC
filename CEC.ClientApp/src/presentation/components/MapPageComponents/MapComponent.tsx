import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { renderToString } from 'react-dom/server';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/dist/styles.min.css';
import MarkerClusterGroup from 'react-leaflet-cluster';
import axios from 'axios'; // Import Axios for HTTP requests
import { DataGrid, GridColDef } from '@mui/x-data-grid'; // Import DataGrid and GridColDef from Material-UI
import { Home as HomeIcon } from '@mui/icons-material'; // Import HomeIcon from Material-UI

interface MarkerData {
  x: number; // longitude
  y: number; // latitude
  category: string;
  details: object; // Changed to object to handle dynamic properties
}

interface MapComponentProps {
  markers: MarkerData[];
  homeMarker?: MarkerData | null;
}

const MapComponent: React.FC<MapComponentProps> = ({ markers, homeMarker }) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<object | null>(null);
  const [distanceToHome, setDistanceToHome] = useState<number | null>(null);

  const getColorByCategory = (category: string): string => {
    switch (category) {
      case 'Jugendberufshilfen':
        return 'orange'; // lighter orange
      case 'Schulen':
        return '#32CD32'; // lighter green
      case 'Schulsozialarbeit':
        return '#FF6347'; // lighter red
      case 'Kindertageseinrichtungen':
        return '#1E90FF'; // lighter blue
      default:
        return 'gray';
    }
  };

  const getHomeIcon = () =>
    L.divIcon({
      className: 'custom-div-icon',
      html: renderToString(
        <div style={{ position: 'relative', width: '32px', height: '48px' }}>
          {/* Circle */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: '0',
              transform: 'translateX(-50%)',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#FFD700', // Bright yellow
              border: '2px solid black',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
            }}
          >
            {/* Home Icon */}
            <HomeIcon style={{ fontSize: '18px', color: '#000000' }} />{' '}
            {/* Red */}
          </div>
          {/* Marker-like Bottom */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: '0',
              transform: 'translateX(-50%)',
              width: '0',
              height: '0',
              borderTop: '8px solid black',
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              zIndex: 0,
            }}
          />
        </div>
      ),
      iconSize: [32, 48],
      iconAnchor: [16, 48],
    });

  const getCategoryIcon = (category: string) =>
    L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: ${getColorByCategory(
        category
      )}; width: 20px; height: 20px; border-radius: 50%;"></div>`,
    });

  const createClusterCustomIcon = (cluster: any, color: string) => {
    const count = cluster.getChildCount();

    return L.divIcon({
      html: `<div style="background-color: ${color}; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px;">${count}</div>`,
      className: 'cluster-icon',
      iconSize: L.point(30, 30, true),
    });
  };

  const columns: GridColDef[] = [
    { field: 'key', headerName: 'Key', flex: 1 },
    { field: 'value', headerName: 'Value', flex: 2 },
  ];

  const categories = [
    'Jugendberufshilfen',
    'Schulen',
    'Schulsozialarbeit',
    'Kindertageseinrichtungen',
  ];
  const calculateDistance = (
    marker1: MarkerData,
    marker2: MarkerData
  ): number => {
    const R = 6371; // Radius of the Earth in km
    const lat1 = marker1.y;
    const lon1 = marker1.x;
    const lat2 = marker2.y;
    const lon2 = marker2.x;

    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  };

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180);
  };
  const handleMoreButtonClick = async (marker: MarkerData) => {
    try {
      // Fetch additional information using OpenCage Geocoder API
      const apiKey = '62eb6a322f66465a9ed8d2e4c9223106'; // Replace with your API key
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?key=${apiKey}&q=${marker.y},${marker.x}&pretty=1`
      );

      if (response.data.results.length > 0) {
        const data = response.data.results[0].components; // Extracting the components object from the first result

        // Display additional information in a modal or popup
        setModalContent(data);
        setModalOpen(true); // Open the modal

        if (homeMarker) {
          const distance = calculateDistance(marker, homeMarker);
          setDistanceToHome(distance);
        }
      } else {
        throw new Error('No results found for the given coordinates');
      }
    } catch (error) {
      console.error('Error fetching additional information:', error);
      alert('Failed to fetch additional information');
    }
  };

  return (
    <MapContainer
      center={[50.8282, 12.9209]}
      zoom={13}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Display home marker if available */}
      {homeMarker && (
        <Marker position={[homeMarker.y, homeMarker.x]} icon={getHomeIcon()}>
          <Popup>
            <div>
              <h1 className="text-lg font-bold">Home</h1>
              {/* Customize the popup content for the home marker if needed */}
            </div>
          </Popup>
        </Marker>
      )}

      {/* Display markers for each category */}
      {categories.map((category) => (
        <MarkerClusterGroup
          key={category}
          iconCreateFunction={(cluster) =>
            createClusterCustomIcon(cluster, getColorByCategory(category))
          }
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={false}
          maxClusterRadius={40}
        >
          {markers
            .filter((marker) => marker.category === category)
            .map((marker, index) => (
              <Marker
                key={index}
                position={[marker.y, marker.x]}
                icon={getCategoryIcon(marker.category)}
              >
                <Popup>
                  <div>
                    <h1 className="text-lg font-bold">{marker.category}</h1>
                    <hr className="my-2" />
                    <table className="table-auto w-full">
                      <tbody>
                        {Object.entries(marker.details).map(([key, value]) => (
                          <tr key={key} className="border-b">
                            <td className="py-1 px-2 font-semibold">{key}</td>
                            <td className="py-1 px-2">{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <button
                      className="mt-2 py-2 px-4 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none"
                      onClick={() => handleMoreButtonClick(marker)}
                    >
                      More
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MarkerClusterGroup>
      ))}

      {/* Modal for additional information */}
      {modalOpen && (
        <div className="fixed inset-0 z-[9999] bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-md shadow-lg max-w-3xl w-full">
            <button
              className="top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
              onClick={() => setModalOpen(false)}
            >
              Close
            </button>
            <h2 className="text-xl font-bold mb-2">Additional Information</h2>
            <div style={{ height: 400, width: '100%' }}>
              {distanceToHome !== null && (
                <span className="text-xs text-gray-600 block mt-2">
                  Distance from home: {distanceToHome.toFixed(2)} km
                </span>
              )}
              <DataGrid
                rows={
                  modalContent
                    ? Object.entries(modalContent).map(([key, value]) => ({
                        id: key,
                        key,
                        value,
                      }))
                    : []
                }
                columns={columns}
                pageSizeOptions={[5, 10, 25]}
              />
            </div>
          </div>
        </div>
      )}
    </MapContainer>
  );
};

export default MapComponent;

// import React, { useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import { renderToString } from 'react-dom/server';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import 'react-leaflet-markercluster/dist/styles.min.css';
// import MarkerClusterGroup from 'react-leaflet-cluster';
// import axios from 'axios'; // Import Axios for HTTP requests
// import { DataGrid, GridColDef } from '@mui/x-data-grid'; // Import DataGrid and GridColDef from Material-UI
// import { Home as HomeIcon } from '@mui/icons-material'; // Import HomeIcon from Material-UI

// interface MarkerData {
//   x: number; // longitude
//   y: number; // latitude
//   category: string;
//   details: object; // Changed to object to handle dynamic properties
// }

// interface MapComponentProps {
//   markers: MarkerData[];
//   homeMarker?: MarkerData | null;
// }

// const MapComponent: React.FC<MapComponentProps> = ({ markers, homeMarker }) => {
//   const [modalOpen, setModalOpen] = useState<boolean>(false);
//   const [modalContent, setModalContent] = useState<object | null>(null);
//   const [distanceToHome, setDistanceToHome] = useState<number | null>(null);

//   const getColorByCategory = (category: string): string => {
//     switch (category) {
//       case 'Jugendberufshilfen':
//         return 'orange'; // lighter orange
//       case 'Schulen':
//         return '#32CD32'; // lighter green
//       case 'Schulsozialarbeit':
//         return '#FF6347'; // lighter red
//       case 'Kindertageseinrichtungen':
//         return '#1E90FF'; // lighter blue
//       default:
//         return 'gray';
//     }
//   };

//   const getHomeIcon = () =>
//     L.divIcon({
//       className: 'custom-div-icon',
//       html: renderToString(
//         <div style={{ position: 'relative', width: '32px', height: '48px' }}>
//           {/* Circle */}
//           <div
//             style={{
//               position: 'absolute',
//               left: '50%',
//               bottom: '0',
//               transform: 'translateX(-50%)',
//               width: '24px',
//               height: '24px',
//               borderRadius: '50%',
//               backgroundColor: '#FFD700', // Bright yellow
//               border: '2px solid black',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               zIndex: 1,
//             }}
//           >
//             {/* Home Icon */}
//             <HomeIcon style={{ fontSize: '18px', color: '#FF6347' }} />{' '}
//             {/* Red */}
//           </div>
//           {/* Marker-like Bottom */}
//           <div
//             style={{
//               position: 'absolute',
//               left: '50%',
//               bottom: '0',
//               transform: 'translateX(-50%)',
//               width: '0',
//               height: '0',
//               borderTop: '8px solid black',
//               borderLeft: '8px solid transparent',
//               borderRight: '8px solid transparent',
//               zIndex: 0,
//             }}
//           />
//         </div>
//       ),
//       iconSize: [32, 48],
//       iconAnchor: [16, 48],
//     });

//   const getCategoryIcon = (category: string) =>
//     L.divIcon({
//       className: 'custom-div-icon',
//       html: `<div style="background-color: ${getColorByCategory(
//         category
//       )}; width: 20px; height: 20px; border-radius: 50%;"></div>`,
//     });

//   const createClusterCustomIcon = (cluster: any, color: string) => {
//     const count = cluster.getChildCount();

//     return L.divIcon({
//       html: `<div style="background-color: ${color}; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px;">${count}</div>`,
//       className: 'cluster-icon',
//       iconSize: L.point(30, 30, true),
//     });
//   };

//   const columns: GridColDef[] = [
//     { field: 'key', headerName: 'Key', flex: 1 },
//     { field: 'value', headerName: 'Value', flex: 2 },
//   ];

//   const categories = [
//     'Jugendberufshilfen',
//     'Schulen',
//     'Schulsozialarbeit',
//     'Kindertageseinrichtungen',
//   ];

//   const handleMoreButtonClick = async (marker: MarkerData) => {
//     try {
//       // Fetch additional information using OpenCage Geocoder API
//       const apiKey = 'your-opencagedata-api-key'; // Replace with your API key
//       const response = await axios.get(
//         `https://api.opencagedata.com/geocode/v1/json?key=${apiKey}&q=${marker.y},${marker.x}&pretty=1`
//       );

//       if (response.data.results.length > 0) {
//         const data = response.data.results[0].components; // Extracting the components object from the first result

//         // Display additional information in a modal or popup
//         setModalContent(data);
//         setModalOpen(true); // Open the modal

//         // Calculate distance to home marker if available
//         if (homeMarker) {
//           const distance = calculateDistance(marker, homeMarker);
//           setDistanceToHome(distance);
//         }
//       } else {
//         throw new Error('No results found for the given coordinates');
//       }
//     } catch (error) {
//       console.error('Error fetching additional information:', error);
//       alert('Failed to fetch additional information');
//     }
//   };

//   const calculateDistance = (
//     marker1: MarkerData,
//     marker2: MarkerData
//   ): number => {
//     const R = 6371; // Radius of the Earth in km
//     const lat1 = marker1.y;
//     const lon1 = marker1.x;
//     const lat2 = marker2.y;
//     const lon2 = marker2.x;

//     const dLat = deg2rad(lat2 - lat1);
//     const dLon = deg2rad(lon2 - lon1);

//     const a =
//       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//       Math.cos(deg2rad(lat1)) *
//         Math.cos(deg2rad(lat2)) *
//         Math.sin(dLon / 2) *
//         Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     const distance = R * c;

//     return distance;
//   };

//   const deg2rad = (deg: number): number => {
//     return deg * (Math.PI / 180);
//   };

//   return (
//     <MapContainer
//       center={[50.8282, 12.9209]}
//       zoom={13}
//       style={{ height: '100vh', width: '100%' }}
//     >
//       <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//       {/* Display home marker if available */}
//       {homeMarker && (
//         <Marker position={[homeMarker.x, homeMarker.y]} icon={getHomeIcon()}>
//           <Popup>
//             <div>
//               <h1 className="text-lg font-bold">Home</h1>
//               {/* Customize the popup content for the home marker if needed */}
//             </div>
//           </Popup>
//         </Marker>
//       )}

//       {/* Display markers for each category */}
//       {categories.map((category) => (
//         <MarkerClusterGroup
//           key={category}
//           iconCreateFunction={(cluster) =>
//             createClusterCustomIcon(cluster, getColorByCategory(category))
//           }
//           spiderfyOnMaxZoom={true}
//           showCoverageOnHover={false}
//           maxClusterRadius={40}
//         >
//           {markers
//             .filter((marker) => marker.category === category)
//             .map((marker, index) => (
//               <Marker
//                 key={index}
//                 position={[marker.y, marker.x]}
//                 icon={getCategoryIcon(marker.category)}
//               >
//                 <Popup>
//                   <div>
//                     <h1 className="text-lg font-bold">{marker.category}</h1>
//                     <hr className="my-2" />
//                     <table className="table-auto w-full">
//                       <tbody>
//                         {Object.entries(marker.details).map(([key, value]) => (
//                           <tr key={key} className="border-b">
//                             <td className="py-1 px-2 font-semibold">{key}</td>
//                             <td className="py-1 px-2">{value}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                     <button
//                       className="mt-2 py-2 px-4 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 focus:outline-none"
//                       onClick={() => handleMoreButtonClick(marker)}
//                     >
//                       More
//                     </button>
//                     {distanceToHome !== null && (
//                       <span className="text-xs text-gray-600 block mt-2">
//                         Distance from home: {distanceToHome.toFixed(2)} km
//                       </span>
//                     )}
//                   </div>
//                 </Popup>
//               </Marker>
//             ))}
//         </MarkerClusterGroup>
//       ))}

//       {/* Modal for additional information */}
//       {modalOpen && (
//         <div className="fixed inset-0 z-[9999] bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-4 rounded-md shadow-lg max-w-3xl w-full">
//             <button
//               className="top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
//               onClick={() => setModalOpen(false)}
//             >
//               Close
//             </button>
//             <h2 className="text-xl font-bold mb-2">Additional Information</h2>
//             <div style={{ height: 400, width: '100%' }}>
//               <DataGrid
//                 rows={
//                   modalContent
//                     ? Object.entries(modalContent).map(([key, value]) => ({
//                         id: key,
//                         key,
//                         value,
//                       }))
//                     : []
//                 }
//                 columns={columns}
//                 pageSizeOptions={[5, 10, 25]}
//               />
//             </div>
//           </div>
//         </div>
//       )}
//     </MapContainer>
//   );
// };

// export default MapComponent;