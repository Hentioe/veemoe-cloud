import { combineReducers } from "redux";

import rootReducer from "./slices/root";
import footerReducer from "./slices/footer";

export default combineReducers({ root: rootReducer, footer: footerReducer });
