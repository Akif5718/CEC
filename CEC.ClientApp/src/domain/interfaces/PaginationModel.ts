interface IPaginationModel {
  searchModel: {
    columnFilter: {
      columnName: string;
      columnValue: string[];
      columnValueType: string;
    }[];
    valueSearch: {
      searchValueType: string;
      searchValue: string;
      searchColumnList: string[];
    };
  };
  page: number;
  pageSize: number;
}
