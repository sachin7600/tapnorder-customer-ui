'use client'
import React, {ChangeEvent, useEffect, useMemo, useState} from 'react';
import {
  DropdownMenu, DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {ChevronDown, Search, Utensils} from "lucide-react";
import {DropdownMenuCheckboxItemProps} from "@radix-ui/react-dropdown-menu";
import {useGetCategoryWithMenuQuery} from "@/lib/api/MenuItemApi";
import Loader from "@/components/common-ui/Loader";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/lib/redux/store";
import {setFoodType, setSearchText, setSelectedCategory} from "@/lib/redux/slices/menuCategorySlice";

type Checked = DropdownMenuCheckboxItemProps["checked"]

const filter = ['Veg', 'Non-Veg', 'Both'];

function SearchBar() {
  const {foodType, categoryNameList, selectedCategory, searchText} = useSelector((state: RootState)=> state.menuCategory);
  const dispatch = useDispatch();

  const handleChange = (e: string)=> {
    dispatch(setSearchText(e))
  }

  return (
    <div className={'flex flex-col gap-1 px-2 mt-3 pb-3'}>
      <span className={'font-bold text-color-gray'}>Menu</span>
      <div className={'h-[0.1px] w-full bg-card'}></div>
      <div className={'flex gap-1.5 pt-3'}>
        <span className={'w-full'}>
          <Search className={'absolute mt-2 ml-1.5'} size={17}/>
          <input
            type="text"
            id="myInput"
            value={searchText || ""}
            onChange={(e: ChangeEvent<HTMLInputElement>)=> handleChange(e.target.value)}
            placeholder="Search within the menu..."
            className={'w-full border rounded h-8 pl-7 bg-white placeholder:text-sm pb-1 focus:outline-0 pr-2'}
          />
        </span>

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className={'h-8 rounded-sm'}>{foodType} <ChevronDown/> </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-28 mr-2">
              {
                filter.map((item) => (
                  <div key={item}>
                    <DropdownMenuCheckboxItem
                      checked={foodType === item}
                      onCheckedChange={()=> dispatch(setFoodType(item))}
                    >
                      {item}
                    </DropdownMenuCheckboxItem>
                  </div>
                ))
              }
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className={'flex px-2 mt-3 gap-10 items-center overflow-y-scroll scrollbar-hide'}>
        {
          categoryNameList?.map((item: any) => (
              <div key={item?.categoryId} className={'flex items-center justify-center flex-col'} onClick={()=> dispatch(setSelectedCategory(item?.categoryId))}>
              <span className={`bg-card rounded-full h-13 w-12 flex items-center justify-center font-bold ${selectedCategory === item?.categoryId ? "bg-primary" : ""}`}>
                <Utensils className={`text-primary h-5 ${selectedCategory === item?.categoryId ? "text-white" : ""}`}/>
              </span>
                <span className={`font-semibold text-sm font-sans-serif`}>{item?.categoryName}</span>
              </div>
          ))
        }
      </div>
    </div>
  );
}

export default SearchBar;
