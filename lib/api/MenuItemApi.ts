import { apiService as api } from '@/lib/apiServices';

export const menuItemTags = ['menu_item_list', 'menu_item_details','menu_category_list_all'] as const;

const MenuItemApi = api
  .enhanceEndpoints({
    addTagTypes: menuItemTags
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getMenuItemList: build.query<OutletDetails[], any>({
        query: ({ page, pageSize, outletId, restaurantId, search }) => {
          const searchParam = search ? search : '';
          return {
            url: `/api/Menu/list?Search=${searchParam}&PageNumber=${page}&
						PageSize=${pageSize}&OutletId=${outletId}&RestaurantId=${restaurantId}`
          };
        },
        providesTags: ['menu_item_list'],
      }),
      getMenuItemById: build.query<any, any>({
        query: ({ menuId }) => {
          return {
            url: `/api/Menu/read/${menuId}`
          };
        },
        providesTags: ['menu_item_details'],
        transformResponse: (response: GetOutletByIdApiResponse) => {
          if (response?.succeeded) {
            return response?.data;
          }
        }
      }),
      updateMenuItem: build.mutation<any, any>({
        query: ({ id, body }) => {
          return {
            url: `/api/Menu/update/${id}`,
            method: 'PUT',
            body: body
          };
        },
        invalidatesTags: ['menu_item_details']
      }),
      deleteMenuItem: build.mutation<any, any>({
        query: (id) => {
          return {
            url: `/api/Menu/delete/${id}`,
            method: 'DELETE'
          };
        },
        invalidatesTags: ['menu_item_list', 'menu_item_details']
      }),
      getMenuItemByCategoryId: build.query<any, any>({
        query: ({ categoryId }) => {
          return {
            url: `/api/Menu/list/${categoryId}`
          };
        },
        transformResponse: (response: GetOutletByIdApiResponse) => {
          if (response?.succeeded) {
            return response?.data;
          }
        }
      }),
      getCategoryWithMenu: build.query<any, any>({
        query: ({ outletId }) => {
          return {
            url: `/api/Menu/list/categories-with-menuItems?outletId=${outletId}`
          };
        },
        transformResponse: (response: GetOutletByIdApiResponse) => {
          if (response?.succeeded) {
            return response?.data;
          }
        },
        providesTags: ['menu_item_list']
      }),
      updateMenuItemStatus: build.mutation({
        query: ({ menuItemId, isActive }) => {
          return {
            method: 'PUT',
            url: `/api/Menu/update/toggle?menuItemId=${menuItemId}&isActive=${isActive}`
          };
        },
        invalidatesTags: ['menu_item_list']
      }),
      getOutletDetailsById: build.query<any, any>({
        query: ({ outletId, tableId }) => ({
          url: `/api/Restaurant/by-outlet/${outletId}?tableId=${tableId}`
        }),
        transformResponse: (response: any) => {
          if (response?.succeeded) {
            return response?.data;
          }
        }
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
        invalidatesTags: ['menu_item_list']
      }),
    }),
    overrideExisting: false
  });

export default MenuItemApi;

export type RestaurantDetails = {
  name: string;
  legalName: string;
  registrationType: string;
  registrationNumber: string;
  logoImageId: number;
  panNumber: string;
  gstNumber: string;
  trademarkCertId: number;
  isCompleted: boolean;
  isActive: boolean;
  foodType: string;
};

export type OutletDetails = {
  id: number;
  restaurantId: number;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  contactNumber: string;
  email: string;
  allowCustomerOrder: boolean;
  seatingCapacity: number;
  openTime: string;
  closeTime: string;
  isActive: boolean;
  foodType: string;
  restaurant: RestaurantDetails;
};

export type GetOutletListApiResponseWrapper = {
  succeeded: boolean;
  message: string;
  data: OutletDetails[];
};

export type GetOutletByIdApiResponse = {
  succeeded: boolean;
  message: string;
  errors: string | null;
  data: OutletDetails;
};

export const {
  useGetMenuItemListQuery,
  useGetMenuItemByIdQuery,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation,
  useGetCategoryWithMenuQuery,
  useUpdateMenuItemStatusMutation,
  useGetOutletDetailsByIdQuery,
  useAddMenuItemsInCartMutation
} = MenuItemApi;

export type MenuItemApi = {
  [MenuItemApi.reducerPath]: ReturnType<typeof MenuItemApi.reducer>;
};
