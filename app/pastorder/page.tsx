'use client'
import React, {useState} from 'react';
import Loader from "@/components/common-ui/Loader";
import TopBar from "@/components/dashboard-ui/TopBar";
import RestaurantInfoCard from "@/components/mycart/RestaurantInfoCard";
import CartSummaryCard from "@/components/mycart/CartSummaryCard";

function Page() {
    const [isLoading, setIsLoading] = useState(false);
    return (
        <div className={'bg-gray-200 min-h-[100vh]'}>
            {
                isLoading ? <Loader/> : (
                    <>
                        <TopBar title={'Past Orders'} />
                        <RestaurantInfoCard/>
                        <CartSummaryCard/>
                    </>
                )
            }
        </div>
    );
}

export default Page;