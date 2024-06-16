import React, { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const categories = [
  { categoryId: 1, name: 'Schulsozialarbeit', color: 'bg-[#FF6347]' },
  { categoryId: 2, name: 'Schulen', color: 'bg-[#32CD32]' },
  { categoryId: 3, name: 'Kindertageseinrichtungen', color: 'bg-[#1E90FF]' },
  { categoryId: 4, name: 'Jugendberufshilfen', color: 'bg-[orange]' },
  { categoryId: 5, name: 'Favourite', color: 'bg-[gray]' },
];

interface FilterProps {
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
}

interface Category {
  name: string;
  color: string;
}

interface CategoryButtonProps {
  category: Category;
  selected: boolean;
  onClick: () => void;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({
  category,
  selected,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`p-4 rounded-lg shadow-lg transform transition-transform ${
      selected ? 'scale-105' : 'scale-100'
    } ${category.color} text-white flex items-center justify-between`}
  >
    <span className="text-white font-semibold">{category.name}</span>
    <input
      type="checkbox"
      checked={selected}
      readOnly
      className="form-checkbox h-5 w-5 text-white ml-2"
    />
  </button>
);

const FilterComponent: React.FC<FilterProps> = ({
  selectedCategories,
  setSelectedCategories,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleSearchBoxChange = (event: any, newValue: any) => {
    let changeSelections: string[] = [];
    newValue.forEach((element: { name: string }) => {
      changeSelections = [...changeSelections, element.name];
    });
    setSelectedCategories(changeSelections);
  };

  const resetFilters = () => {
    setSelectedCategories([]);
  };

  const selectAll = () => {
    setSelectedCategories(categories.map((category) => category.name));
  };

  const removeCategory = (category: string) => {
    setSelectedCategories(selectedCategories.filter((c) => c !== category));
  };

  return (
    <div className="p-4 mt-20 relative">
      {/* Filter options for larger devices */}
      {/* <div className="hidden md:flex space-x-4 mb-4">
        <button
          onClick={selectAll}
          className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
        >
          Select All
        </button>
        <button
          onClick={resetFilters}
          className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
        >
          Reset
        </button>
        {categories.map((category) => (
          <CategoryButton
            key={category.name}
            category={category}
            selected={selectedCategories.includes(category.name)}
            onClick={() => toggleCategory(category.name)}
          />
        ))}
      </div> */}
      <div className="hidden md:block">
        <h1 className="text-2xl font-bold mb-4">Filter</h1>
        <div className="md:flex space-x-4 mb-4">
          <Autocomplete
            multiple
            id="checkboxes-tags-search"
            options={categories}
            disableCloseOnSelect
            getOptionLabel={(option) => option.name}
            onChange={handleSearchBoxChange}
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
                label="Categories"
                placeholder="Select Category"
              />
            )}
          />
        </div>
      </div>

      {/* Tags for selected categories */}
      <div className="flex flex-wrap space-x-2 mb-4 md:hidden">
        {selectedCategories.map((category) => (
          <span
            key={category}
            className="inline-flex items-center bg-gray-200 text-gray-800 text-sm font-medium mr-2 px-3 py-0.5 rounded"
          >
            {category}
            <button
              onClick={() => removeCategory(category)}
              className="ml-2 bg-gray-400 text-white rounded-full w-4 h-4 flex items-center justify-center"
            >
              &times;
            </button>
          </span>
        ))}
      </div>

      {/* Mobile Filter Button */}
      <button
        className="fixed bottom-4 z-[9999] left-4 bg-gray-800 text-white rounded-full p-4 md:hidden"
        onClick={() => setIsModalOpen(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h10a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zm0 6a1 1 0 011-1h7a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z"
          />
        </svg>
      </button>

      {/* Mobile Filter Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Filter Categories</h2>
              <button
                className="text-gray-600 hover:text-gray-800"
                onClick={() => setIsModalOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 mb-4">
              {categories.map((category) => (
                <CategoryButton
                  key={category.name}
                  category={category}
                  selected={selectedCategories.includes(category.name)}
                  onClick={() => toggleCategory(category.name)}
                />
              ))}
            </div>
            <div className="flex space-x-4">
              <button
                onClick={selectAll}
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
              >
                Select All
              </button>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterComponent;
