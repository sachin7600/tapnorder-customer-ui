'use client'

import React, {useMemo, useState} from 'react';
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {AccordionHeader} from "@radix-ui/react-accordion";
import {Plus} from "lucide-react";
import ReadMoreText from "@/components/common-ui/ReadMoreText";
import {useAddMenuItemsInCartMutation, useGetCategoryWithMenuQuery} from "@/lib/api/MenuItemApi";
import {createImageBlob} from "@/lib/createImageBlob";
import CustomDrawer from "@/components/common-ui/CustomDrawer";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/lib/redux/store";
import {useGetExistingCartIdQuery} from "@/lib/api/CustomerApi";
import {useUser} from "@/components/context/AuthContext";
import {useSearchParams} from "next/navigation";

function MenuAccordion() {
  const {user} = useUser();
  const [drawerOpen,setDrawerOpen] = useState(false);
  const {categoryMenuList, foodType, searchText, selectedCategory} = useSelector((state: RootState)=> state.menuCategory);
  const [addMenuItemsInCart] = useAddMenuItemsInCartMutation();
  const {
    data: cartData,
    isLoading: cartLoader,
    refetch: refetchCart
  } = useGetExistingCartIdQuery({ userId: user?.id }, {skip: !user?.id});
  const searchParams = useSearchParams();
  const outletId = searchParams.get("outletId");
  const tableId = searchParams.get("tableId");

  const getCartItem = (itemId: number) => {
    return cartData?.items?.find((cartItem: { itemId: number | string | null }) => cartItem?.itemId === itemId);
  };

  const getTotalCartCount = () => {
    return cartData?.items?.reduce((total: number, item: any) => total + item.quantity, 0) || 0;
  };

  const handleAddToCart = async (itemId: number) => {
    if (!user) {
      setDrawerOpen(true);
      return;
    }

    try {
      const existingItems =
        cartData?.items?.map((item: any) => ({
          itemId: item.itemId,
          quantity: item.quantity
        })) || [];

      const existingItemIndex = existingItems.findIndex((item: any) => item.itemId === itemId);

      let updatedItems;

      if (existingItemIndex !== -1) {
        updatedItems = [...existingItems];
        updatedItems[existingItemIndex].quantity += 1;
      } else {
        updatedItems = [
          ...existingItems,
          {
            itemId: itemId,
            quantity: 1
          }
        ];
      }

      const cartPayload = {
        cartId: cartData?.cartId || 0,
        userId: user.id,
        outletId: parseInt(outletId),
        tableId: parseInt(tableId),
        items: updatedItems
      };

      await addMenuItemsInCart(cartPayload).unwrap();
      refetchCart();
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  // const handleUpdateQuantity = async (
  //   itemId: number,
  //   currentQuantity: number,
  //   operation: 'increase' | 'decrease'
  // ) => {
  //   if (!user) {
  //     handleOpenDialog();
  //     return;
  //   }
  //
  //   const newQuantity: number = operation === 'increase' ? currentQuantity + 1 : currentQuantity - 1;
  //
  //   if (newQuantity < 0) return;
  //
  //   try {
  //     // Get all existing cart items
  //     const existingItems =
  //       cartData?.items?.map((item: { itemId: number | string | null; quantity: number | string | null }) => ({
  //         itemId: item.itemId,
  //         quantity: item.quantity
  //       })) || [];
  //
  //     // Update the specific item quantity or remove if quantity becomes 0
  //     const updatedItems = existingItems
  //       .map((item: any) => {
  //         if (item.itemId === itemId) {
  //           return {
  //             ...item,
  //             quantity: newQuantity
  //           };
  //         }
  //
  //         return item;
  //       })
  //       .filter((item: { quantity: number }) => item?.quantity > 0); // Remove items with 0 quantity
  //
  //     const cartPayload = {
  //       cartId: cartData?.cartId || 0,
  //       userId: user.id,
  //       outletId: parseInt(outletId),
  //       tableId: parseInt(tableId),
  //       items: updatedItems
  //     };
  //
  //     await addMenuItemsInCart(cartPayload).unwrap();
  //     refetchCart(); // Refetch cart data to update UI
  //   } catch (error) {
  //     console.error('Error updating cart item:', error);
  //   }
  // };

  const filteredMenuItems = useMemo(() => {
    return categoryMenuList?.map((category: any) => {
      const filteredItems = category?.menuItems?.filter(
        (item: any) =>
          item?.name?.toLowerCase()?.includes(searchText.toLowerCase()) &&
          (foodType === 'Both' || (foodType === 'Veg' ? item?.isVeg : !item?.isVeg))
          && item?.isActive
      );
      return { ...category, menuItems: filteredItems };
    })
      .filter((category) => (category.menuItems && category.menuItems.length > 0) && (category.categoryId === selectedCategory || selectedCategory === null));
  }, [categoryMenuList, foodType, searchText, selectedCategory]);

  return (
    <div className={''}>
      {
        filteredMenuItems.length > 0 ? (
          <>
            {
              filteredMenuItems?.map((item: any)=> (
                <Accordion type="multiple" key={item.categoryId} className={'mb-4 bg-white px-2'} defaultValue={[item.categoryId]}>
                  <AccordionItem value={item.categoryId}>
                    <AccordionTrigger className={'text-md'}>
                <span className={'font-semibold flex gap-1 font-sans-serif flex-col'}>
                  <span className={'flex gap-1'}>
                    {item?.categoryName}
                    <span>({item?.menuItems?.length})</span>
                  </span>
                  <span className={'w-full h-[1] bg-primary'}></span>

                </span>
                    </AccordionTrigger>
                    {
                      item?.menuItems?.map((data: any, index: number)=> {
                        const cartItem = item.id;
                        return (
                          <div className={'w-full flex flex-col gap-2'} key={data?.id}>
                            <AccordionContent  className={'py-2 flex gap-3 border-black/20 mb-2 relative'}>
                              <div className="relative h-[80px] w-[90px]">
                                <Image
                                  src={createImageBlob(data?.image?.url)}
                                  alt={"overlay image"}
                                  fill
                                  priority
                                  className="rounded-2xl object-cover"
                                />
                              </div>
                              <span className={'absolute -bottom-1 w-full'}>
                               <Button className={'h-6 rounded-sm ml-3 bg-white text-primary border w-16'}>
                                <span className={'flex items-center justify-center'}>
                                  <Plus size={1}/>
                                  <span onClick={()=> handleAddToCart(data?.id)}>
                                    Add
                                  </span>
                                </span>
                              </Button>
                            </span>
                              <div className={'flex flex-col justify-around w-3/4'}>
                                <div className={'flex flex-col gap-1 w-full'}>
                                    <span className={'flex justify-between w-full gap-2'}>
                                      <span className={'flex items-center gap-2 overflow-hidden'}>
                                        <div className={'font-bold text-[17px] text-gray-700 flex items-center gap-1 min-w-0'}>
                                          <span className={'truncate'}>
                                            {data?.name}
                                          </span>
                                          <span className={'flex-shrink-0 pt-1'}>
                                            <Image src={data?.isVeg ? "/Icons/veg.svg" : "/Icons/nonveg.svg"} alt={'type'} width={10} height={10} priority />
                                          </span>
                                        </div>
                                      </span>

                                      <span className={'font-bold text-gray-700 flex-shrink-0'}>
                                        ₹{data?.price}
                                      </span>
                                    </span>

                                  <span className={'flex gap-2 flex-wrap'}>
                                    {data?.menuTags?.map((tag: any, index: number) => (
                                        <span key={index} className={'bg-card text-primary font-semibold px-1 rounded text-[12px] whitespace-nowrap'}>
                                          {tag}
                                        </span>
                                    ))}
                                  </span>
                                </div>

                                <span className={'text-ring font-semibold text-[13px] w-full'}>
                          <ReadMoreText text={data?.description || ''} wordLimit={10} />
                        </span>
                              </div>
                            </AccordionContent>
                            <AccordionHeader className={'h-[0.1px] bg-card w-full'}></AccordionHeader>
                          </div>
                        )
                      })
                    }
                  </AccordionItem>
                </Accordion>
              ))
            }
          </>
        ) : (
          <div className={'w-full flex flex-col justify-center items-center min-h-full'}>
            <div className={'relative w-40 h-40'}>
              <Image
                src={'/Icons/no-match-food.svg'}
                alt={'no match food'}
                fill
                priority
              />
            </div>

            <div className={'flex flex-col items-center gap-2'}>
              <span className={'font-bold text-2xl font-sans'}>Nothing Matches</span>
              <span className={'font-sans text-primary font-semibold'}>No menu items found for your search</span>
            </div>
          </div>
        )
      }

      <CustomDrawer open={drawerOpen} setOpen={setDrawerOpen}/>
    </div>
  );
}

export default MenuAccordion;
