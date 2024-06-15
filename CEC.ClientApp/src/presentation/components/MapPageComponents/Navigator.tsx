import React, { useState } from 'react';
interface NavigatorProps {
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
}
const Navigator: React.FC<NavigatorProps> = ({
  selectedCategories,
  setSelectedCategories,
}) => {
  return <div></div>;
};
export default Navigator;
