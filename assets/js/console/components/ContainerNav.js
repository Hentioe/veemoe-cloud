import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Link as RouterLink } from "react-router-dom";
import {
  Drawer,
  CssBaseline,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Collapse,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from "@material-ui/core";

import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  AccountCircle as AccountCircleIcon
} from "@material-ui/icons";

import { mutate } from "../../lib/helper";
import { setCurrentSpace, setSpaces } from "../slices/workspace";

const ListLinkItem = props => {
  return (
    <ListItem component={RouterLink} {...props}>
      {props.children}
    </ListItem>
  );
};

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: "space-between"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  },
  nested: {
    paddingLeft: theme.spacing(4)
  }
}));

export default ({ children }) => {
  const dispatch = useDispatch();
  const { spaces, currentSpace } = useSelector(state => state.workspace);

  const [menuList, setMenuList] = useState({
    styles: [],
    pipes: [],
    matches: []
  });

  useEffect(() => {
    setMenuList({
      styles: [
        { text: "添加样式", to: `/console/${currentSpace.name}/styles/add` },
        { text: "编辑样式", to: `/console/${currentSpace.name}/styles/edit` },
        {
          text: "批量操作",
          to: `/console/${currentSpace.name}/styles/managa`
        }
      ],
      pipes: [
        { text: "添加管道", to: `/console/${currentSpace.name}/pipes/add` },
        { text: "编辑管道", to: `/console/${currentSpace.name}/pipes/edit` },
        { text: "批量操作", to: `/console/${currentSpace.name}/pipes/managa` }
      ],
      matches: [
        { text: "添加匹配", to: `/console/${currentSpace.name}/matches/add` },
        {
          text: "编辑匹配",
          to: `/console/${currentSpace.name}/matches/edit`
        },
        {
          text: "批量操作",
          to: `/console/${currentSpace.name}/matches/managa`
        }
      ]
    });
  }, [currentSpace]);

  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [collapsesInStatus, setCollapsesInStatus] = React.useState({
    styles: true,
    pipes: true,
    matches: true
  });

  const handleCollapseToggle = (e, key) => {
    setCollapsesInStatus(
      Object.assign({}, collapsesInStatus, { [key]: !collapsesInStatus[key] })
    );
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [profileAnchorEl, setProfileAnchorEl] = React.useState(null);
  const profileOpen = Boolean(profileAnchorEl);

  const handleProfileClick = e => {
    setProfileAnchorEl(e.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const handleLogout = _e => {
    location.href = "/logout";
  };

  const [spaceAnchorEl, setSpaceAnchorEl] = React.useState(null);

  const handleSpaceClick = e => {
    setSpaceAnchorEl(e.currentTarget);
  };

  const handleCurrentSpaceChange = (e, space) => {
    setSpaceAnchorEl(null);
    dispatch(setCurrentSpace(space));
  };

  const handleSpaceClose = () => {
    setSpaceAnchorEl(null);
  };

  const handleSpaceCreate = () => {
    setCreateSpaceDialogOpen(true);
    setSpaceAnchorEl(null);
  };

  const [createSpaceDialogOpen, setCreateSpaceDialogOpen] = useState(false);

  const handleCreateSpaceDialogClose = () => {
    setNewSpaceName("");
    setCreateSpaceDialogOpen(false);
  };

  const [newSpaceName, setNewSpaceName] = useState("");

  const handleNewSpaceNameChange = e => {
    setNewSpaceName(e.target.value);
  };

  const handleCreateSpaceDialogOK = () => {
    mutate("/console/api/workspaces", { name: newSpaceName, description: "无" })
      .then(r => r.json())
      .then(space => {
        dispatch(setSpaces([...spaces, space]));
        handleCreateSpaceDialogClose();
      });
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            控制台
          </Typography>
          <div>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleProfileClick}
              color="inherit"
            >
              <AccountCircleIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={profileAnchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              open={profileOpen}
              onClose={handleProfileClose}
            >
              <MenuItem onClick={handleProfileClose}>我的主页</MenuItem>
              <MenuItem onClick={handleLogout}>登出</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.drawerHeader}>
          <Button fullWidth variant="outlined" onClick={handleSpaceClick}>
            /{currentSpace.name}
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={spaceAnchorEl}
            keepMounted
            open={Boolean(spaceAnchorEl)}
            onClose={handleSpaceClose}
          >
            {spaces.map(space => (
              <MenuItem
                key={space.id}
                onClick={e => handleCurrentSpaceChange(e, space)}
              >
                {space.name}
              </MenuItem>
            ))}

            <Divider />
            <MenuItem onClick={handleSpaceCreate}>创建新空间</MenuItem>
            <Dialog
              open={createSpaceDialogOpen}
              onClose={handleCreateSpaceDialogClose}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">创建新的工作空间</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  每一个工作空间都是相对独立的，对应着一个具体的物理目录作为根。如果您想修改空间配置或者删除空间，请进入空间设置。
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  label="空间名称（路径）"
                  value={newSpaceName}
                  onChange={handleNewSpaceNameChange}
                  fullWidth
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCreateSpaceDialogClose} color="primary">
                  取消
                </Button>
                <Button onClick={handleCreateSpaceDialogOK} color="primary">
                  创建
                </Button>
              </DialogActions>
            </Dialog>
          </Menu>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListLinkItem
            button
            to={`/console/${currentSpace.name}/file-manager`}
          >
            <ListItemText primary="文件管理" />
          </ListLinkItem>
          <ListLinkItem button to={`/console/${currentSpace.name}/dashboard`}>
            <ListItemText primary="数据统计" />
          </ListLinkItem>
          <ListItem button onClick={e => handleCollapseToggle(e, "styles")}>
            <ListItemText primary="样式管理" />
            {collapsesInStatus.styles ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
          <Collapse in={collapsesInStatus.styles} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {menuList.styles.map((menu, i) => (
                <ListLinkItem
                  key={i}
                  button
                  className={classes.nested}
                  to={menu.to}
                >
                  <ListItemText primary={menu.text} />
                </ListLinkItem>
              ))}
            </List>
          </Collapse>
          <ListItem button onClick={e => handleCollapseToggle(e, "pipes")}>
            <ListItemText primary="管道管理" />
            {collapsesInStatus.pipes ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
          <Collapse in={collapsesInStatus.pipes} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {menuList.pipes.map((menu, i) => (
                <ListLinkItem
                  key={i}
                  button
                  className={classes.nested}
                  to={menu.to}
                >
                  <ListItemText primary={menu.text} />
                </ListLinkItem>
              ))}
            </List>
          </Collapse>
          <ListItem button onClick={e => handleCollapseToggle(e, "matches")}>
            <ListItemText primary="匹配管理" />
            {collapsesInStatus.matches ? (
              <ExpandLessIcon />
            ) : (
              <ExpandMoreIcon />
            )}
          </ListItem>
          <Collapse in={collapsesInStatus.matches} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {menuList.matches.map((menu, i) => (
                <ListLinkItem
                  key={i}
                  button
                  className={classes.nested}
                  to={menu.to}
                >
                  <ListItemText primary={menu.text} />
                </ListLinkItem>
              ))}
            </List>
          </Collapse>
        </List>
        <Divider />
        <ListLinkItem button to={`/console/${currentSpace.name}/settings`}>
          <ListItemText primary="空间设置" />
        </ListLinkItem>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open
        })}
      >
        <div className={classes.drawerHeader} />
        {children}
      </main>
    </div>
  );
};
