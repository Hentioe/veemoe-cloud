import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  Typography,
  Divider,
  TextField,
  Button,
  Box,
  Switch,
  FormGroup,
  FormControlLabel,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText
} from "@material-ui/core";

import { mutate, deletor, updater } from "../../lib/helper";
import { setCurrentSpace } from "../slices/workspace";

const DangerItem = ({
  lable,
  description,
  actionText = "操作",
  onClick = e => {}
}) => {
  return (
    <Box m={2} display="flex" justifyContent="space-between">
      <Typography component="div">
        <Box fontSize="fontSize" fontWeight="fontWeightBold">
          {lable}
        </Box>
        <Box fontSize="fontSize" fontWeight="fontWeightRegular">
          {description}
        </Box>
      </Typography>
      <Button variant="outlined" onClick={onClick}>
        {actionText}
      </Button>
    </Box>
  );
};

export default () => {
  const dispatch = useDispatch();
  const { currentSpace } = useSelector(state => state.workspace);
  const [space, setSpace] = useState(currentSpace);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (
      currentSpace.is_protected !== space.is_protected ||
      currentSpace.description !== space.description
    )
      setIsChanged(true);
    else setIsChanged(false);
  }, [currentSpace, space]);

  useEffect(() => {
    if (currentSpace) setSpace(Object.assign({}, currentSpace));
  }, [currentSpace]);

  const handleIsProtectedChange = e => {
    setSpace(Object.assign({}, space, { is_protected: e.target.checked }));
  };

  const handleDescriptionChange = e => {
    setSpace(Object.assign({}, space, { description: e.target.value }));
  };

  const handleUpdateProfile = () => {
    updater(`/console/api/workspaces/${space.id}`, space).then(space => {
      dispatch(setCurrentSpace(space));
      handleCreateSpaceDialogClose();
    });
  };

  const handleDelete = () => {
    deletor(`/console/api/workspaces/${space.id}`).then(space => {
      location.href = "/console";
    });
  };

  const [renameDialogOpen, setRenameDialogOpen] = useState(false);

  const handleRenameClick = () => {
    setRenameDialogOpen(true);
  };

  const [newName, setNewName] = useState("");

  const handleRenameDialogClose = () => {
    setNewName("");
    setRenameDialogOpen(false);
  };

  const handleNewNameChange = e => {
    setNewName(e.target.value);
  };

  const handleRenameDialogOK = () => {
    const newSpace = Object.assign({}, currentSpace, { name: newName });
    updater(`/console/api/workspaces/${currentSpace.id}`, newSpace).then(
      space => {
        location.href = `/console/${space.name}/settings`;
      }
    );
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h6" gutterBottom>
        工作空间属性
      </Typography>
      <Divider light style={{ marginBottom: 15 }} />
      <TextField
        label="空间描述"
        value={space.description}
        helperText="记录此空间的创建目的，例如对用于存放图片的目标项目介绍或其它用途。"
        onChange={handleDescriptionChange}
        fullWidth
        multiline
        rows="4"
        margin="normal"
        InputLabelProps={{
          shrink: true
        }}
        variant="outlined"
      />
      <FormGroup row>
        <FormControlLabel
          control={
            <Switch
              checked={space.is_protected}
              onChange={handleIsProtectedChange}
              value="checkedB"
              color="primary"
              inputProps={{ "aria-label": "primary checkbox" }}
            />
          }
          label={space.is_protected ? "受保护" : "未受保护"}
        />
      </FormGroup>
      <Divider light style={{ marginBottom: 15 }} />
      <Button
        variant="contained"
        color={isChanged ? "secondary" : "primary"}
        onClick={handleUpdateProfile}
      >
        更新属性
      </Button>
      <Typography variant="h6" gutterBottom style={{ marginTop: 30 }}>
        <Box color="secondary.main">危险操作</Box>
      </Typography>
      <Box borderRadius={6} border={1} borderColor="error.main">
        <DangerItem
          lable="重命名"
          description="连同服务器上的物理目录一并重命名，会产生副作用，请谨慎考虑。"
          actionText="重命名"
          onClick={handleRenameClick}
        />
        <Dialog
          open={renameDialogOpen}
          onClose={handleRenameDialogClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">重命名工作空间</DialogTitle>
          <DialogContent>
            <DialogContentText>
              重命名会导致 URL
              路径发生变化，服务器上对应的物理目录也会一并重命名。
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="新名称（路径）"
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
        <Divider />
        <DangerItem
          lable="删除空间"
          description="连同服务器上的物理目录一并删除，清空所有文件，请仔细考虑。"
          actionText="删除"
          onClick={handleDelete}
        />
      </Box>
    </Container>
  );
};
