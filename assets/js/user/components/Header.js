import React, { useEffect, useState } from "react";
import styled from "styled-components";
import clsx from "clsx";

const height = "85px";

const MainContainer = styled.main`
  padding-top: ${({ headerHidden }) => (headerHidden ? 0 : height)};
`;

const Nav = styled.nav.attrs(({ scrolled, headerHidden }) => ({
  className: clsx(
    ["w-full", "fixed", "top-0", "z-50"], // 宽度/位置
    ["flex", "flex-wrap", "items-center", "justify-between"], // 布局
    ["p-6", "lg:px-32"], // 间距
    ["bg-white"],
    [{ shadow: scrolled }], // 阴影
    [{ hidden: headerHidden }]
  )
}))`
  min-height: ${height};
`;

const Logo = () => {
  return (
    <a href="/" className="font-normal text-2xl">
      <span>Veemoe</span>
      <span className="tracking-tight text-blue-500">Cloud</span>
    </a>
  );
};

export default ({ headerHidden }) => {
  // 滚动状态
  const [scrolled, setScrolled] = useState(false);
  // 添加滚动事件，动态变化背景色和阴影
  useEffect(() => {
    window.addEventListener("scroll", e => {
      const y = window.scrollY;
      setScrolled(y > 0);
    });
  }, []);

  return (
    <header>
      <Nav scrolled={scrolled} headerHidden={headerHidden}>
        {/* LOGO */}
        <Logo />
      </Nav>
    </header>
  );
};

export { MainContainer, Logo };
