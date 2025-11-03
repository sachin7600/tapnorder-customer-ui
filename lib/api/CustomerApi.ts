import { apiService as api } from '@/lib/apiServices';

export const customerTags = ['CustomerCart', 'order_placed', 'order_list'] as const;

const CustomerApi = api
  .enhanceEndpoints({
    addTagTypes: customerTags
  })
  .injectEndpoints({
    overrideExisting: true,
    endpoints: (build) => ({
      getOutletImageById: build.query<any, any>({
        query: ({ outletId, tableId }) => ({
          url: `/api/Restaurant/by-outlet/${outletId}?tableId=${tableId}`
        }),
        transformResponse: (response: any) => {
          if (response?.succeeded) {
            return response?.data;
          }
        }
      }),
      customerLogin: build.mutation<any, any>({
        query: (customerData) => ({
          url: `/api/Customer/login`,
          method: 'POST',
          body: customerData
        }),
        invalidatesTags: ['CustomerCart']
      }),
      addMenuItemsInCart: build.mutation<any, any>({
        query: (menuItemData) => ({
          url: `/api/Cart/add-or-update`,
          method: 'POST',
          body: menuItemData
        }),
        transformResponse: (response: any) => {
          if (response?.succeeded) {
            return response;
          }
        },
        invalidatesTags: ['CustomerCart']
      }),
      getExistingCartId: build.query<any, any>({
        query: ({ userId }) => ({
          url: `/api/Cart/user/${userId}`
        }),
        transformResponse: (response: any) => {
          if (response?.succeeded) {
            return response?.data ?? [];
          }
          return response?.data;
        },
        providesTags: ['CustomerCart']
      }),
      getExistingCartIdNew: build.query<any, any>({
        query: ({ userId }) => ({
          url: `/api/Cart/get-with-recent-order/${userId}`
        }),
        transformResponse: (response: any) => {
          if (response?.succeeded) {
            return response?.data ?? [];
          }
          return response?.data;
        },
        providesTags: ['CustomerCart']
      }),
      deleteMenuItemsInCart: build.mutation<any, any>({
        query: (cartItemId) => ({
          url: `/api/Cart/delete/${cartItemId}`,
          method: 'DELETE'
        }),
        invalidatesTags: ['CustomerCart']
      }),
      postOrderPlaced: build.mutation<any, any>({
        query: (orderData) => ({
          url: `/api/Order/place-order-from-cart`,
          method: 'POST',
          body: orderData
        }),
        invalidatesTags: ['CustomerCart']
      }),
      getOrderById: build.query<any, any>({
        query: ({ orderId }) => ({
          url: `/api/Order/${orderId}`
        }),
        transformResponse: (response: any) => {
          if (response?.succeeded) {
            return response?.data;
          }
          return response?.data;
        },
        providesTags: ['order_placed']
      }),
      getOrderList: build.query<any, any>({
        query: ({ outletId }) => ({
          url: `/api/Order/list?PageNumber=1&PageSize=1000&outletId=${outletId}`
        }),
        transformResponse: (response: any) => {
          if (response?.succeeded) {
            return response?.data;
          }
          return response?.data;
        },
        providesTags: ['order_list']
      })
    }),
  });

export default CustomerApi;

export const {
  useGetOutletImageByIdQuery,
  useAddMenuItemsInCartMutation,
  useGetExistingCartIdQuery,
  useGetExistingCartIdNewQuery,
  useDeleteMenuItemsInCartMutation,
  usePostOrderPlacedMutation,
  useGetOrderByIdQuery,
  useGetOrderListQuery,
  useCustomerLoginMutation
} = CustomerApi;
