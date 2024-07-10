import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Home } from '@mui/icons-material';
import { useLocation, useParams } from 'react-router-dom';
import FilterComponent from '../../components/MapPageComponents/FilterComponent';
import Navigator from '../../components/MapPageComponents/Navigator';
import { useGetAllQuery } from '../../../infrastructure/api/SearchApiSlice';
import {
  SearchRequestModel,
  SearchResponseModel,
} from '../../../domain/interfaces/SearchModel';
import MapComponent from '../../components/MapPageComponents/MapComponent'; // Adjust the path based on your project structure
import { MarkerData } from '../../../domain/interfaces/MarkerData';
import { useGetUserByIdMutation } from '../../../infrastructure/api/UserApiSlice';
import { UserResponseModel } from '../../../domain/interfaces/UserResponseModel';
import { FavouriteRequestModel } from '../../../domain/interfaces/FavouriteModel';
import { useSaveFavouriteMutation } from '../../../infrastructure/api/FavouriteApiSlice';
import { useAppDispatch } from '../../../application/Redux/store/store';
import { saveLastRoute } from '../../../application/Redux/slices/LastRouteSlice';

interface IHome {
  x: number;
  y: number;
}

const SearchPage: React.FC = () => {
  const { filterKeywords } = useParams();
  console.log(' see here------->');
  console.log(filterKeywords);
  console.log(typeof filterKeywords);
  const filtrationArray = filterKeywords ? filterKeywords.split('-') : [];

  const dispatch = useAppDispatch();
  const location = useLocation();
  dispatch(saveLastRoute({ from: location.pathname }));

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [trigger, setTrigger] = useState(false);
  const [home, setHome] = useState<IHome | null>(null);
  const [transformedMarker, setTransformedMarker] = useState<MarkerData[]>([]);
  const [favFacility, setFavFacility] = useState<FavouriteRequestModel | null>(
    null
  );
  const [searchReq, setSearchReq] = useState<SearchRequestModel>({
    isJugendberufshilfen: false,
    isKindertageseinrichtungen: false,
    isSchulen: false,
    isSchulsozialarbeit: false,
    isFavourite: false,
  });

  //  made this to get everything selected of the filters
  useEffect(() => {
    if (filterKeywords) {
      filtrationArray.forEach((element) => {
        if (!selectedCategories.includes(element)) {
          selectedCategories.push(element);
          type SearchRequestModelKeys = keyof SearchRequestModel;
          const key = `is${element}` as SearchRequestModelKeys;
          setSearchReq((prevState) => ({
            ...prevState,
            [key]: true,
          }));
        }
      });
    }
  }, [filterKeywords]);

  useEffect(() => {
    console.log('Location path name current');
    console.log(location.pathname);
  }, []);

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
    } else if (isUserByIdError) {
      // Handle error state
      toast.error('An error occurred');
    }
  }, [isUserByIdLoading, isUserByIdError, isUserByIdSuccess, userByIdResponse]);

  const [
    saveFavourite,
    {
      isLoading: isSaveFavLoading,
      isError: isSaveFavError,
      isSuccess: isSaveFavSuccess,
      data: saveFavResponse,
    },
  ] = useSaveFavouriteMutation();

  useEffect(() => {
    if (isSaveFavSuccess && saveFavResponse && saveFavResponse.data) {
      toast.success('Favourite facilities are updated successfully');
      // setSelectedCategories([...selectedCategories]);
      refetchSearchResults();
    } else if (isSaveFavError) {
      // Handle error state
      toast.error('An error occurred');
    }
  }, [isSaveFavLoading, isSaveFavError, isSaveFavSuccess, saveFavResponse]);
  useEffect(() => {
    const jsonUserInfo = localStorage.getItem('userInfo');
    if (jsonUserInfo) {
      const userInfo = JSON.parse(jsonUserInfo);
      if (userInfo && userInfo.userId) {
        fetchUserById(userInfo.userId);
      }
    }
  }, []);
  useEffect(() => {
    if (favFacility !== null) {
      saveFavourite(favFacility);
    }
  }, [favFacility]);
  const {
    refetch: refetchSearchResults,
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
      setTransformedMarker(transformDataToMarkers({ ...searchResponse.data }));
    } else if (isError) {
      // Handle error state
      toast.error('An error occurred');
    }
  }, [isLoading, isError, isSuccess, searchResponse]);

  useEffect(() => {
    const createSearchReq = () => {
      return {
        isSchulsozialarbeit: selectedCategories.includes('Schulsozialarbeit'),
        isSchulen: selectedCategories.includes('Schulen'),
        isKindertageseinrichtungen: selectedCategories.includes(
          'Kindertageseinrichtungen'
        ),
        isJugendberufshilfen: selectedCategories.includes('Jugendberufshilfen'),
        isFavourite: selectedCategories.includes('Favourite'),
      };
    };

    setSearchReq({ ...createSearchReq() });
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
            markers={transformedMarker}
            homeMarker={
              home
                ? { x: home.x, y: home.y, category: 'Home', details: {} }
                : null
            }
            setFavFacility={setFavFacility}
          />
        </div>
      </div>
      <div className="flex justify-center">
        <div className="w-[80vw] text-right">
          <span>
            Source:{' '}
            <a
              href="https://portal-chemnitz.opendata.arcgis.com/"
              target="blank"
              className=" text-blue-500"
            >
              Open Data Portal
            </a>
          </span>
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
        bezeichnung: item.bezeichnung,
        ort: item.ort,
        plz: item.plz,
        strasse: item.strasse,
        telefon: item.telefon,
        email: item.email,
        isFavourite: item.isFavourite,
        id: item.id,
        // Add other properties as needed
      },
    })),
    ...data.schulen.map((item) => ({
      x: parseFloat(item.x),
      y: parseFloat(item.y),
      category: 'Schulen',
      details: {
        bezeichnung: item.bezeichnung,
        ort: item.ort,
        plz: item.plz,
        strasse: item.strasse,
        telefon: item.telefon,
        email: item.email,
        isFavourite: item.isFavourite,
        id: item.id,
        // Add other properties as needed
      },
    })),
    ...data.schulsozialarbeit.map((item) => ({
      x: parseFloat(item.x),
      y: parseFloat(item.y),
      category: 'Schulsozialarbeit',
      details: {
        bezeichnung: item.bezeichnung,
        ort: item.ort,
        plz: item.plz,
        strasse: item.strasse,
        telefon: item.telefon,
        email: item.email,
        isFavourite: item.isFavourite,
        id: item.id,
        // Add other properties as needed
      },
    })),
    ...data.kindertageseinrichtungen.map((item) => ({
      x: parseFloat(item.x),
      y: parseFloat(item.y),
      category: 'Kindertageseinrichtungen',
      details: {
        bezeichnung: item.bezeichnung,
        ort: item.ort,
        plz: item.plz,
        strasse: item.strasse,
        telefon: item.telefon,
        email: item.email,
        isFavourite: item.isFavourite,
        id: item.id,
        // Add other properties as needed
      },
    })),
  ];

  return markers;
};
