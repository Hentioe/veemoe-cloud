import { createSlice } from "redux-starter-kit";

const initialState = {
  className: "bg-transparent",
  style: {}
};

const rootSlice = createSlice({
  name: "root",
  initialState,
  reducers: {
    setClassName: (state, action) =>
      Object.assign({}, state, { className: action.payload }),
    setStyle: (state, action) =>
      Object.assign({}, state, { style: action.payload })
  }
});

export const { setClassName, setStyle } = rootSlice.actions;

export default rootSlice.reducer;
