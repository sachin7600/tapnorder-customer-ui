'use client'

import React from 'react';
import {ArrowLeft, Clock4, MapPin, MoveLeft, UserRound} from "lucide-react";
import Image from "next/image";
import {useGetOutletDetailsByIdQuery} from "@/lib/api/MenuItemApi";
import {createImageBlob} from "@/lib/createImageBlob";
import {useSearchParams} from "next/navigation";

interface Props {
    title?: string;
}

function TopBar({title = ''}: Props) {
    const searchParams = useSearchParams();
    const outletId = searchParams.get("outletId");
    const tableId = searchParams.get("tableId");
    const {data, isLoading} = useGetOutletDetailsByIdQuery({outletId, tableId});

    return (
        <div className={'h-24 w-full rounded-b-2xl bg-white shadow-md flex items-center justify-between px-4'}>
            {
                title ? (
                    <div className={'flex items-center justify-center gap-2'}>
                        <span className={'text-foreground'}>
                            <ArrowLeft size={28}/>
                        </span>
                        <span className={'text-xl font-bold pb-0.5 text-foreground'}>{title}</span>
                    </div>
                ) : (
                    <div className={'flex items-center h-full w-full'}>
                        <Image
                            src={createImageBlob(data?.restaurantLogo?.url)}
                            alt={"overlay image"}
                            width={60}
                            height={60}
                            priority
                            className="rounded-full shadow-md shadow-gray-300"
                        />

                        <div className={'flex flex-col pl-1 w-full'}>
                            <div className={'flex w-full justify-between gap-2'}>
            <span className={'flex gap-1 justify-start items-center'}>
              <span>
                <MapPin className="text-primary h-5 w-5"/>
              </span>
              <p className={'font-semibold text-[15px] text-secondary-foreground line-clamp-1'}>{data?.outlet?.address}</p>
            </span>
                                <span>
              <UserRound className={'bg-card rounded-full p-1.5 text-primary'} size={28}/>
            </span>
                            </div>

                            <span className={'flex w-full justify-between gap-2'}>
            <span className={'flex gap-1 items-center justify-start'}>
                    <span><Clock4 className="text-primary h-5 w-5 p-0.5"/></span>
                    <p className={'font-semibold text-[15px] text-secondary-foreground'}>{data?.outlet?.openTime} - {data?.outlet?.closeTime}</p>
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
        </div>
    );
}

export default TopBar;
