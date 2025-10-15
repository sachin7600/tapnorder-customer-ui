import Image from "next/image";
import { MapPin } from "lucide-react";

export default function RestaurantInfoCard() {
    return (
        <div className="bg-white rounded-xl shadow-sm p-3 flex items-center gap-3 w-full max-w-sm mx-auto">
            {/* Logo */}
            <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
                <Image
                    src="/images/cafe-logo.png" // ← replace with your image path
                    alt="Cafe Haven"
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                />
            </div>

            {/* Text Info */}
            <div className="flex flex-col">
                <h3 className="text-sm font-semibold text-gray-800">CAFE HAVEN</h3>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <MapPin size={13} className="text-primary" />
                    <span>Adajan, Surat, Gujarat..</span>
                </p>
            </div>
        </div>
    );
}
