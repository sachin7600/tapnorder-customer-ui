import Image from "next/image";
import { MapPin } from "lucide-react";
import {useRouter, useSearchParams} from "next/navigation";
import {useGetOutletDetailsByIdQuery} from "@/lib/api/MenuItemApi";
import {createImageBlob} from "@/lib/createImageBlob";

export default function RestaurantInfoCard() {
  const searchParams = useSearchParams();
  const outletId = searchParams.get("outletId");
  const tableId = searchParams.get("tableId");
  const {data, isLoading} = useGetOutletDetailsByIdQuery({outletId, tableId});

    return (
        <div className="p-3 flex items-center gap-3 w-full mx-auto px-4 border-b-2 border-card">
            {/* Logo */}
            <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-500 flex-shrink-0">
                <Image
                    src={createImageBlob(data?.restaurantLogo?.url)}
                    alt="Cafe Haven"
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                />
            </div>

            {/* Text Info */}
            <div className="flex flex-col w-full">
                <h3 className="text-md font-bold text-gray-800 w-[70vw] truncate">{data?.restaurantName}</h3>
                <p className="text-sm font-semibold text-gray-600 flex items-center gap-1 mt-0.5">
                    <MapPin size={13} className="text-primary" />
                    <span className={'line-clamp-1 truncate w-[70vw]'}>{data?.outlet?.address}</span>
                </p>
            </div>
        </div>
    );
}
