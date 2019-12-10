import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import clsx from "clsx";
import { useDispatch } from "react-redux";
import useSWR, { mutate } from "swr";
import fetch from "unfetch";

import { hiddenHeader, hiddenFooter } from "../slices/root";
import { Logo } from "../components/Header";

const LoginSection = styled.section.attrs(() => ({
  className: clsx(
    ["h-screen", "w-full", "bg-white"],
    ["flex", "flex-wrap", "items-center"]
  )
}))``;

const Input = ({ lable, type, name, onChange }) => {
  return (
    <>
      <label className="text-sm text-gray-600 font-semibold">{lable}</label>
      <input
        type={type}
        name={name}
        onChange={onChange}
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

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember_me: false
  });

  const [loginResult, setLoginResult] = useState({ ok: null, msg: null });

  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  const handleEmailChange = e => {
    setFormData(Object.assign({}, formData, { email: e.target.value }));
  };

  const handlePasswordChange = e => {
    setFormData(Object.assign({}, formData, { password: e.target.value }));
  };

  const handleRememberMeChange = _e => {
    setFormData(
      Object.assign({}, formData, { remember_me: !formData.remember_me })
    );
  };

  const formDataRef = useRef(formData);

  const handleLogin = e => {
    e.preventDefault();

    fetch("/sign_in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formDataRef.current)
    })
      .then(r => r.json())
      .then(handleLoginResult);
  };

  const handleLoginResult = ({ msg, token }) => {
    if (msg == "OK") {
      var expires = new Date();
      expires.setFullYear(expires.getUTCFullYear() + 1);
      document.cookie = `token=${token}; expires=${expires}; path=/`;
      setLoginResult(
        Object.assign({}, loginResult, { ok: true, msg: "登录成功，跳转中……" })
      );
      setTimeout(() => {
        location.reload();
      }, 500);
    } else {
      setLoginResult(Object.assign({}, loginResult, { ok: false, msg: msg }));
    }
  };

  return (
    <div>
      <LoginSection>
        <div className="p-6 lg:px-32 w-full md:w-5/12">
          <Logo routable />
          <h1 className="mt-10 text-2xl lg:text-3xl font-semibold text-gray-700">
            登录荱萌云
          </h1>
          <p className="pt-4 text-gray-500">赠送免费体验额度</p>
          <form className="mt-6" method="POST">
            <Input
              lable="邮箱"
              type="text"
              name="email"
              value={formData.email}
              onChange={handleEmailChange}
            />
            <Input
              lable="密码"
              type="password"
              name="password"
              value={formData.password}
              onChange={handlePasswordChange}
            />
            <div>
              <input
                type="checkbox"
                name="remember_me"
                checked={formData.rememberMe}
                onChange={handleRememberMeChange}
              />
              <label className="ml-2 text-sm text-gray-600">记住我</label>
              {loginResult.msg ? (
                <span
                  className="ml-2 text-sm"
                  style={{ color: loginResult.ok ? "green" : "red" }}
                >
                  {loginResult.msg}
                </span>
              ) : null}
            </div>
            <div className="mt-5">
              <button
                className="px-8 py-2 rounded shadow text-sm font-semibold text-white bg-blue-500"
                onClick={handleLogin}
              >
                登录
              </button>
            </div>
          </form>
          <div className="mt-10">
            <p className="text-center">
              <span className="text-gray-600">还没有帐号？</span>
              <a className="text-blue-500" href="/register">
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
