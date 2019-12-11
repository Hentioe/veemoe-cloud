import { createSlice } from "redux-starter-kit";

const initialState = {
  currentSpace: { id: 0, name: "loading", is_protected: true }
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setCurrentSpace: (state, { payload }) => {
      return Object.assign({}, state, { currentSpace: payload });
    }
  }
});

export const { setCurrentSpace } = workspaceSlice.actions;

export default workspaceSlice.reducer;
