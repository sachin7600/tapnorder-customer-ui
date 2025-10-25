'use client'

import React, {useEffect, useState, useMemo, useCallback} from "react";
import _ from "lodash";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {AccordionHeader} from "@radix-ui/react-accordion";
import {Plus, X} from "lucide-react";
import ReadMoreText from "@/components/common-ui/ReadMoreText";
import {useAddMenuItemsInCartMutation} from "@/lib/api/MenuItemApi";
import {createImageBlob} from "@/lib/createImageBlob";
import CustomerDrawer from "@/components/common-ui/CustomerDrawer";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/lib/redux/store";
import {useGetExistingCartIdQuery} from "@/lib/api/CustomerApi";
import {useUser} from "@/components/context/AuthContext";
import {useRouter, useSearchParams} from "next/navigation";
import {toast} from "sonner";
import CustomButton from "@/components/common-ui/CustomButton";
import {AnimatePresence, motion} from 'motion/react';
import CustomDialog from "@/components/dashboard-ui/CustomDialog";
import NoItemPresent from "@/components/common-ui/NoItemPresent";

function MenuAccordion({setLocalCart,localCart,handleClearCart}) {
    const {user} = useUser();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const {
        categoryMenuList,
        foodType,
        searchText,
        selectedCategory
    } = useSelector((state: RootState) => state.menuCategory);
    const [addMenuItemsInCart] = useAddMenuItemsInCartMutation();
    const {
        data: cartData,
        isLoading: cartLoader,
        refetch: refetchCart
    } = useGetExistingCartIdQuery({userId: user?.id}, {skip: !user?.id});
    const searchParams = useSearchParams();
    const outletId = searchParams.get("outletId");
    const tableId = searchParams.get("tableId");
    const router = useRouter();
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (cartData?.items) {
            setLocalCart(cartData.items);
        }
    }, [cartData]);

    const getCartItem = (itemId: number) => {
        return localCart?.find((cartItem: { itemId: number }) => cartItem?.itemId === itemId);
    };

    const getTotalCartCount = () => {
        return localCart?.reduce((total: number, item: any) => total + item.quantity, 0) || 0;
    };

    const handleConfirmClearCart = ()=> {
      handleClearCart();
      setShow(false);
    }

  const updateCartOnServer = async (updatedItems: any[]) => {
    const cartPayload = {
      cartId: cartData?.cartId || 0,
      userId: user.id,
      outletId: parseInt(outletId),
      tableId: parseInt(tableId),
      items: updatedItems,
    };

    try {
      await addMenuItemsInCart(cartPayload).unwrap();
      refetchCart();
      setLocalCart(updatedItems);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update cart", {
        position: "top-center",
      });
    }
  };

  const handleAddToCart = (itemId: number) => {
    if (!user) {
      setDrawerOpen(true);
      return;
    }

    const updatedCart = [...localCart];
    const existingItem = updatedCart.find((item) => item.itemId === itemId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      updatedCart.push({ itemId, quantity: 1 });
    }

    updateCartOnServer(updatedCart);
  };

  const handleUpdateQuantity = (
    itemId: number,
    currentQuantity: number,
    operation: 'increase' | 'decrease'
  ) => {
    if (!user) {
      setDrawerOpen(true);
      return;
    }

    const newQuantity = operation === 'increase' ? currentQuantity + 1 : currentQuantity - 1;
    if (newQuantity < 0) return;

    const updatedCart = localCart
      .map((item: any) =>
        item.itemId === itemId ? { ...item, quantity: newQuantity } : item
      )
      .filter((item: any) => item.quantity > 0);

    updateCartOnServer(updatedCart);
  };

  const filteredMenuItems = useMemo(() => {
        return categoryMenuList?.map((category: any) => {
            const filteredItems = category?.menuItems?.filter(
                (item: any) =>
                    item?.name?.toLowerCase()?.includes(searchText.toLowerCase()) &&
                    (foodType === 'Both' || (foodType === 'Veg' ? item?.isVeg : !item?.isVeg))
                    && item?.isActive
            );
            return {...category, menuItems: filteredItems};
        })
            .filter((category) => (category.menuItems && category.menuItems.length > 0) && (category.categoryId === selectedCategory || selectedCategory === null));
    }, [categoryMenuList, foodType, searchText, selectedCategory]);

    return (
        <div className={`${getTotalCartCount() > 0 ? "pb-20" : ""}`}>
            {
                filteredMenuItems.length > 0 ? (
                    <>
                        {
                            filteredMenuItems?.map((item: any) => (
                                <Accordion type="multiple" key={item.categoryId} className={'mb-4 bg-white px-2'}
                                           defaultValue={[item.categoryId]}>
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
                                            item?.menuItems?.map((data: any, index: number) => {
                                                return (
                                                    <div className={'w-full flex flex-col gap-2'} key={data?.id}>
                                                        <AccordionContent
                                                            className={'py-2 flex gap-3 border-black/20 mb-2 relative'}>
                                                            <div className="relative h-[80px] w-[90px]">
                                                              <Image
                                                                src={createImageBlob(data?.image?.url)}
                                                                alt="overlay image"
                                                                fill
                                                                priority
                                                                className="rounded-2xl object-cover"
                                                                sizes="90px"
                                                              />
                                                            </div>
                                                            <span className={'absolute -bottom-1 w-full'}>
                               <span className={'absolute -bottom-1 w-full'}>
      {(() => {
          const cartItem = getCartItem(data?.id);

          if (cartItem) {
              return (
                  <div
                      className={`flex items-center gap-2 h-6 rounded-sm bg-white text-primary border w-16 ${cartItem?.quantity < 10 ? "ml-2" : "ml-1"}`}>
                      <Button
                          variant="outline"
                          className="h-6 w-6 p-0 flex items-center justify-center border text-primary"
                          onClick={() => handleUpdateQuantity(data?.id, cartItem.quantity, 'decrease')}
                      >
                          −
                      </Button>

                      <span className="text-sm font-semibold text-gray-700 w-5 text-center">
                        {cartItem.quantity}
                      </span>

                      <Button
                          variant="outline"
                          className="h-6 w-6 p-0 flex items-center justify-center border text-primary"
                          onClick={() => handleUpdateQuantity(data?.id, cartItem.quantity, 'increase')}
                      >
                          +
                      </Button>
                  </div>
              );
          }

          return (
              <Button
                  className="h-6 rounded-sm ml-3 bg-white text-primary border w-16"
                  onClick={() => handleAddToCart(data?.id)}
              >
        <span className="flex items-center justify-center gap-1 text-sm">
          <Plus size={12}/>
          Add
        </span>
              </Button>
          );
      })()}
</span>

                            </span>
                                                            <div className={'flex flex-col justify-around w-3/4'}>
                                                                <div className={'flex flex-col gap-1 w-full'}>
                                    <span className={'flex justify-between w-full gap-2'}>
                                      <span className={'flex items-center gap-2 overflow-hidden'}>
                                        <div
                                            className={'font-bold text-[17px] text-gray-700 flex items-center gap-1 min-w-0'}>
                                          <span className={'truncate'}>
                                            {data?.name}
                                          </span>
                                          <span className={'flex-shrink-0 pt-1'}>
                                            <Image src={data?.isVeg ? "/Icons/veg.svg" : "/Icons/nonveg.svg"}
                                                   alt={'type'} width={10} height={10} priority/>
                                          </span>
                                        </div>
                                      </span>

                                      <span className={'font-bold text-gray-700 flex-shrink-0'}>
                                        ₹{data?.price}
                                      </span>
                                    </span>

                                                                    <span className={'flex gap-2 flex-wrap'}>
                                    {data?.menuTags?.map((tag: any, index: number) => (
                                        <span key={index}
                                              className={'bg-card text-primary font-semibold px-1 rounded text-[12px] whitespace-nowrap'}>
                                          {tag}
                                        </span>
                                    ))}
                                  </span>
                                                                </div>

                                                                <span
                                                                    className={'text-ring font-semibold text-[12px] w-full'}>
                          <ReadMoreText text={data?.description || ''} wordLimit={10}/>
                        </span>
                                                            </div>
                                                        </AccordionContent>
                                                        <AccordionHeader
                                                            className={'h-[0.1px] bg-card w-full'}></AccordionHeader>
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
                    <NoItemPresent title={'Nothing Matches'} description={'No menu items found for your search'} />
                )
            }

          <AnimatePresence>
            {
              getTotalCartCount() > 0 && (
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={'h-20 fixed bottom-0 transition-all duration-700 bg-gray-200 border-t-1 border-gray-300 w-full rounded-t-2xl flex items-center justify-center pr-6 z-99'}
                >
                  <div className={'flex w-full px-3 gap-2'}>
                    <CustomButton
                      count={getTotalCartCount()}
                      iconSize={32}
                      onClick={() => router.push(`/mycart?outletId=${outletId}&tableId=${tableId}`)}
                    />
                    <span className={'flex items-center justify-center'}>
            <X
              onClick={()=> setShow(true)}
              className="bg-white rounded-full p-1 shadow-2xl text-primary cursor-pointer hover:scale-110 transition-transform"
              size={22}
            />
          </span>
                  </div>
                </motion.div>
              )
            }
          </AnimatePresence>

          <CustomerDrawer open={drawerOpen} setOpen={setDrawerOpen}/>
          {
            show && (
                <CustomDialog
                  open={show}
                  onOpenChange={()=> setShow(false)}
                  onConfirm={handleConfirmClearCart}
                  title={'Remove Items'}
                  description={'Are you sure you want to remove all items?'}
                />
            )
          }
        </div>
    );
}

export default MenuAccordion;
