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
import {useSelector} from "react-redux";
import {RootState} from "@/lib/redux/store";

function MenuAccordion({searchText}) {
  const [drawerOpen,setDrawerOpen] = useState(false);
  const {categoryMenuList, foodType} = useSelector((state: RootState)=> state.menuCategory);
  const [addMenuItemsInCart] = useAddMenuItemsInCartMutation();

  const filteredMenuItems = useMemo(() => {
    return categoryMenuList?.map((category) => {
      const filteredItems = category?.menuItems?.filter(
        (item: any) =>
          item?.name?.toLowerCase()?.includes(searchText.toLowerCase()) &&
          (foodType === 'Both' || (foodType === 'Veg' ? item?.isVeg : !item?.isVeg))
          && item?.isActive
      );
      return { ...category, menuItems: filteredItems };
    })
      .filter((category) => category.menuItems && category.menuItems.length > 0);
  }, [categoryMenuList, foodType, searchText]);

  return (
    <div>
      {
        filteredMenuItems?.map((item: any)=> (
          <Accordion type="multiple" key={item.categoryId} className={'mb-4 bg-white px-2'} defaultValue={[item.categoryId]}>
            <AccordionItem value={item.categoryId}>
              <AccordionTrigger className={'text-md'}>
                <span className={'font-semibold flex gap-1'}>
                  {item?.categoryName}
                  <span>({item?.menuItems?.length})</span>
                </span>
              </AccordionTrigger>
              {
                item?.menuItems?.map((data: any, index: number)=> (
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
                      <Button className={'h-6 rounded-sm ml-2.5 bg-white text-primary border w-1/6'}>
                        <span className={'flex items-center justify-center'}>
                          <Plus size={1}/>
                          <span onClick={()=> setDrawerOpen(true)}>
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
                ))
              }
            </AccordionItem>
          </Accordion>
        ))
      }

      <CustomDrawer open={drawerOpen} setOpen={setDrawerOpen}/>
    </div>
  );
}

export default MenuAccordion;
