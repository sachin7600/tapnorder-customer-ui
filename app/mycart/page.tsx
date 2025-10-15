'use client'

import React, {useState} from 'react';
import TopBar from "@/components/dashboard-ui/TopBar";
import Loader from "@/components/common-ui/Loader";
import CartSummaryCard from "@/components/mycart/CartSummaryCard";
import OrderSummaryCard from "@/components/mycart/OrderSummaryCard";
import RestaurantInfoCard from "@/components/mycart/RestaurantInfoCard";

function Page() {
    const [isLoading, setIsLoading] = useState(false);
    return (
        <div className={'bg-gray-200 min-h-[100vh]'}>
            {
                isLoading ? <Loader/> : (
                    <>
                        <TopBar title={'My Cart'}/>
                        <RestaurantInfoCard/>
                        <CartSummaryCard/>
                        <OrderSummaryCard/>
                    </>
                )
            }
        </div>
    );
}

export default Page;