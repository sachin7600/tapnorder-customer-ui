import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plus, Minus, NotebookPen } from "lucide-react";

export default function CartSummaryCard() {
    const items = [
        {
            id: 1,
            name: "Margarita Pizza",
            tags: ["Spicy", "Creamy"],
            price: 160,
            qty: 2,
            img: "/images/pizza.jpg",
        },
        {
            id: 2,
            name: "Paneer Chilli",
            tags: ["Spicy"],
            price: 130,
            qty: 1,
            img: "/images/paneer.jpg",
        },
        {
            id: 3,
            name: "Chicken 65",
            tags: ["Spicy"],
            price: 140,
            qty: 1,
            img: "/images/chicken.jpg",
        },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-md p-4 w-full max-w-sm mx-auto">
            {/* Header */}
            <h2 className="text-lg font-bold text-gray-800 mb-3">
                Total Item ({items.length})
            </h2>

            {/* Items */}
            <div className="flex flex-col gap-3">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between border border-gray-200 rounded-xl p-2 shadow-sm"
                    >
                        {/* Image + Details */}
                        <div className="flex items-center gap-3">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                                <Image
                                    src={item.img}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-col">
                <span className="font-semibold text-gray-800 text-sm">
                  {item.name}
                </span>
                                <span className="text-xs text-gray-500">
                  {item.tags.join(" • ")}
                </span>
                                <span className="text-sm font-bold text-gray-700">
                  ₹{item.price}
                </span>
                            </div>
                        </div>

                        {/* Quantity + Note */}
                        <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center gap-2 bg-gray-100 rounded-md px-2 py-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-1 h-5 w-5 text-gray-700"
                                >
                                    <Minus size={14} />
                                </Button>
                                <span className="text-sm font-semibold">{item.qty}</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-1 h-5 w-5 text-gray-700"
                                >
                                    <Plus size={14} />
                                </Button>
                            </div>
                            <button className="text-[12px] flex items-center gap-1 text-primary font-semibold hover:underline">
                                <NotebookPen size={12} /> Cooking Note
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add more item */}
            <button className="w-full mt-3 border border-dashed border-gray-300 py-2 text-sm font-semibold text-gray-600 rounded-lg hover:bg-gray-50 transition">
                + Add More Item
            </button>

            {/* Whole order note */}
            <div className="mt-3">
                <label
                    htmlFor="note"
                    className="text-sm font-semibold text-gray-800 mb-1 block"
                >
                    Order cooking Note
                </label>
                <input
                    type="text"
                    id="note"
                    placeholder="Whole Order Cooking Note..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>
        </div>
    );
}
