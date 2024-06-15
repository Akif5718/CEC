import React, { useState, useEffect } from 'react';
import FilterComponent from '../../components/MapPageComponents/FilterComponent';
import Navigator from '../../components/MapPageComponents/Navigator';
import { useGetAllQuery } from '../../../infrastructure/api/SearchApiSlice';
import { toast } from 'react-toastify';
import {
  SearchRequestModel,
  SearchResponseModel,
} from '../../../domain/interfaces/SearchModel';
import MapComponent from '../../components/MapPageComponents/MapComponent'; // Adjust the path based on your project structure
import { MarkerData } from '../../../domain/interfaces/MarkerData';
import { useGetUserByIdMutation } from '../../../infrastructure/api/UserApiSlice';
import { UserResponseModel } from '../../../domain/interfaces/UserResponseModel';
import { Home } from '@mui/icons-material';

interface IHome {
  x: number;
  y: number;
}

const SearchPage: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [home, setHome] = useState<IHome | null>(null);
  const [searchReq, setSearchReq] = useState<SearchRequestModel>({
    isJugendberufshilfen: true,
    isKindertageseinrichtungen: false,
    isSchulen: false,
    isSchulsozialarbeit: false,
  });
  const [searchResponseData, setSearchResponseData] =
    useState<SearchResponseModel>({
      jugendberufshilfen: [],
      schulen: [],
      schulsozialarbeit: [],
      kindertageseinrichtungen: [],
    });
  const [
    fetchUserById,
    {
      isLoading: isUserByIdLoading,
      isError: isUserByIdError,
      isSuccess: isUserByIdSuccess,
      data: userByIdResponse,
    },
  ] = useGetUserByIdMutation();

  useEffect(() => {
    if (isUserByIdSuccess && userByIdResponse && userByIdResponse.data) {
      setHome({ x: userByIdResponse.data.x, y: userByIdResponse.data.y });
    } else if (isError) {
      // Handle error state
      toast.error('An error occurred');
    }
  }, [isUserByIdLoading, isUserByIdError, isUserByIdSuccess, userByIdResponse]);
  useEffect(() => {
    const jsonUserInfo = localStorage.getItem('userInfo');
    if (jsonUserInfo) {
      const userInfo = JSON.parse(jsonUserInfo);
      if (userInfo && userInfo.userId) {
        fetchUserById(userInfo.userId);
      }
    }
  }, []);
  const {
    isLoading,
    isError,
    isSuccess,
    data: searchResponse,
  } = useGetAllQuery(searchReq);

  useEffect(() => {
    if (isSuccess && searchResponse && searchResponse.data) {
      // Handle success state
      setSearchResponseData({
        jugendberufshilfen: searchResponse.data.jugendberufshilfen ?? [],
        schulen: searchResponse.data.schulen ?? [],
        schulsozialarbeit: searchResponse.data.schulsozialarbeit ?? [],
        kindertageseinrichtungen:
          searchResponse.data.kindertageseinrichtungen ?? [],
      });
    } else if (isError) {
      // Handle error state
      toast.error('An error occurred');
    }
  }, [isLoading, isError, isSuccess, searchResponse]);

  useEffect(() => {
    setSearchReq({
      isSchulsozialarbeit: selectedCategories.includes('Schulsozialarbeit')
        ? true
        : false,
      isSchulen: selectedCategories.includes('Schulen') ? true : false,
      isKindertageseinrichtungen: selectedCategories.includes(
        'Kindertageseinrichtungen'
      )
        ? true
        : false,
      isJugendberufshilfen: selectedCategories.includes('Jugendberufshilfen')
        ? true
        : false,
    });
  }, [selectedCategories]);

  return (
    <>
      <div className="flex justify-center">
        <div className=" w-[82vw] overflow-clip">
          <FilterComponent
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <div className=" w-[80vw] h-[70vh] overflow-clip">
          <MapComponent
            markers={transformDataToMarkers(searchResponseData)}
            homeMarker={
              home
                ? { x: home.x, y: home.y, category: 'Home', details: {} }
                : null
            }
          />
        </div>
      </div>
    </>
  );
};

export default SearchPage;

// Helper function to transform searchResponseData to MarkerData format
const transformDataToMarkers = (data: SearchResponseModel): MarkerData[] => {
  let markers: MarkerData[] = [];

  // Transform each category data into MarkerData format
  markers = [
    ...data.jugendberufshilfen.map((item) => ({
      x: parseFloat(item.x),
      y: parseFloat(item.y),
      category: 'Jugendberufshilfen',
      details: {
        BEZEICHNUNG: item.bezeichnung,
        ORT: item.ort,
        PLZ: item.plz,
        STRASSE: item.strasse,
        TELEFON: item.telefon,
        EMAIL: item.email,
        // Add other properties as needed
      },
    })),
    ...data.schulen.map((item) => ({
      x: parseFloat(item.x),
      y: parseFloat(item.y),
      category: 'Schulen',
      details: {
        BEZEICHNUNG: item.bezeichnung,
        ORT: item.ort,
        PLZ: item.plz,
        STRASSE: item.strasse,
        TELEFON: item.telefon,
        EMAIL: item.email,
        // Add other properties as needed
      },
    })),
    ...data.schulsozialarbeit.map((item) => ({
      x: parseFloat(item.x),
      y: parseFloat(item.y),
      category: 'Schulsozialarbeit',
      details: {
        BEZEICHNUNG: item.bezeichnung,
        ORT: item.ort,
        PLZ: item.plz,
        STRASSE: item.strasse,
        TELEFON: item.telefon,
        EMAIL: item.email,
        // Add other properties as needed
      },
    })),
    ...data.kindertageseinrichtungen.map((item) => ({
      x: parseFloat(item.x),
      y: parseFloat(item.y),
      category: 'Kindertageseinrichtungen',
      details: {
        BEZEICHNUNG: item.bezeichnung,
        ORT: item.ort,
        PLZ: item.plz,
        STRASSE: item.strasse,
        TELEFON: item.telefon,
        EMAIL: item.email,
        // Add other properties as needed
      },
    })),
  ];

  return markers;
};
