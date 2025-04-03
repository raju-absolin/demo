import React, { useEffect, ChangeEvent } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { RiCloseFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import {
  isPasswordModel,
  InputChangeValue,
  setVerifyPassword,
  backupDatabaseSelector,
} from "@src/store/settings/BackupDatabase/backupDatabase.slice";
import { useAppDispatch, useAppSelector } from "@src/store/store";
import { systemSelector } from "@src/store/system/system.slice";
// import { RootState } from "@src/store"; // Import the RootState type for typing useSelector

interface BackupPasswordProps {
  open: boolean;
}

const BackupPassword: React.FC<BackupPasswordProps> = ({ open }) => {
  const dispatch = useAppDispatch();

  const {
    backupDatabase: {
        backupData, dataBaseId, verifyPwdloading,
    }, system: { userAccessList },
} = useAppSelector((state) => {
    return {
        backupDatabase: backupDatabaseSelector(state),
        system: systemSelector(state),
    };
});
//   const { backupData, dataBaseId, verifyPwdloading } = useSelector(
//     (state: RootState) => state.backupDatabase
//   );

  // Updates form field when changes are detected
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(
      InputChangeValue({
        key: e.target.name,
        value: e.target.value,
      })
    );
  };

  // Handles the form submission
  const handleUpdate = () => {
    const obj = { password: backupData.password };
    dispatch(setVerifyPassword({ obj, dataBaseId }));
  };

  // Resets input values and closes the modal
  const handleClose = () => {
    dispatch(isPasswordModel(false));
  };

  // Sets the initial field values
  useEffect(() => {
    dispatch(
      InputChangeValue({
        key: "password",
        value: backupData.password,
      })
    );
  }, [backupData.password, dispatch]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Verify Password
        <IconButton
          onClick={handleClose}
          style={{ position: "absolute", right: 8, top: 8 }}
        >
          <RiCloseFill />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              variant="outlined"
              placeholder="Enter Password"
              value={backupData.password || ""}
              onChange={handleChange}
              required
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleUpdate}
          color="primary"
          variant="contained"
          disabled={verifyPwdloading}
          endIcon={verifyPwdloading ? <CircularProgress size={20} /> : null}
        >
          Verify
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BackupPassword;
