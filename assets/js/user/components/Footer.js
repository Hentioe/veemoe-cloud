import React from "react";
import styled from "styled-components";
import clsx from "clsx";

const Footer = styled.footer.attrs(() => ({
  className: clsx(
    ["p-6", "lg:px-32"],
    ["text-white"],
    ["text-lg", "md:text-xl"]
  )
}))`
  background-color: #606470;
`;

export default () => {
  return (
    <Footer>
      <span>Copyright © 2019 VEEMOE</span>
    </Footer>
  );
};
