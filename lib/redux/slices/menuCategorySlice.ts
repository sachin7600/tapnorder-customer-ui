import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  categoryMenuList: [],
  categoryNameList: [],
  foodType: 'Both',
  selectedCategory: null,
}

const menuCategorySlice = createSlice({
  name: "menuCategory",
  initialState,
  reducers: {
    setMenuCategoryData: (state, action) => {
      const data = action.payload;
      state.categoryMenuList = data;
    },
    setSelectedCategory: (state,action) =>{
      state.selectedCategory = action.payload;
    },
    setFoodType: (state,action)=> {
      state.foodType = action.payload;
    },
    setCategoryNameData: (state, action) => {
      state.categoryNameList = action.payload;
    }
  }
})

export const {setMenuCategoryData, setSelectedCategory, setFoodType, setCategoryNameData} = menuCategorySlice.actions;
export default menuCategorySlice.reducer;
