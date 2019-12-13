import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  Breadcrumbs,
  Link,
  Typography,
  Box,
  Grid
} from "@material-ui/core";
import { Folder as FolderIcon, Image as ImageIcon } from "@material-ui/icons";

import { fetcher } from "../../lib/helper";
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary
  }
}));

const FileItem = ({ is_directory, text, selected }) => {
  let style = { padding: "1px" };

  if (selected)
    style = Object.assign(style, {
      backgroundColor: "#008dcf",
      color: "white"
    });

  return (
    <div>
      <Box display="flex" flexDirection="column" alignItems="center">
        {is_directory ? (
          <FolderIcon style={{ fontSize: 100, color: "#0093d8" }} />
        ) : (
          <ImageIcon style={{ fontSize: 100, color: "#00bc86" }} />
        )}
        <Typography variant="inherit" color="textPrimary" style={style}>
          {text}
        </Typography>
      </Box>
    </div>
  );
};

export default () => {
  const classes = useStyles();

  const { currentSpace } = useSelector(state => state.workspace);

  const [currentPath, setCurrentPath] = useState([]);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (currentSpace.name !== "loading")
      fetcher(
        `/console/api/files/${currentSpace.name}?path=${currentPath.join("/")}`
      ).then(({ files }) =>
        setFiles(files.map(f => Object.assign({}, f, { selected: false })))
      );
  }, [currentSpace, currentPath]);

  useEffect(() => {
    setCurrentPath([]);
  }, [currentSpace]);

  const handleSelect = (e, name) => {
    setFiles(
      files.map(f => {
        if (f.name === name)
          return Object.assign({}, f, { selected: !f.selected });
        else return f;
      })
    );
  };

  const handleDirDoubleClick = (e, { is_directory, name }) => {
    if (!is_directory) return;
    let path = [];
    if (currentPath) path = [...currentPath, name];
    else path = [name];

    setCurrentPath(path);
  };

  const handleBack = (e, i) => {
    e.preventDefault();
    setCurrentPath(currentPath.filter((_, di) => di <= i));
  };

  return (
    <Container maxWidth="md">
      <Box borderRadius={4} boxShadow={2} p={2}>
        <Box py={1}>
          <Breadcrumbs
            aria-label="breadcrumb"
            separator={<NavigateNextIcon fontSize="small" />}
          >
            <Link href="#" color="inherit" onClick={e => handleBack(e, -1)}>
              {currentSpace.name}
            </Link>
            {currentPath.map((dir, i) =>
              i < currentPath.length - 1 ? (
                <Link
                  href="#"
                  key={dir}
                  color="inherit"
                  onClick={e => handleBack(e, i)}
                >
                  {dir}
                </Link>
              ) : (
                <Typography key={dir} color="textPrimary">
                  {dir}
                </Typography>
              )
            )}
          </Breadcrumbs>
        </Box>
        <Box
          p={2}
          border={1}
          borderRadius={3}
          borderColor="#c0c0c0"
          style={{ overflow: "auto", height: "75vh" }}
        >
          <div className={classes.root}>
            <Grid container spacing={3}>
              {files.map(({ name, is_directory, selected }) => (
                <Grid
                  key={name}
                  item
                  xs={6}
                  sm={4}
                  md={2}
                  onClick={e => handleSelect(e, name)}
                  onDoubleClick={e =>
                    handleDirDoubleClick(e, { is_directory, name })
                  }
                >
                  <FileItem
                    is_directory={is_directory}
                    text={name}
                    selected={selected}
                  />
                </Grid>
              ))}
            </Grid>
          </div>
        </Box>
      </Box>
    </Container>
  );
};
