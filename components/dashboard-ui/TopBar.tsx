'use client'

import React, {useCallback, useState} from 'react';
import {ArrowLeft, ChevronDown, Clock4, MapPin, MoveLeft, UserRound} from "lucide-react";
import Image from "next/image";
import {useGetOutletDetailsByIdQuery} from "@/lib/api/MenuItemApi";
import {createImageBlob} from "@/lib/createImageBlob";
import {useRouter, useSearchParams} from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {setFoodType} from "@/lib/redux/slices/menuCategorySlice";
import LogoutDialog from "@/components/dashboard-ui/LogoutDialog";
import {useUser} from "@/components/context/AuthContext";

interface Props {
    title?: string;
  handleClearCart?: ()=> void
}

const filter = ['Past order','Sign out'];

function TopBar({title = '', handleClearCart}: Props) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const {logout, user} = useUser();
    const outletId = searchParams.get("outletId");
    const tableId = searchParams.get("tableId");
    const {data, isLoading} = useGetOutletDetailsByIdQuery({outletId, tableId});
    const [show, setShow] = useState(false);

  console.log({
    data
  })

    const handleNavigate = useCallback((value) => {
      if(value === 'Past order') {
        router.push(`/pastorder?outletId=${outletId}&tableId=${tableId}`)
      } else {
          setShow(true);
      }
    },[])

  const handleConfirmSignOut = ()=> {
    handleClearCart();
    logout();
  }

    return (
        <div className={`${title ? 'h-16' : 'h-24'} w-full rounded-b-2xl bg-white shadow-md flex items-center justify-between px-4`}>
            {
                title ? (
                    <div className={'flex items-center justify-center gap-2'}>
                        <span className={'text-foreground'} onClick={() => router.back()}>
                            <ArrowLeft size={28}/>
                        </span>
                        <span className={'text-xl font-bold pb-0.5 text-foreground'}>{title}</span>
                    </div>
                ) : (
                    <div className={'flex items-center h-full w-full'}>
                        <div className={'flex items-center justify-center h-17 w-20 relative'}>
                          <Image
                            src={createImageBlob(data?.restaurantLogo?.url)}
                            alt={"overlay image"}
                            fill
                            priority
                            className="rounded-full shadow-md shadow-gray-300 absolute object-cover"
                            fetchPriority={'high'}
                          />
                        </div>

                        <div className={'flex flex-col pl-1 w-full'}>
                          <div className={'flex flex-col pl-1 w-full'}>
                            <div className={'flex w-full justify-between gap-2'}>
                              <span className={'flex gap-1 justify-start items-center'}>
                                <span>
                                  <MapPin className="text-primary h-5 w-5"/>
                                </span>
                                <p className={'font-semibold text-[15px] text-secondary-foreground line-clamp-1 tracking-wider'}>{data?.outlet?.name} - {data?.outlet?.address}</p>
                              </span>
                              <div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className={'bg-card rounded-full text-primary h-8 w-8'}> <UserRound  size={20}/> </Button>
                                  </DropdownMenuTrigger>
                                  {user?.id && (<DropdownMenuContent className="mr-2 w-16 p-0">
                                    {
                                      filter.map((item) => (
                                        <div key={item}
                                             className={'flex items-center justify-start font-semibold px-2 border-b-1'}
                                             onClick={() => handleNavigate(item)}>
                                          <DropdownMenuItem>{item}</DropdownMenuItem>
                                        </div>
                                      ))
                                    }
                                  </DropdownMenuContent>)
                                  }
                                </DropdownMenu>
                              </div>
                            </div>
                          </div>

                          <span className={'flex w-full justify-between gap-2'}>
                            <span className={'flex gap-1 items-center justify-start pl-1'}>
                                    <span><Clock4 className="text-primary h-5 w-5 p-0.5"/></span>
                                    <p className={'font-semibold text-[15px] text-secondary-foreground tracking-wider'}>{data?.outlet?.openTime?.slice(0,-3)} AM - {data?.outlet?.closeTime?.slice(0,-3)} PM</p>
                            </span>
                            <span
                                className={'rounded-2xl border-1 px-2 border-primary font-semibold flex justify-center items-center py-1 gap-1 truncate mt-2'}>
                                  <Image src={'/Icons/table-bar-rounded.svg'} width={16} height={16} alt={'table'}/>
                                    <span className={'text-sm font-bold text-[12px] text-teal-700'}>
                                      Table {data?.tableNumber}
                                    </span>
                            </span>
                          </span>
                        </div>
                    </div>
                )
            }
          {
            show && (
              <LogoutDialog
                open={show}
                onOpenChange={()=> setShow(false)}
                onConfirm={handleConfirmSignOut}
               />
            )
          }
        </div>
    );
}

export default TopBar;
