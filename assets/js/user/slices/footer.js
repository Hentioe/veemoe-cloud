import { createSlice } from "redux-starter-kit";

const initialState = {
  hiding: false
};

const footerSlice = createSlice({
  name: "footer",
  initialState,
  reducers: {
    hiddenFooter: state => Object.assign({}, state, { hiding: true }),
    showFooter: state => Object.assign({}, state, { hiding: false })
  }
});

export const { hiddenFooter, showFooter } = footerSlice.actions;

export default footerSlice.reducer;
