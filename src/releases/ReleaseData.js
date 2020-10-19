/**
 * Description: This function is used showing table details and auth code on action button.
 *              It also provides the global search functionality on grid based on device id and table id.
 * Author : Lavina Hemnani
 * Created On : 19 October 2020
 */

// import libraries
import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  TextField,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

// import done

// global constants
const useStyles = makeStyles((theme)=>({
  table: {
    minWidth: 650,
  },
  margin: {
    margin: theme.spacing(1),
  }
}));

const columns = [
  {
    label: "Version",
    dataKey: "versionName",
  },
  {
    label: "Start Date",
    dataKey: "startDate",
  },
  {
    label: "Released Date",
    dataKey: "releasedDate",
  },
  {
    label: "Description",
    dataKey: "description",
  },
  {
    label: "Status",
    dataKey: "status",
  },
];

/**
 * This function is used showing release data.
 * It also provides the functionality to add , edit or delete any release.
 */
export default function ReleaseData() {
  /* State variables and functions */
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [versionName, setVersionName] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [releasedDate, setReleasedDate] = useState("");
  const [description, setDescription] = useState("");
  const [progressValue, setProgress] = useState(0);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorReleasedDate, setErrorReleasedDate] = useState(false);
  const [errorMessageReleasedDate, setErrorMessageReleasedDate] = useState("");
  const [errorStartDate, setErrorStartDate] = useState(false);
  const [errorMessageStartDate, setErrorMessageStartDate] = useState("");
  const [id, setId] = useState("");
  const [mode, setMode] = useState("");

  /**
   * This function handles the closing of the pop up modal and setting the variables to default value
   */
  const handleClose = () => {
    setStartDate(new Date());
    setVersionName("");
    setReleasedDate("");
    setDescription("");
    setProgress(0);
    setError(false);
    setErrorMessage("");
    setErrorReleasedDate(false);
    setErrorMessageReleasedDate("");
    setErrorStartDate(false);
    setErrorMessageStartDate("");
    setId("");
    setMode("");
    setOpen(false);
  };

  /**
   * This function gets the binds the release data into the edit popup based on version
   * @param {*} versionName
   */
  const showEdit = (versionName) => {
    var dataToEdit = data.find((d) => d.versionName === versionName);
    setVersionName(dataToEdit.versionName);
    setStartDate(dataToEdit.startDate);
    setReleasedDate(dataToEdit.releasedDate);
    setDescription(dataToEdit.description);
    setProgress(dataToEdit.progressValue);
    setId(dataToEdit.id);
    setMode("edit");
    setOpen(true);
  };

  /**
   * This function handles the start date change
   * @param {*} date
   */
  const handleStartDateChange = (date) => {
    if (Date.parse(date) < Date.parse(new Date())) {
      setStartDate(date);
      setErrorStartDate(true);
      setErrorMessageStartDate("Start Date must be greater than Current Date");
    } else {
      setStartDate(date);
      setErrorStartDate(false);
      setErrorMessageStartDate("");
    }
  };

  /**
   * This function handles the released date change
   * and validates the released date with the start date
   * and sets the error message accordingly
   * @param {*} date
   */
  const handleReleasedDateChange = (date) => {
    if (Date.parse(date) >= Date.parse(startDate)) {
      setReleasedDate(date);
      setErrorReleasedDate(false);
      setErrorMessageReleasedDate("");
    } else if (Date.parse(date) < Date.parse(new Date())) {
      setReleasedDate(date);
      setErrorReleasedDate(true);
      setErrorMessageReleasedDate(
        "Released Date must be greater than Current Date"
      );
    } else {
      setReleasedDate(date);
      setErrorReleasedDate(true);
      setErrorMessageReleasedDate(
        "Released Date must be greater than Start Date"
      );
    }
  };

  /**
   * This function handles the version change, validates it to be non empty and unique
   * and sets the error message accordingly
   * @param {*} event
   */
  const handleVersionChange = (event) => {
    setVersionName(event.target.value);
    if (event.target.value === "") {
      setError(true);
      setErrorMessage("Please Enter Version Name");
    } else {
      var dataIndex = data.findIndex(
        (d) => d.versionName === event.target.value
      );
      var dataReleased = data.find((d) => d.versionName === event.target.value);
      if (dataIndex > -1 && dataReleased.id !== id) {
        setError(true);
        setErrorMessage("Version Name must be a unique value");
      } else {
        setError(false);
        setErrorMessage("");
      }
    }
  };

  /**
   * This function checks the error field and saves/updates the data if there is no error.
   * It hanldes both the add and edit mode
   */
  const handleSaveButton = () => {
    // If there is no validation error
    if (!error && !errorReleasedDate && versionName !== "") {
      var status = "";
      // eslint-disable-next-line
      if (progressValue == 0) {
        status = "In Progress";
      }
      // eslint-disable-next-line
      else if (progressValue == 100) {
        status = "Released";
      } else {
        status = "Unreleased";
      }

      // If the user wants to update a release
      if (mode === "edit") {
        var dataIndex = data.findIndex((p) => p.id === id);
        data[dataIndex].versionName = versionName;
        data[dataIndex].startDate = startDate;
        data[dataIndex].releasedDate = releasedDate;
        data[dataIndex].description = description;
        data[dataIndex].progressValue = progressValue;
        data[dataIndex].status = status;
      }
      // If the user wants to add a release
      else {
        var dataId = toString(data.length);
        var object = {
          versionName: versionName,
          progressValue: progressValue,
          startDate: String(startDate),
          releasedDate: String(releasedDate),
          description: description,
          status: status,
          id: dataId,
        };
        var dataArray = [...data, object];
        setData(dataArray);
      }

      // set the field variables to their default value
      setVersionName("");
      setStartDate(new Date());
      setReleasedDate("");
      setDescription("");
      setProgress(0);
      setError(false);
      setErrorMessage("");
      setErrorReleasedDate(false);
      setErrorMessageReleasedDate("");
      setErrorStartDate(false);
      setErrorMessageStartDate("");
      setId("");
      setMode("");
      setOpen(false);
    } else if (versionName === "") {
      setError(true);
      setErrorMessage("Please Enter Version Name");
    }
  };

  /**
   * This function deletes the release which is selected
   * @param {*} versionName
   */
  const showDelete = (versionName) => {
    var dataIndex = data.findIndex((p) => p.versionName === versionName);
    var releaseDataArray = [...data];
    releaseDataArray.splice(dataIndex, 1);
    setData(releaseDataArray);
  };

  /**
   * This function returns the JSX
   */
  return (
    <div className="form">
      <Button
        onClick={() => {
          setOpen(true);
          setMode("add");
        }}
        color="primary"
        variant="outlined"
        size="medium"
      >
        Add Release
      </Button>
      <TableContainer>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              {/* <TableCell>Table Status</TableCell> */}
              {columns.map(({ dataKey, label }) => (
                <TableCell key={dataKey}>{label}</TableCell>
              ))}
              <TableCell>Progress</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          {data.length > 0 ? (
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.versionName}>
                  {columns.map(({ dataKey }) => {
                    if (
                      (dataKey === "startDate" || dataKey === "releasedDate") &&
                      item[dataKey] !== ""
                    ) {
                      var date = new Date(Date.parse(item[dataKey]));
                      var day = date.getDate();
                      var month = date.getMonth() + 1;
                      var year = date.getFullYear();
                      if (month.length < 2) month = "0" + month;
                      if (day.length < 2) day = "0" + day;
                      var dateWithFormat = day + "/" + month + "/" + year;
                      return (
                        <TableCell key={dataKey}>{dateWithFormat}</TableCell>
                      );
                    } else
                      return (
                        <TableCell key={dataKey}>{item[dataKey]}</TableCell>
                      );
                  })}
                  <TableCell>
                    <LinearProgress
                      variant="buffer"
                      value={item.progressValue}
                      valueBuffer={100}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell colSpan="4">
                    <IconButton
                      aria-label="edit"
                      className={classes.margin}
                      size="small"
                    >
                      <EditIcon onClick={() => showEdit(item.versionName)} />
                    </IconButton>
                    <IconButton
                      aria-label="edit"
                      className={classes.margin}
                      size="small"
                    >
                      <DeleteIcon
                        onClick={() => showDelete(item.versionName)}
                      />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <TableBody>
              <TableCell colSpan="7">
                <div
                  style={{
                    color: "red",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  No Release Available
                </div>
              </TableCell>
            </TableBody>
          )}
        </Table>
      </TableContainer>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {mode === "edit" ? "Edit " : "Create "}Release
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <form className={classes.root} autoComplete="off">
              <div class="form-group">
                <TextField
                  required
                  id="standard-version-name"
                  label="Version Name"
                  error={error}
                  helperText={errorMessage}
                  defaultValue={versionName}
                  onChange={handleVersionChange}
                />
              </div>
              <div class="form-group">
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="dd/MM/yyyy"
                    margin="normal"
                    id="start-date-picker-inline"
                    label="Start Date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                    required
                    error={errorStartDate}
                    helperText={errorMessageStartDate}
                  />
                </MuiPickersUtilsProvider>
              </div>
              <div class="form-group">
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="dd/MM/yyyy"
                    margin="normal"
                    id="released-date-picker-inline"
                    label="Released Date"
                    defaultValue={releasedDate === "" ? null : releasedDate}
                    value={releasedDate === "" ? null : releasedDate}
                    onChange={handleReleasedDateChange}
                    disabled={progressValue === 100 ? true : false}
                    error={errorReleasedDate}
                    helperText={errorMessageReleasedDate}
                  />
                </MuiPickersUtilsProvider>
              </div>
              <div class="form-group">
                {mode === "edit" ? (
                  <TextField
                    id="standard-number"
                    label="Progress"
                    defaultValue="0"
                    required
                    value={progressValue}
                    disabled={progressValue === 100 ? true : false}
                    onChange={(event) => {
                      if (event.target.value < 0 || event.target.value > 100)
                        event.preventDefault();
                      else setProgress(event.target.value);
                    }}
                    name="progressValue"
                    type="number"
                  />
                ) : (
                  ""
                )}
              </div>
              <div class="form-group">
                <TextField
                  id="standard-description"
                  label="Description"
                  defaultValue={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>
            </form>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveButton} color="primary">
            {mode === "edit" ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
