import React, { useState, useEffect } from "react";
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
  Button
} from "@material-ui/core";

import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  AccountCircle as AccountCircleIcon
} from "@material-ui/icons";

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

const spaceList = ["demo", "veemoe"];

export default ({ children }) => {
  const [currentSpace, setCurrentSpace] = useState("demo");

  const [menuList, setMenuList] = useState({
    styles: [],
    pipes: [],
    matches: []
  });

  useEffect(() => {
    setMenuList({
      styles: [
        { text: "添加样式", to: `/console/${currentSpace}/styles/add` },
        { text: "编辑样式", to: `/console/${currentSpace}/styles/edit` },
        { text: "批量操作", to: `/console/${currentSpace}/styles/managa` }
      ],
      pipes: [
        { text: "添加管道", to: `/console/${currentSpace}/pipes/add` },
        { text: "编辑管道", to: `/console/${currentSpace}/pipes/edit` },
        { text: "批量操作", to: `/console/${currentSpace}/pipes/managa` }
      ],
      matches: [
        { text: "添加匹配", to: `/console/${currentSpace}/matches/add` },
        { text: "编辑匹配", to: `/console/${currentSpace}/matches/edit` },
        { text: "批量操作", to: `/console/${currentSpace}/matches/managa` }
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

  const handleSpaceChoose = (e, space) => {
    setCurrentSpace(space);
    setSpaceAnchorEl(null);
  };

  const handleSpaceClose = () => {
    setSpaceAnchorEl(null);
  };

  const handleSpaceCreate = () => {
    setSpaceAnchorEl(null);
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
            /{currentSpace}
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={spaceAnchorEl}
            keepMounted
            open={Boolean(spaceAnchorEl)}
            onClose={handleSpaceClose}
          >
            {spaceList.map(space => (
              <MenuItem key={space} onClick={e => handleSpaceChoose(e, space)}>
                {space}
              </MenuItem>
            ))}

            <Divider />
            <MenuItem onClick={handleSpaceCreate}>创建新空间</MenuItem>
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
          <ListLinkItem button to={`/console/${currentSpace}/file-managaer`}>
            <ListItemText primary="文件管理" />
          </ListLinkItem>
          <ListLinkItem button to={`/console/${currentSpace}/dashboard`}>
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
        <ListLinkItem button to={`/console/${currentSpace}/settings`}>
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
