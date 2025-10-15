'use client'

import React, {useEffect, useState} from 'react';
import TopBar from "@/components/dashboard-ui/TopBar";
import SearchBar from "@/components/dashboard-ui/SearchBar";
import MenuAccordion from "@/components/dashboard-ui/MenuAccordion";
import {useGetCategoryWithMenuQuery} from "@/lib/api/MenuItemApi";
import {useDispatch} from "react-redux";
import {setCategoryNameData, setMenuCategoryData} from "@/lib/redux/slices/menuCategorySlice";
import Loader from "@/components/common-ui/Loader";
import {useSearchParams} from "next/navigation";

function Page() {
  const searchParams = useSearchParams();
  const outletId = searchParams.get('outletId');
  const tableId = searchParams.get('tableId');
  const {data: categoryName} = useGetCategoryWithMenuQuery({outletId});
  const {data: categoryData, isLoading} = useGetCategoryWithMenuQuery({outletId});
  const dispatch = useDispatch();

  useEffect(() => {
    if(categoryData?.length > 0) {
      dispatch(setCategoryNameData(categoryName));
      dispatch(setMenuCategoryData(categoryData))
    }
  },[categoryData])

  return (
    <div className={'bg-gray-200 min-h-[100vh]'}>
      {
        isLoading ? <Loader/> : (
          <>
            <TopBar outletId={outletId} tableId={tableId}/>
            <SearchBar />
            <MenuAccordion />
          </>
        )
      }
    </div>
  );
}

export default Page;
