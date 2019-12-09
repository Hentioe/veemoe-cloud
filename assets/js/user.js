// 导入样式
import "../scss/user.scss";
// 导入字体
import "@fortawesome/fontawesome-free/js/all";
// Polyfills
import "mdn-polyfills/Object.assign";
import "mdn-polyfills/Array.prototype.includes";
import "mdn-polyfills/String.prototype.startsWith";
import "mdn-polyfills/String.prototype.includes";
import "mdn-polyfills/NodeList.prototype.forEach";
import "mdn-polyfills/Element.prototype.classList";

import React from "react";
import ReactDOM from "react-dom";
import { Provider as ReduxProvider, useSelector } from "react-redux";
import reduxLogger from "redux-logger";
import thunkMiddleware from "redux-thunk";
import { configureStore } from "redux-starter-kit";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

// 导入页面和组件
import Header, { MainContainer } from "./user/components/Header";
import Footer from "./user/components/Footer";
import Index from "./user/pages/Index";
import Login from "./user/pages/Login";

// 创建 Redux Store
import Reducers from "./user/reducers";
const DEBUG = process.env.NODE_ENV == "development";
const middlewares = [thunkMiddleware, DEBUG && reduxLogger].filter(Boolean);
const store = configureStore({
  reducer: Reducers,
  middleware: middlewares
});

const Root = () => {
  const { className, style } = useSelector(state => state.root);

  return (
    <div className={className} style={style}>
      <Header />
      <MainContainer>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/">
            <Index />
          </Route>
        </Switch>
      </MainContainer>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <ReduxProvider store={store}>
      <HelmetProvider>
        <Router>
          <Root />
        </Router>
      </HelmetProvider>
    </ReduxProvider>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
