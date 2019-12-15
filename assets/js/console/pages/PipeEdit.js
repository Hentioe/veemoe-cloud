import React from "react";
import { useLocation } from "react-router-dom";
import { Container } from "@material-ui/core";

export default () => {
  const query = new URLSearchParams(useLocation().search);
  const targetFile = query.get("file");
  return <Container>{targetFile ? "添加内联管道" : "添加管道"}</Container>;
};
