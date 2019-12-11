import { combineReducers } from "redux";

import workspaceReducer from "./slices/workspace";

export default combineReducers({ workspace: workspaceReducer });
