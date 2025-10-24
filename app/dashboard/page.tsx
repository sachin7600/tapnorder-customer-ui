'use client'

import React, {useEffect, useState} from 'react';
import TopBar from "@/components/dashboard-ui/TopBar";
import SearchBar from "@/components/dashboard-ui/SearchBar";
import MenuAccordion from "@/components/dashboard-ui/MenuAccordion";
import {useAddMenuItemsInCartMutation, useGetCategoryWithMenuQuery} from "@/lib/api/MenuItemApi";
import {useDispatch} from "react-redux";
import {setCategoryNameData, setMenuCategoryData} from "@/lib/redux/slices/menuCategorySlice";
import Loader from "@/components/common-ui/Loader";
import {useSearchParams} from "next/navigation";
import { motion } from "motion/react";
import {useGetExistingCartIdQuery} from "@/lib/api/CustomerApi";
import Image from "next/image";
import {useUser} from "@/components/context/AuthContext";

function Page() {
  const searchParams = useSearchParams();
  const outletId = searchParams.get('outletId');
  const {data: categoryName, isLoading: categoryNameLoader} = useGetCategoryWithMenuQuery({outletId});
  const {data: categoryData, isLoading: categoryMenuLoader} = useGetCategoryWithMenuQuery({outletId});
  const dispatch = useDispatch();
  const [addMenuItemsInCart] = useAddMenuItemsInCartMutation();
  const {user} = useUser();
  const {
    data: cartData,
    isLoading: cartLoader,
    refetch: refetchCart
  } = useGetExistingCartIdQuery({userId: user?.id}, {skip: !user?.id});
  const tableId = searchParams.get("tableId");
  const [localCart, setLocalCart] = useState<any[]>([]);

  useEffect(() => {
    if(categoryData?.length > 0) {
      dispatch(setCategoryNameData(categoryName));
      dispatch(setMenuCategoryData(categoryData))
    }
  },[categoryData])

  const handleClearCart = async () => {
    try {
      const cartPayload = {
        cartId: cartData?.cartId || 0,
        userId: user.id,
        outletId: parseInt(outletId),
        tableId: parseInt(tableId),
        items: [],
      };

      await addMenuItemsInCart(cartPayload).unwrap();
      setLocalCart([]);
      refetchCart();
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  return (
    <div className={'bg-gray-200 min-h-[100vh]'}>
      {
        (categoryNameLoader || categoryNameLoader) ? (
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
              <MenuAccordion handleClearCart={handleClearCart} setLocalCart={setLocalCart} localCart={localCart} />
            </motion.div>
          </>
        )
      }
    </div>
  );
}

export default Page;
