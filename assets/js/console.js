// 导入样式
import "../scss/console.scss";

import React from "react";
import ReactDOM from "react-dom";
import { Provider as ReduxProvider } from "react-redux";
import reduxLogger from "redux-logger";
import thunkMiddleware from "redux-thunk";
import { configureStore } from "redux-starter-kit";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

// 导入页面和组件
import ContainerNav from "./console/components/ContainerNav";
import Dashboard from "./console/pages/Dashboard";

// 创建 Redux Store
import Reducers from "./console/reducers";
const DEBUG = process.env.NODE_ENV == "development";
const middlewares = [thunkMiddleware, DEBUG && reduxLogger].filter(Boolean);
const store = configureStore({
  reducer: Reducers,
  middleware: middlewares
});

const App = () => {
  return (
    <ReduxProvider store={store}>
      <HelmetProvider>
        <Router>
          <ContainerNav>
            <Switch>
              <Route path="/">
                <Dashboard />
              </Route>
            </Switch>
          </ContainerNav>
        </Router>
      </HelmetProvider>
    </ReduxProvider>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
