import React, { useEffect } from "react";
import styled from "styled-components";
import clsx from "clsx";
import { useDispatch } from "react-redux";

import { hiddenHeader, hiddenFooter } from "../slices/root";
import { Logo } from "../components/Header";

const LoginSection = styled.section.attrs(() => ({
  className: clsx(
    ["h-screen", "w-full", "bg-white"],
    ["flex", "flex-wrap", "items-center"]
  )
}))``;

const Input = ({ lable, type, name }) => {
  return (
    <>
      <label className="text-sm text-gray-600 font-semibold">{lable}</label>
      <input
        type={type}
        name={name}
        className="mt-1 mb-5 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-1 px-2 block w-full appearance-none leading-normal"
      />
    </>
  );
};

export default () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(hiddenHeader());
    dispatch(hiddenFooter());
  }, []);
  return (
    <div>
      <LoginSection>
        <div className="p-6 lg:px-32 w-full md:w-5/12">
          <Logo />
          <h1 className="mt-10 text-2xl lg:text-3xl font-semibold text-gray-700">
            登录荱萌云
          </h1>
          <p className="pt-4 text-gray-500">赠送免费体验额度</p>
          <form className="mt-6">
            <Input lable="邮箱" type="text" name="email" />
            <Input lable="密码" type="password" name="password" />
            <div>
              <input type="checkbox" />
              <label className="ml-2 text-sm text-gray-600">记住我</label>
            </div>
            <div className="mt-5">
              <button className="px-8 py-2 rounded shadow text-sm font-semibold text-white bg-blue-500">
                登录
              </button>
            </div>
          </form>
          <div className="mt-10">
            <p className="text-center">
              <span className="text-gray-600">还没有帐号？</span>
              <a className="text-blue-500" href="#">
                马上注册
              </a>
            </p>
          </div>
          <div className="mt-16">
            <p className="text-center text-xs font-mono text-gray-600">
              Copyright © 2019 VEEMOE
            </p>
          </div>
        </div>
        <div className="w-full h-full md:w-7/12 hidden md:block bg-gray-200"></div>
      </LoginSection>
    </div>
  );
};
