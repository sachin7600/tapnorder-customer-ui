import Image from "next/image";
import { Button } from "@/components/ui/button";
import {Plus, Minus, NotebookPen, Dot} from "lucide-react";
import {
  useAddMenuItemsInCartMutation,
  useGetExistingCartIdQuery,
  usePostOrderPlacedMutation
} from "@/lib/api/CustomerApi";
import {useUser} from "@/components/context/AuthContext";
import {useRouter, useSearchParams} from "next/navigation";
import {createImageBlob} from "@/lib/createImageBlob";
import {toast} from "sonner";

export default function CartSummaryCard({cookingRequest, setCookingRequest}) {
  const {user} = useUser();
  const searchParams = useSearchParams();
  const outletId = searchParams.get("outletId");
  const tableId = searchParams.get("tableId");
  const [addMenuItemsInCart] = useAddMenuItemsInCartMutation();
  const [postOrderPlaced] = usePostOrderPlacedMutation();
  const { data: cartData, isLoading: cartLoader, refetch: refetchCart } = useGetExistingCartIdQuery({ userId: user?.id }, { skip: !user?.id });
  const router = useRouter();

  const getTotalCartCount = () => {
    return cartData?.items?.reduce((total: number, item: any) => total + item.quantity, 0) || 0;
  };

  const handleUpdateQuantity = async (itemId: number, currentQuantity: number, operation: 'increase' | 'decrease') => {
    const newQuantity = operation === 'increase' ? currentQuantity + 1 : currentQuantity - 1;

    if (newQuantity < 0) return;

    if (newQuantity > 10) {
      toast.error("Cannot add more then 10 quantity", {
        position: "top-center",
      });
      return;
    }

    try {
      const existingItems = cartData?.items?.map((item: any) => ({
        itemId: item.itemId,
        quantity: item.quantity
      })) || [];

      const updatedItems = existingItems
        .map((item: any) => {
          if (item.itemId === itemId) {
            return {
              ...item,
              quantity: newQuantity
            };
          }
          return item;
        })
        .filter((item: any) => item.quantity > 0);

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
      console.error('Error updating cart item:', error);
    }
  };

    return (
        <div className="bg-white rounded-xl shadow-md p-4 w-full mx-auto pb-8">
            {/* Header */}
            <h2 className="text-lg font-bold text-gray-800 mb-3">
                Total Item ({cartData?.items.length})
            </h2>

            {/* Items */}
            <div className="flex flex-col gap-3">
              {cartData?.items && cartData?.items.map((item, index) => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between  rounded-xl p-2 bg-muted"
                    >
                        {/* Image + Details */}
                        <div className="flex items-center gap-3">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden border">
                                <Image
                                    src={createImageBlob(item?.image?.url)}
                                    alt={item.itemName}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-col justify-between min-h-14">
                              <span className="font-bold text-gray-800 text-md flex flex-col leading-3">
                                <span className={'flex item-center gap-1'}>
                                  {item.itemName}
                                  <span className={'flex-shrink-0 pt-[2px]'}>
                                        <Image src={item?.isVeg ? "/Icons/veg.svg" : "/Icons/nonveg.svg"}
                                        alt={'type'} width={10} height={10} priority/>
                                  </span>
                                </span>
                                <span className={'flex gap-1'}>
                                  {item?.menuTags?.map((tag: any, idx: number) => {
                                    return (
                                      <span className="text-xs text-gray-500 pb-2 italic flex items-center gap-1" key={idx}>
                                        <span className={'h-1 w-1 rounded-full bg-ring mt-1'}></span>
                                        <span>{tag}</span>
                                      </span>
                                    );
                                  })}
                                </span>

                              </span>
                              <span className="text-sm font-bold text-gray-700">
                                ₹{item.unitPrice}
                              </span>
                            </div>
                        </div>

                        {/* Quantity + Note */}
                        <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center gap-2 bg-gray-100 rounded-md px-1 py-0.5 border border-primary text-primary">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-1 h-5 w-5 text-gray-700 cursor-pointer"
                                    onClick={() => handleUpdateQuantity(item.itemId, item.quantity, 'decrease')}
                                >
                                    <Minus size={14} />
                                </Button>
                                <span className="text-sm font-semibold">{item.quantity}</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-1 h-5 w-5 text-gray-700 cursor-pointer"
                                    onClick={() => handleUpdateQuantity(item.itemId, item.quantity, 'increase')}
                                >
                                    <Plus size={14} />
                                </Button>
                            </div>
                            {/*<button className="text-[12px] flex items-center gap-1 text-primary font-semibold hover:underline border-b-1 border-dashed border-primary">*/}
                            {/*    <NotebookPen size={12} /> Cooking Note*/}
                            {/*</button>*/}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add more item */}
            <button
              onClick={()=> router.back()}
              className="w-full mt-3 border border-dashed border-gray-500 py-2 text-md font-bold text-gray-800 rounded-lg transition bg-muted"
            >
                + Add More Item
            </button>

          <div className={'h-[0.1] w-full bg-card mt-3'}>

          </div>

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
                    value={cookingRequest}
                    onChange={(e)=> setCookingRequest(e.target.value)}
                    id="note"
                    placeholder="Whole Order Cooking Note..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>
        </div>
    );
}
