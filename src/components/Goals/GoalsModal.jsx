import React, { useState, useEffect, useContext } from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ModalContainer } from "../Expenses/styled";
import { formatDate, preventPropagationOnEnter } from "../Expenses/utils";
import dayjs from "dayjs";
import Swal from "sweetalert2";

const GoalFormModal = ({
  onAddGoal,
  onUpdateGoal,
  goalToEdit,
  editIndex,
  onCancelEdit,
  Context,
}) => {
  const [open, setOpen] = useState(false);
  const [goal, setGoal] = useState('');
  const [subGoal, setSubGoal] = useState('');
  const [targetMetric, setTargetMetric] = useState('');
  const [currentMetric, setCurrentMetric] = useState('');
  const [balance, setBalance] = useState('');
  const [reachablitiyInMonths, setReachablitiyInMonths] = useState('');
  const [reachabilityInYears, setReachabilityInYears] = useState('');
  const [started, setStarted] = useState(new Date());
  const [finished, setFinished] = useState(new Date());
  const [plannedStart, setPlannedStart] = useState(new Date());
  const [preferredQuantity, setPreferredQuantity] = React.useState('higher');

  const handleChange = (event, newPreferredQuantity) => {
    setPreferredQuantity(newPreferredQuantity);
  };

  useEffect(() => {
    if (goalToEdit) {
      setGoal(goalToEdit.goal);
      setSubGoal(goalToEdit.subGoal);
      setTargetMetric(goalToEdit.targetMetric);
      setCurrentMetric(goalToEdit.currentMetric);
      setBalance(goalToEdit.balance);
      setReachablitiyInMonths(goalToEdit.reachablitiyInMonths);
      setReachabilityInYears(goalToEdit.reachabilityInYears);
      setStarted(goalToEdit.started);
      setFinished(goalToEdit.finished);
      setPlannedStart(goalToEdit.plannedStart);
      setPreferredQuantity(goalToEdit.preferredQuantity);
      setOpen(true);
    }
  }, [goalToEdit]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    if (editIndex !== null) {
      onCancelEdit();
    }
  };

  const handleDateChange = async (date, setDate) => {
    setDate(date);
    
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const newGoal = {
      goal,
      subGoal,
      targetMetric,
      current: currentMetric,
      balance,
      reachablitiyInMonths,
      reachabilityInYears,
      user: 1,
      started: formatDate(new Date(started)),
      finished: formatDate(new Date(finished)),
      plannedStart: formatDate(new Date(plannedStart)),
      preferredQuantity
    };

    if (editIndex !== null) {
      onUpdateGoal(editIndex, { ...goalToEdit, ...newGoal });
    } else {
      onAddGoal({ ...newGoal });
    }

    Swal.fire({
      icon: 'success',
      title: `${editIndex !== null ? "The goal was updated correctly" : "The goal was added correctly"}`,
      timer: 2300,
      timerProgressBar: true
    })
    setGoal("");
    setSubGoal("");
    setTargetMetric("");
    setCurrentMetric("");
    setBalance("");
    setReachablitiyInMonths("");
    setReachabilityInYears("");
    setStarted("");
    setFinished("");
    setPlannedStart("");
    handleClose();
  };

  const isAmountValid = (value) => {
    const regex = /^(0|[1-9]\d*)(\.\d{0,2})?$/;
    return regex.test(value);
  }

  const handleAmountChange = (event, setAmount) => {
    const newValue = event.target.value;

    if (newValue.includes('%') || isAmountValid(newValue)) {
      setAmount(newValue);
    } else {
      return;
    }
  };

  const handleGoalChange = (event) => {
    const newValue = event.target.value;
    setGoal(newValue);

  };
  const handleSubGoalChange = (event) => {
    const newValue = event.target.value;
    setSubGoal(newValue);
  };

  return (
    <>
      <ModalContainer>
        <Button
          variant="contained"
          color="primary"
          onClick={handleClickOpen}
          data-testid="add-goal"
        >
          Add Goal
        </Button>
        <Dialog open={open} onClose={() => {
          handleClose()
        }}
        >


          <DialogTitle>{editIndex !== null ? "Edit Goal" : "Add Goal"}</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <Typography variant="p">Provide the Goal:</Typography>
              <TextField
                value={goal}
                onChange={handleGoalChange}
                onKeyPress={preventPropagationOnEnter}
                required
                fullWidth
                data-testid="goal"
              />
              <Typography variant="p">Provide the Sub Goal:</Typography>
              <TextField
                value={subGoal}
                onChange={handleSubGoalChange}
                onKeyPress={preventPropagationOnEnter}
                required
                fullWidth
                data-testid="sub-goal"
              />
              <Typography variant="p">Provide the Target Metric:</Typography>
              <TextField
                value={targetMetric}
                onChange={(event) => handleAmountChange(event, setTargetMetric)}
                onKeyPress={preventPropagationOnEnter}
                required
                fullWidth
                data-testid="target-metric"
              />
              <Typography variant="p">Provide the Current Metric:</Typography>
              <TextField
                value={currentMetric}
                onChange={(event) => handleAmountChange(event, setCurrentMetric)}
                onKeyPress={preventPropagationOnEnter}
                required
                fullWidth
                data-testid="current-metric"
              />
              <Typography variant="p">Provide the Balance:</Typography>
              <TextField
                value={balance}
                onChange={(event) => handleAmountChange(event, setBalance)}
                onKeyPress={preventPropagationOnEnter}
                required
                fullWidth
                data-testid="balance"
              />
              <Typography variant="p">Provide the Reachability in Months:</Typography>
              <TextField
                value={reachablitiyInMonths}
                onChange={(event) => handleAmountChange(event, setReachablitiyInMonths)}
                onKeyPress={preventPropagationOnEnter}
                required
                fullWidth
                data-testid="reachablitiy-in-months"
              />
              <Typography variant="p">Provide the Reachability in Years:</Typography>
              <TextField
                value={reachabilityInYears}
                onChange={(event) => handleAmountChange(event, setReachabilityInYears)}
                onKeyPress={preventPropagationOnEnter}
                required
                fullWidth
                data-testid="reachability-in-years"
              />
              <Typography variant="p">Choose the Started Date:</Typography>
              <div>
                <LocalizationProvider dateAdapter={AdapterDayjs} >
                  <DatePicker
                    data-testid='start-date'
                    defaultValue={dayjs(started)}
                    onChange={(date) => handleDateChange(date, setStarted)}
                  />
                </LocalizationProvider>
              </div>
              <Typography variant="p">Choose the Finished Date:</Typography>
              <div>
                <LocalizationProvider dateAdapter={AdapterDayjs} >
                  <DatePicker
                    data-testid='finished-date'
                    defaultValue={dayjs(finished)}
                    onChange={(date) => handleDateChange(date, setFinished)}
                  />
                </LocalizationProvider>
              </div>
              <Typography variant="p">Choose the Planned Start Date:</Typography>
              <div>
                <LocalizationProvider dateAdapter={AdapterDayjs} >
                  <DatePicker
                    data-testid='planned-start-date'
                    defaultValue={dayjs(plannedStart)}
                    onChange={(date) => handleDateChange(date, setPlannedStart)}
                  />
                </LocalizationProvider>
              </div>
              <Typography variant="p">Choose preffered value of Balance:</Typography>
              <div>
                <ToggleButtonGroup
                  color="primary"
                  value={preferredQuantity}
                  exclusive
                  onChange={handleChange}
                  aria-label="Platform"
                  data-testid='preferred-quantity'
                >
                  <ToggleButton value="higher">Higher</ToggleButton>
                  <ToggleButton value="lower">Lower</ToggleButton>
                </ToggleButtonGroup>
              </div>
              <DialogActions  >
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit" color="primary" data-testid="submit-goal">
                  {editIndex !== null ? "Update" : "Add"}
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </ModalContainer>

    </>
  );
};

export default GoalFormModal;
