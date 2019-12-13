import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  NavigateNext as NavigateNextIcon,
  Search as SearchIcon,
  CreateNewFolder as CreateNewFolderIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  Breadcrumbs,
  Link,
  Typography,
  Box,
  Grid,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  TextField,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText
} from "@material-ui/core";
import { Folder as FolderIcon, Image as ImageIcon } from "@material-ui/icons";

import { fetcher, deletor, updater, creator } from "../../lib/helper";
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary
  },
  arrowButton: {
    marginLeft: theme.spacing(2)
  },
  menuButton: {
    marginLeft: theme.spacing(1)
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

const initContextPosition = {
  mouseX: null,
  mouseY: null
};

export default () => {
  const classes = useStyles();

  const { currentSpace } = useSelector(state => state.workspace);

  const [currentPath, setCurrentPath] = useState([]);
  const [files, setFiles] = useState([]);

  const [operationsAnchorEl, setOperationsAnchorEl] = useState(null);
  const operationsOpen = Boolean(operationsAnchorEl);

  const handleOperationsClose = () => {
    setOperationsAnchorEl(null);
  };

  const handleOperationsClick = e => {
    setOperationsAnchorEl(e.currentTarget);
  };

  const [contextPosition, setContextPosition] = useState(initContextPosition);

  const handleGridContextMenu = e => {
    e.preventDefault();
    setContextPosition({
      mouseX: e.clientX - 2,
      mouseY: e.clientY - 4
    });
  };

  const contextMenuClose = e => {
    setContextPosition(initContextPosition);
  };

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

  const handleSelect = (name, autoCancel = true) => {
    setFiles(
      files.map(f => {
        if (f.name === name)
          return Object.assign({}, f, {
            selected: autoCancel ? !f.selected : true
          });
        else return Object.assign({}, f, { selected: false });
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

  const handleDirClick = (e, name) => {
    handleSelect(name);
  };

  const handleDirContextMenu = (e, name) => {
    handleSelect(name, false);
  };

  const handleDelete = e => {
    const selected = files.filter(f => f.selected);
    if (selected && selected.length > 0) {
      const name = selected[0].name;
      let path = currentPath.join("/");
      if (path !== "") path += `/${name}`;
      else path += name;
      deletor(`/console/api/files/${currentSpace.name}?path=${path}`).then(
        data => {
          if (data.msg === "OK") setFiles(files.filter(f => f.name !== name));
          setContextPosition(initContextPosition);
        }
      );
    }
  };

  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");

  const handleRenameDialogOpen = e => {
    setRenameDialogOpen(true);
    setContextPosition(initContextPosition);
  };
  const handleRenameDialogClose = e => {
    setRenameDialogOpen(false);
  };

  const handleNewNameChange = e => {
    setNewName(e.target.value);
  };

  const handleRenameDialogOK = e => {
    const selected = files.filter(f => f.selected);
    if (selected && selected.length > 0) {
      const old_name = selected[0].name;
      let path = currentPath.join("/");
      updater(`/console/api/files/${currentSpace.name}/rename`, {
        root: path,
        old_name,
        new_name: newName
      }).then(data => {
        if (data.msg === "OK")
          setFiles(
            files.map(f => {
              if (f.name === old_name)
                return Object.assign({}, f, { name: newName });
              else return f;
            })
          );
        setNewName("");
        setContextPosition(initContextPosition);
        setRenameDialogOpen(false);
      });
    }
  };

  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);
  const handleNewFolderDialogOpen = e => {
    setNewFolderDialogOpen(true);
    setContextPosition(initContextPosition);
  };

  const handleNewFolderDialogClose = e => {
    setNewFolderDialogOpen(false);
  };

  const handleNewFolderDialogOK = e => {
    let path = currentPath.join("/");
    creator(`/console/api/files/${currentSpace.name}/directories`, {
      root: path,
      name: newName
    }).then(({ name }) => {
      setFiles([{ name, is_directory: true, selected: true }, ...files]);
      setNewName("");
      setContextPosition(initContextPosition);
      setNewFolderDialogOpen(false);
    });
  };

  return (
    <Container maxWidth="md">
      <Box borderRadius={4} boxShadow={2} p={2}>
        <Box>
          <IconButton size="small">
            <ArrowBackIcon />
          </IconButton>
          <IconButton size="small" className={classes.arrowButton}>
            <ArrowForwardIcon />
          </IconButton>
          <Button
            variant="text"
            size="small"
            startIcon={<SearchIcon />}
            className={classes.menuButton}
          >
            搜索
          </Button>
          <Menu
            keepMounted
            open={contextPosition.mouseY !== null}
            onClose={contextMenuClose}
            anchorReference="anchorPosition"
            anchorPosition={
              contextPosition.mouseY !== null && contextPosition.mouseX !== null
                ? { top: contextPosition.mouseY, left: contextPosition.mouseX }
                : undefined
            }
          >
            <MenuItem onClick={handleNewFolderDialogOpen}>
              <ListItemIcon>
                <CreateNewFolderIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="button">新建</Typography>
            </MenuItem>
            <MenuItem onClick={handleRenameDialogOpen}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="button">重命名</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleDelete}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="button">删除</Typography>
            </MenuItem>
          </Menu>
        </Box>
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
          onContextMenu={handleGridContextMenu}
        >
          <div className={classes.root} style={{ cursor: "context-menu" }}>
            <Grid container spacing={3}>
              {files.map(({ name, is_directory, selected }) => (
                <Grid
                  key={name}
                  item
                  xs={6}
                  sm={4}
                  md={2}
                  onClick={e => handleDirClick(e, name)}
                  onDoubleClick={e =>
                    handleDirDoubleClick(e, { is_directory, name })
                  }
                  onContextMenu={e => handleDirContextMenu(e, name)}
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

      <Dialog
        open={renameDialogOpen}
        onClose={handleRenameDialogClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">新建目录</DialogTitle>
        <DialogContent>
          <DialogContentText>更新文件名称：</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="新名称"
            fullWidth
            value={newName}
            onChange={handleNewNameChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRenameDialogClose} color="primary">
            取消
          </Button>
          <Button onClick={handleRenameDialogOK} color="primary">
            确认
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={newFolderDialogOpen}
        onClose={handleNewFolderDialogClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">新建目录</DialogTitle>
        <DialogContent>
          <DialogContentText>
            在 {currentPath.length == 0 ? "." : currentPath.join("/")}{" "}
            中创建新目录：
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="名称"
            fullWidth
            value={newName}
            onChange={handleNewNameChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNewFolderDialogClose} color="primary">
            取消
          </Button>
          <Button onClick={handleNewFolderDialogOK} color="primary">
            确认
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
