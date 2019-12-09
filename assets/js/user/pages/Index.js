import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import clsx from "clsx";
import { Helmet } from "react-helmet-async";
import { setRootClassName } from "../actions";
import { showHeader, showFooter } from "../slices/root";

import { PAGE_TITLE } from "../lib/locale";

const Index = styled.div.attrs(() => ({
  className: clsx()
}))``;

const HeroSection = styled.section.attrs(() => ({
  className: clsx(
    ["w-full"], // 宽度
    ["p-6", "lg:px-32"] // 间距
  )
}))``;

const HeroTitle = styled.h1.attrs(() => ({
  className: clsx(["text-2xl", "md:text-4xl"])
}))`
  color: #656e71;
`;

const HeroText = styled.div.attrs(() => ({
  className: clsx(["text-lg", "md:text-xl"], ["mt-4"], ["leading-loose"])
}))`
  color: #656e71;
`;

const NavButtomSection = styled.section.attrs(() => ({
  className: clsx(
    ["w-full"], // 宽度
    ["p-6", "lg:px-32"] // 间距
  )
}))`
  margin-left: -1rem;
`;

const HeroButton = styled.button.attrs(() => ({
  className: clsx(
    ["px-8", "md:px-16", "py-3", "md:py-5"],
    ["leading-none", "shadow", "rounded-full", ["text-white", "text-xl"]]
  )
}))`
  background: linear-gradient(
    94deg,
    rgba(165, 239, 142, 1) 0%,
    rgba(16, 212, 172, 1) 100%
  );
`;

const DemoSection = styled.section.attrs(() => ({
  className: clsx(
    ["w-full"], // 宽度
    ["p-6", "lg:px-32", "mt-16", "md:mt-32"], // 间距
    ["flex", "flex-wrap"] // 布局
  )
}))``;

const DemoCard = ({ children }) => {
  return (
    <div className="w-full md:w-6/12 lg:w-4/12 p-2">
      <div className="rounded-lg shadow">{children}</div>
    </div>
  );
};

const DemoCardTitle = styled.header.attrs(() => ({
  className: clsx("text-xl", "md:text-2xl", "m-4", "text-green-400")
}))``;

const DemoCardContent = styled.div.attrs(() => ({
  className: clsx()
}))``;

export default () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setRootClassName("bg-white"));
    dispatch(showHeader());
    dispatch(showFooter());
  }, []);

  return (
    <>
      <Helmet>
        <title>{PAGE_TITLE}</title>
      </Helmet>
      <Index>
        <HeroSection>
          <div className="flex flex-wrap">
            <div className="w-full md:w-7/12">
              <HeroTitle>荱萌云存储</HeroTitle>
              <HeroText>
                <p>
                  VeemoeCloud（中文名：荱萌云）是一个开源的图片云存储方案，它最初是荱萌漫画的附属项目，后独立从而诞生。
                </p>
                <p>
                  使用 VeemoeCloud{" "}
                  托管的图片，可以通过内置的常用函数实时处理并响应。
                  <strong>省去压缩和切图等费力的人工操作或提前步骤</strong>
                  ，也不用在意性能问题。
                </p>
              </HeroText>
            </div>
            <div className="hidden md:w-5/12">{/* 留空 */}</div>
          </div>
        </HeroSection>
        <NavButtomSection>
          <HeroButton className="mr-4">注册服务</HeroButton>
          <HeroButton>私有部署</HeroButton>
        </NavButtomSection>
        <DemoSection>
          <DemoCard>
            <DemoCardTitle>
              <p className="text-center">调整大小</p>
            </DemoCardTitle>
            <DemoCardContent>
              <div className="flex justify-end">
                <img src="/display/demo/demo.jpg?processes=resize.w_70/conv.webp" />
              </div>
              <div className="flex justify-center">
                <img src="/display/demo/demo.jpg?processes=resize.w_100/conv.webp" />
              </div>
              <div className="flex justify-start">
                <img
                  className="rounded-bl-lg"
                  src="/display/demo/demo.jpg?processes=resize.w_150/conv.webp"
                />
              </div>
            </DemoCardContent>
          </DemoCard>
          <DemoCard>
            <DemoCardTitle>
              <p className="text-center">高斯模糊</p>
            </DemoCardTitle>
            <DemoCardContent>
              <div className="flex justify-center">
                <img src="/display/demo/demo.jpg?processes=resize.w_500,h_80/blur.s_1/conv.webp" />
              </div>
              <div className="flex justify-center">
                <img src="/display/demo/demo.jpg?processes=resize.w_300,h_80/blur.s_3/conv.webp" />
              </div>
              <div className="flex justify-center">
                <img src="/display/demo/demo.jpg?processes=resize.w_200,h_80/blur.s_10/conv.webp" />
              </div>
            </DemoCardContent>
          </DemoCard>
          <DemoCard>
            <DemoCardTitle>
              <p className="text-center">剪裁内容</p>
            </DemoCardTitle>
            <DemoCardContent>
              <div className="flex justify-start">
                <img src="/display/demo/demo.jpg?processes=crop.h_50,w_100,y_50,x_50/conv.webp" />
              </div>
              <div className="flex justify-center">
                <img src="/display/demo/demo.jpg?processes=crop.h_60,w_100,y_50,x_80/conv.webp" />
              </div>
              <div className="flex justify-end">
                <img
                  className="rounded-br-lg"
                  src="/display/demo/demo.jpg?processes=crop.h_70,w_100,y_100,x_150/conv.webp"
                />
              </div>
            </DemoCardContent>
          </DemoCard>
        </DemoSection>

        <div className="flex flex-wrap justify-center p-6">
          <DemoCard>
            <DemoCardTitle>
              <p className="text-center">组合例子</p>
            </DemoCardTitle>
            <DemoCardContent>
              <div className="flex justify-center">
                <div>
                  <img
                    className="inline border-r border-b"
                    src="/display/demo/demo.jpg?processes=crop.w_100,h_50/conv.webp"
                  />
                  <img
                    className="inline border-l border-b"
                    src="/display/demo/demo.jpg?processes=crop.w_200,h_50,x_100/conv.webp"
                  />
                  <br />
                  <img
                    className="inline border-t border-r"
                    src="/display/demo/demo.jpg?processes=crop.y_50,w_200,h_150,h_150/blur.s_3.5/conv.webp"
                  />
                  <img
                    className="inline border-l border-t"
                    src="/display/demo/demo.jpg?processes=crop.y_50,x_200,w_100/conv.webp"
                  />
                </div>
              </div>
            </DemoCardContent>
          </DemoCard>
        </div>
      </Index>
    </>
  );
};
