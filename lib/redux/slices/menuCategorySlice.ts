import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  categoryMenuList: [],
  categoryNameList: [],
  foodType: 'Both',
  selectedCategory: null,
  searchText: ''
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
      const value = state.selectedCategory;
      if(value !== action.payload) {
        state.selectedCategory = action.payload;
      } else if(value) {
        state.selectedCategory = null;
      } else {
        state.selectedCategory = action.payload;
      }
    },
    setFoodType: (state,action)=> {
      state.foodType = action.payload;
    },
    setCategoryNameData: (state, action) => {
      state.categoryNameList = action.payload;
    },
    setSearchText: (state, action) => {
      state.searchText = action.payload;
    }
  }
})

export const {setMenuCategoryData, setSelectedCategory, setFoodType, setCategoryNameData, setSearchText} = menuCategorySlice.actions;
export default menuCategorySlice.reducer;
