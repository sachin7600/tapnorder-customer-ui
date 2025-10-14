'use client'

import React, {useEffect, useState} from 'react';
import TopBar from "@/components/dashboard-ui/TopBar";
import SearchBar from "@/components/dashboard-ui/SearchBar";
import MenuAccordion from "@/components/dashboard-ui/MenuAccordion";
import {useGetCategoryWithMenuQuery} from "@/lib/api/MenuItemApi";
import {useDispatch} from "react-redux";
import {setCategoryNameData, setMenuCategoryData, setSelectedCategory} from "@/lib/redux/slices/menuCategorySlice";
import Loader from "@/components/common-ui/Loader";

function Page() {
  const {data: categoryName} = useGetCategoryWithMenuQuery({outletId: 125});
  const {data: categoryData, isLoading} = useGetCategoryWithMenuQuery({outletId: 125});
  const [searchText,setSearchText] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if(categoryData?.length > 0) {
      dispatch(setCategoryNameData(categoryName));
      dispatch(setMenuCategoryData(categoryData))
      dispatch(setSelectedCategory(categoryName[0]?.categoryId))
    }
  },[categoryData])

  return (
    <div className={'bg-gray-200 min-h-full'}>
      {
        isLoading ? <Loader/> : (
          <>
            <TopBar/>
            <SearchBar setSearchText={setSearchText} searchText={searchText}/>
            <MenuAccordion searchText={searchText}/>
          </>
        )
      }
    </div>
  );
}

export default Page;
