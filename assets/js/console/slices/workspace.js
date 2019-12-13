import { createSlice } from "redux-starter-kit";

const initialState = {
  spaces: [],
  currentSpace: { id: 0, name: "loading", is_protected: true }
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setCurrentSpace: (state, { payload }) =>
      Object.assign({}, state, { currentSpace: payload }),
    setSpaces: (state, { payload }) =>
      Object.assign({}, state, { spaces: payload })
  }
});

export const { setCurrentSpace, setSpaces } = workspaceSlice.actions;

export default workspaceSlice.reducer;
