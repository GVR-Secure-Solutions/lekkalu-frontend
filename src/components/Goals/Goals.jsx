import React, { useState, useContext, useEffect } from "react";
import {
  Typography,
  TablePagination,
  IconButton
} from "@mui/material";
import { SkipNext, SkipPrevious } from '@mui/icons-material';
import GoalFormModal from "./GoalsModal";
import { ModalContainer } from "../Expenses/styled";
import GoalsList from "./GoalsList";

const Goals = ({ Context }) => {
  const {
    goals,
    fetchGoals,
    deleteGoalRequest,
    createGoalRequest,
    changeGoalRequest,
  } = useContext(Context);
  const [editIndex, setEditIndex] = useState(null);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  useEffect(() => {
    fetchGoals(page, rowsPerPage);
  }, [page]);

  const deleteGoal = (id) => {
    deleteGoalRequest(id);
  };

  const createGoal = (goal) => {
    createGoalRequest({ ...goal });
  };

  const updateGoal = (index, goal) => {
    changeGoalRequest(index, goal);
  };

  const returnGoalToEdit = () => {
    return editIndex !== null ? { ...goals[editIndex] } : null
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <ModalContainer>
      <GoalFormModal
        onAddGoal={createGoal}
        onUpdateGoal={updateGoal}
        goalToEdit={returnGoalToEdit()}
        editIndex={editIndex}
        onCancelEdit={() => setEditIndex(null)}
        Context={Context}
      />
      <Typography variant="h6">Financial Goals List</Typography>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <IconButton
          onClick={() => {
            setPage((prevPage) => Math.max(prevPage - 3, 0));
          }}
        >
          <SkipPrevious />
        </IconButton>
        <TablePagination
          component="div"
          count={goals.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[]}
          labelDisplayedRows={() => ''}
        />
        <IconButton
          onClick={() => {
            setPage((prevPage) => Math.min(prevPage + 3, 6));
          }}
        >
          <SkipNext />
        </IconButton>
        {page * 10 + 1} - {page * 10 + 10} of {goals.length}
      </div>
      <GoalsList
        goals={goals}
        setEditIndex={setEditIndex}
        deleteGoal={deleteGoal}
      />
      {!!goals.length &&
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            onClick={() => {
              setPage((prevPage) => Math.max(prevPage - 3, 0));
            }}
          >
            <SkipPrevious />
          </IconButton>
          <TablePagination
            component="div"
            count={goals.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={10}
            rowsPerPageOptions={[]}
            labelDisplayedRows={() => ''}
          />
          <IconButton
            onClick={() => {
              setPage((prevPage) => Math.min(prevPage + 3, 6));
            }}
          >
            <SkipNext />
          </IconButton>
          {page * 10 + 1} - {page * 10 + 10} of {goals.length}
        </div>
      }
    </ModalContainer>
  );
};

export default Goals;

