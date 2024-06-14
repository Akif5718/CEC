/* eslint-disable @typescript-eslint/ban-types */
import {useState} from 'react';
import { useParams } from 'react-router-dom';

type Props = {};
const data = [
  { id: 1, category: 'Category 1', content: 'Item 1 in Category 1' },
  { id: 2, category: 'Category 2', content: 'Item 1 in Category 2' },
  { id: 3, category: 'Category 3', content: 'Item 1 in Category 3' },
  { id: 4, category: 'Category 4', content: 'Item 1 in Category 4' },
  { id: 5, category: 'Category 1', content: 'Item 2 in Category 1' },
  // Add more data as needed
];

const categories = [
  { name: 'Category 1', color: 'bg-red-500' },
  { name: 'Category 2', color: 'bg-green-500' },
  { name: 'Category 3', color: 'bg-blue-500' },
  { name: 'Category 4', color: 'bg-yellow-500' },
];
const SearchPage = (props: Props) => {
  const { id } = useParams();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const resetFilters = () => {
    setSelectedCategories([]);
  };

  const selectAll = () => {
    setSelectedCategories(categories.map((category) => category.name));
  };

  const filteredData = data.filter((item) =>
    selectedCategories.includes(item.category)
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Category Filter</h1>

      <div className="flex space-x-4 mb-4">
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {categories.map((category) => (
          <div
            key={category.name}
            onClick={() => toggleCategory(category.name)}
            className={`cursor-pointer p-4 rounded-lg shadow-lg transform transition-transform ${
              selectedCategories.includes(category.name)
                ? 'scale-105'
                : 'scale-100'
            } ${category.color}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold">{category.name}</span>
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.name)}
                readOnly
                className="form-checkbox h-5 w-5 text-white"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <div
              key={item.id}
              className="p-4 border rounded shadow-sm bg-white"
            >
              {item.content}
            </div>
          ))
        ) : (
          <div className="text-gray-500">No items to display</div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
