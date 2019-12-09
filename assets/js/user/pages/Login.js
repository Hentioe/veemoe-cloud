import React from "react";
import styled from "styled-components";
import clsx from "clsx";

const LoginSection = styled.section.attrs(() => ({
  className: clsx(["w-full", "bg-white"], ["flex", "flex-wrap"])
}))``;

const Input = ({ lable, type, name }) => {
  return (
    <>
      <label className="text-sm font-semibold">{lable}</label>
      <input
        type={type}
        name={name}
        className="mt-1 mb-5 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-1 px-2 block w-full appearance-none leading-normal"
      />
    </>
  );
};

export default () => {
  return (
    <div>
      <LoginSection>
        <div className="p-6 lg:px-32 w-full md:w-5/12">
          <h1 className="text-xl lg:text-2xl font-semibold text-gray-700">
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
        <div className="w-full md:w-7/12 bg-gray-200"></div>
      </LoginSection>
    </div>
  );
};
