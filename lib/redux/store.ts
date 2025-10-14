import { configureStore } from '@reduxjs/toolkit';
import MenuItemApi from "@/lib/api/MenuItemApi";
import menuCategorySlice from "@/lib/redux/slices/menuCategorySlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      menuCategory: menuCategorySlice,
      [MenuItemApi.reducerPath]: MenuItemApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(MenuItemApi.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
