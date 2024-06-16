import React from 'react';
import { IconButton, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { SearchRounded } from '@mui/icons-material';
import { useAppDispatch } from '../../../application/Redux/store/store';
import { setNavbarShow } from '../../../application/Redux/slices/ShowNavbarSlice';
import { setPanelShow } from '../../../application/Redux/slices/ShowPanelSlice';
import ApartmentIcon from '@mui/icons-material/Apartment';
import Diversity2Icon from '@mui/icons-material/Diversity2';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import ChildCareIcon from '@mui/icons-material/ChildCare';

type Props = {};

const Home: React.FC<Props> = () => {
  const dispatch = useAppDispatch();
  dispatch(setNavbarShow(true));
  dispatch(setPanelShow(true));

  const { register, handleSubmit, control } = useForm({
    mode: 'onBlur', // Validation will trigger on blur
  });

  const navigate = useNavigate();

  const handleCardClick = (category: string) => {
    navigate(`/searchPage/${category}`);
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-start bg-cover bg-center cursor-default"
      style={{
        backgroundImage: `url('https://static.vecteezy.com/system/resources/previews/032/225/092/large_2x/glowing-world-map-on-blue-background-globalization-concept-3d-rendering-futuristic-business-management-system-and-network-line-hologram-ai-generated-free-photo.jpg')`,
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-md z-0" />
      <div className="relative w-full z-10 mt-44 flex flex-col items-center space-y-80">
        <form
          onSubmit={handleSubmit((data: any) => {
            navigate(`/searchPage/${data.search}`);
          })}
          className="w-[40%]"
        >
          <Controller
            name="search"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                placeholder="Search"
                variant="outlined"
                className="w-full"
                InputProps={{
                  endAdornment: (
                    <IconButton type="submit" edge="end">
                      <SearchRounded />
                    </IconButton>
                  ),
                  style: {
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '4px',
                  },
                }}
              />
            )}
          />
        </form>
        <div className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg p-6 rounded-lg flex flex-wrap justify-center items-stretch gap-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <CategoryCard
              icon={<ApartmentIcon className="text-blue-500 text-6xl" />}
              name="Schulen"
              onClick={() => handleCardClick('Schulen')}
            />
            <CategoryCard
              icon={<Diversity2Icon className="text-blue-500 text-6xl" />}
              name="Kindertageseinrichtungen"
              onClick={() => handleCardClick('Kindertageseinrichtungen')}
            />
            <CategoryCard
              icon={<Diversity3Icon className="text-blue-500 text-6xl" />}
              name="Schulsozialarbeit"
              onClick={() => handleCardClick('Schulsozialarbeit')}
            />
            <CategoryCard
              icon={<ChildCareIcon className="text-blue-500 text-6xl" />}
              name="Jugendberufshilfe"
              onClick={() => handleCardClick('Jugendberufshilfe')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface CategoryCardProps {
  icon: JSX.Element;
  name: string;
  onClick: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ icon, name, onClick }) => {
  return (
    <div
      className="relative bg-white bg-opacity-70 rounded-lg shadow-lg flex flex-col items-center justify-center cursor-pointer transform hover:scale-105 transition-transform duration-700"
      onClick={onClick}
    >
      <div className="flex items-center justify-center h-28">{icon}</div>
      <div className="mt-4 font-medium text-lg text-center">{name}</div>
    </div>
  );
};

export default Home;
