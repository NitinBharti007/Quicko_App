import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
  allCategory: [],
  subCategory: [],
  product: [],
};

const productSlice = createSlice({
  name: "product",
  initialState: initialValue,
  reducers: {
    setAllCategory: (state, action) => {
      state.allCategory = [...action.payload];
    },
  },
});

export const { setAllCategory } = productSlice.actions;

export default productSlice.reducer;