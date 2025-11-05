'use client'

import React, {useEffect, useState} from 'react';
import TopBar from "@/components/dashboard-ui/TopBar";
import SearchBar from "@/components/dashboard-ui/SearchBar";
import MenuAccordion from "@/components/dashboard-ui/MenuAccordion";
import {useAddMenuItemsInCartMutation, useGetCategoryWithMenuQuery} from "@/lib/api/MenuItemApi";
import {useDispatch, useSelector} from "react-redux";
import {setCategoryNameData, setMenuCategoryData, setOrderNote} from "@/lib/redux/slices/menuCategorySlice";
import {useSearchParams} from "next/navigation";
import { motion } from "motion/react";
import {useGetExistingCartIdQuery} from "@/lib/api/CustomerApi";
import Image from "next/image";
import {useUser} from "@/components/context/AuthContext";
import {setAuthToken} from "@/lib/apiServices";
import {FetchBaseQueryError} from "@reduxjs/toolkit/query";
import {RootState} from "@/lib/redux/store";
import {Loader2} from "lucide-react";

function Page() {
  const searchParams = useSearchParams();
  const {foodType, selectedCategory, searchText} = useSelector((state: RootState)=> state.menuCategory);
  const [outletId, setOutletId] = useState<string | null>(null);
  const [tableId, setTableId] = useState<string | null>(null);
  const {data: categoryData, isLoading: categoryMenuLoader, isFetching} = useGetCategoryWithMenuQuery(
    { outletId, search: searchText, categoryId: selectedCategory, foodType },
    { refetchOnMountOrArgChange: true , skip: !outletId }
  );
  const dispatch = useDispatch();
  const [addMenuItemsInCart] = useAddMenuItemsInCartMutation();
  const {user, setUser} = useUser();
  const {
    data: cartData,
    refetch: refetchCart,
    error,
    isError,
  } = useGetExistingCartIdQuery({userId: user?.id}, {skip: !user?.id});
  const [localCart, setLocalCart] = useState<any[]>([]);

  useEffect(() => {
    const storedOutlet = localStorage.getItem('outletId');
    const storedTable = localStorage.getItem('tableId');

    setOutletId(storedOutlet ?? searchParams.get('outletId'));
    setTableId(storedTable ?? searchParams.get('tableId'));
  }, [searchParams]);

  useEffect(() => {
    if (isError && error) {
      const err = error as FetchBaseQueryError;

      if (err?.status === 401) {
        localStorage.clear();
        setUser(null);
        setAuthToken(null);
      }
    }
  }, [isError, error, setUser]);

  useEffect(() => {
    if (categoryData?.categoryList?.length > 0) {
      dispatch(setCategoryNameData(categoryData?.categoryList));
      dispatch(setMenuCategoryData(categoryData?.categoryWithMenuItems))
    }
  },[categoryData])

  const handleClearCart = async () => {
    if (!outletId || !tableId) return;
    try {
      const cartPayload = {
        cartId: cartData?.cartId || 0,
        userId: user.id,
        outletId: parseInt(outletId),
        tableId: parseInt(tableId),
        items: [],
      };

      await addMenuItemsInCart(cartPayload).unwrap();
      dispatch(setOrderNote(''));
      setLocalCart([]);
      refetchCart();
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  return (
    <div className={'bg-gray-200 min-h-[100vh]'}>
      {
        categoryMenuLoader ? (
          <div className={'w-full animate-pulse'}>
            <Image
              src={'/shimmer/dashboard-shimmer.svg'}
              alt={'shimmer'}
              width={'100'}
              height={'100'}
              priority
              className='w-full h-full'
            />
          </div>
          ) : (
          <>
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.4 }}>
            <TopBar handleClearCart={handleClearCart}/>
          </motion.div>

            <SearchBar />

            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {
                isFetching ? (
                  <div className={'flex justify-center items-center h-[50vh] animate-spin w-full'}>
                    <Loader2 color={'teal'}/>
                  </div>
                  ) : (
                  <MenuAccordion handleClearCart={handleClearCart} setLocalCart={setLocalCart} localCart={localCart} />
                )
              }
            </motion.div>
          </>
        )
      }
    </div>
  );
}

export default Page;
