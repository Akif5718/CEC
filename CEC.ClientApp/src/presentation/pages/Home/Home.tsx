/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/ban-types */
import React from 'react';
import { IconButton, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { SearchRounded } from '@mui/icons-material';
import { useAppDispatch } from '../../../application/Redux/store/store';
import { setNavbarShow } from '../../../application/Redux/slices/ShowNavbarSlice';
import { setPanelShow } from '../../../application/Redux/slices/ShowPanelSlice';

type Props = {};

const Home = (props: Props) => {
  const dispatch = useAppDispatch();
  dispatch(setNavbarShow(true));
  dispatch(setPanelShow(true));

  const {
    register,
    getValues,
    reset,
    control,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    // defaultValues: {
    //   bank: null,
    // },
    mode: 'onBlur', // Validation will trigger on blur
  });
  const navigate = useNavigate();

  const handleCardClick = (filterKeyword: string) => {
    navigate(`/searchPage/${filterKeyword}`);
  };

  const onSubmit = (data: any) => {
    // Handle form submission here
    console.log('Search term:', data.search);
    navigate(`/searchPage/${data.search}`);
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-start bg-cover bg-center cursor-default"
      style={{
        backgroundImage: `url('https://static.vecteezy.com/system/resources/previews/032/225/092/large_2x/glowing-world-map-on-blue-background-globalization-concept-3d-rendering-futuristic-business-management-system-and-network-line-hologram-ai-generated-free-photo.jpg')`,
      }}
    >
      {/* Blurred background */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-md z-0" />

      {/* Content container */}
      <div className="relative w-full z-10 mt-44 flex flex-col items-center space-y-80">
        <form onSubmit={handleSubmit(onSubmit)} className="w-[40%]">
          <Controller
            name="search"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                // label="Search"
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

        {/* Cards container */}
        <div className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg p-6 rounded-lg flex flex-wrap justify-center items-stretch gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="w-60 h-40 bg-white bg-opacity-70 rounded-lg shadow-lg flex items-center justify-center cursor-pointer transform hover:scale-105 transition-transform duration-700"
              onClick={() => handleCardClick(`${index + 1}`)}
            >
              Card {index + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
