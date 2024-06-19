/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { Autocomplete, Checkbox, IconButton, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { Height, SearchRounded } from '@mui/icons-material';
import ApartmentIcon from '@mui/icons-material/Apartment';
import Diversity2Icon from '@mui/icons-material/Diversity2';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

import CloseIcon from '@mui/icons-material/Close';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../application/Redux/store/store';
import { setNavbarShow } from '../../../application/Redux/slices/ShowNavbarSlice';
import { setPanelShow } from '../../../application/Redux/slices/ShowPanelSlice';
import { saveLastRoute } from '../../../application/Redux/slices/LastRouteSlice';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
type Props = {};

const Home: React.FC<Props> = () => {
  const currentMode = useAppSelector((state) => state.currentMode.mode);
  const dispatch = useAppDispatch();
  dispatch(setNavbarShow(true));
  dispatch(setPanelShow(true));

  const location = useLocation();
  dispatch(saveLastRoute({ from: location.pathname }));

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const { register, handleSubmit, control } = useForm({
    mode: 'onBlur', // Validation will trigger on blur
  });

  const navigate = useNavigate();

  const handleCardClick = (category: string) => {
    navigate(`/searchPage/${category}`);
  };
  const handleSearchClick = () => {
    const filterKeywordsText = selectedCategories.join('-');
    navigate(`/searchPage/${filterKeywordsText}`);
  };

  const categories = [
    { categoryId: 1, name: 'Schulsozialarbeit', color: 'bg-[#FF6347]' },
    { categoryId: 2, name: 'Schulen', color: 'bg-[#32CD32]' },
    { categoryId: 3, name: 'Kindertageseinrichtungen', color: 'bg-[#1E90FF]' },
    { categoryId: 4, name: 'Jugendberufshilfen', color: 'bg-[orange]' },
    { categoryId: 5, name: 'Favourite', color: 'bg-[gray]' },
  ];
  const handleSearchBoxChange = (event: any, newValue: any) => {
    const newSelectedCategories = newValue.map(
      (item: { name: string }) => item.name
    );
    setSelectedCategories(newSelectedCategories);
  };
  // Map selectedCategories to the corresponding category objects
  const selectedCategoryObjects = categories.filter((category) =>
    selectedCategories.includes(category.name)
  );

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
            handleSearchClick();
          })}
          className="w-[50%]"
        >
          <Controller
            name="search"
            control={control}
            // defaultValue=""
            render={({ field }) => (
              <Autocomplete
                className="w-full"
                {...field}
                multiple
                id="checkboxes-tags-search"
                options={categories}
                disableCloseOnSelect
                getOptionLabel={(option) => option.name}
                onChange={handleSearchBoxChange}
                value={selectedCategoryObjects} // Set the value here
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    <span
                      className={`${option.color} px-4 py-1 text-white rounded`}
                    >
                      {option.name}
                    </span>
                  </li>
                )}
                style={{ width: '100%' }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search"
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <IconButton type="submit" edge="end">
                          <SearchRounded />
                        </IconButton>
                      ),
                      style: {
                        backgroundColor: `${
                          currentMode === 'Dark'
                            ? '#595959'
                            : 'rgba(255, 255, 255, 0.8)'
                        }`,
                        borderRadius: '4px',
                      },
                    }}
                  />
                )}
              />
            )}
          />
        </form>
        <div className="bg-white md:w-[80%] bg-opacity-50 backdrop-filter backdrop-blur-lg p-20 rounded-lg flex flex-wrap justify-center items-stretch gap-4">
          <div className="grid w-full grid-cols-2 md:grid-cols-4 gap-4">
            {/* <CategoryCard
              icon={<ApartmentIcon className="text-blue-500 text-6xl" />}
              name="All"
              onClick={() =>
                handleCardClick(
                  'Schulen-Kindertageseinrichtungen-Schulsozialarbeit-Jugendberufshilfen'
                )
              }
            /> */}
            <CategoryCard
              icon={
                <ApartmentIcon
                  style={{ fontSize: '5rem' }}
                  className="text-white"
                />
              }
              name="Schulen"
              color="bg-[#32CD32]"
              onClick={() => handleCardClick('Schulen')}
            />
            <CategoryCard
              icon={
                <Diversity2Icon
                  style={{ fontSize: '5rem' }}
                  className="text-white"
                />
              }
              name="Kindertageseinrichtungen"
              color="bg-[#1E90FF]"
              onClick={() => handleCardClick('Kindertageseinrichtungen')}
            />
            <CategoryCard
              icon={
                <Diversity3Icon
                  style={{ fontSize: '5rem' }}
                  className="text-white"
                />
              }
              color="bg-[#FF6347]"
              name="Schulsozialarbeit"
              onClick={() => handleCardClick('Schulsozialarbeit')}
            />
            <CategoryCard
              icon={
                <ChildCareIcon
                  style={{ fontSize: '5rem' }}
                  className="text-white"
                />
              }
              name="Jugendberufshilfen"
              color="bg-[orange]"
              onClick={() => handleCardClick('Jugendberufshilfen')}
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
  color: string;
  onClick: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  icon,
  name,
  color,
  onClick,
}) => {
  return (
    <div
      className={`relative p-6 ${color} bg-opacity-70 rounded-lg shadow-lg flex flex-col items-center justify-center cursor-pointer transform hover:scale-105 transition-transform duration-700`}
      onClick={onClick}
    >
      <div className="flex items-center justify-center h-28">{icon}</div>
      <div className="mt-4 font-medium text-white text-lg text-center">
        {name}
      </div>
    </div>
  );
};

export default Home;
