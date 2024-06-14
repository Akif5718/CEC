import React, { useState, useEffect } from 'react';
import FilterComponent from '../../components/SearchPageComponents/FilterComponent';
import Navigator from '../../components/SearchPageComponents/Navigator';
import { useGetAllQuery } from '../../../infrastructure/api/SearchApiSlice';
import { toast } from 'react-toastify';
import {
  SearchRequestModel,
  SearchResponseModel,
} from '../../../domain/interfaces/SearchModel';
import MapComponent from '../../components/SearchPageComponents/MapComponent'; // Adjust the path based on your project structure
import { MarkerData } from '../../../domain/interfaces/MarkerData';

const SearchPage: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
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
      <FilterComponent
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
      />
      <MapComponent markers={transformDataToMarkers(searchResponseData)} />
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
