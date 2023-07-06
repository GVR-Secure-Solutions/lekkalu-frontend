import React from 'react';
import { Table, TableBody, TableRow, TableCell, IconButton, TableHead } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Swal from 'sweetalert2';
import './Goals.css'
const GoalsList = ({ goals, getTagNames, setEditIndex, deleteGoal }) => {

    const columns = [
        { id: 'goals', label: 'Goals', align: 'right' },
        { id: 'subGoals', label: 'Sub Goals', align: 'center' },
        {
            id: 'targetMetric',
            label: 'Target Metric',
            align: 'right',
        },
        {
            id: 'current',
            label: 'Current Metric',
            align: 'right',
        },
        {
            id: 'balance',
            label: 'Balance',
            align: 'right',
        },
        {
            id: 'reachablitiyInMonths',
            label: 'Reachability in Months',
            align: 'right',
        },
        {
            id: 'reachabilityInYears',
            label: 'Reachability in Years',
            align: 'right',
        },
        {
            id: 'started',
            label: 'Started',
            align: 'right',
        },
        {
            id: 'finished',
            label: 'Finished',
            align: 'right',
        },
        {
            id: 'plannedStart',
            label: 'Planned Start',
            align: 'right',
        },
        {
            id: '',
            label: '',
            align: 'right'
        }
    ];

    const deleteHandler = (goal) => {

        Swal.fire({
            title: 'Are you sure?',
            text: `You won't be able to revert this`,
            icon: 'warning',
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: 'Delete',
            confirmButtonColor: "Red"
        }).then((res) => {
            if (res.isConfirmed) {
                deleteGoal(goal.id)
                Swal.fire(
                    'Deleted',
                    'Your goal deleted successfully.',
                    'success'
                )
            }
        })

    }

    const getBalanceCellStyle = (goal) => {
        if (typeof goal.balance === 'number') {
            return getStyle(goal.preferredQuantity,goal.balance,goal.current);
        } else if(typeof goal.balance === 'string' ) {
            let current = Number(goal.current?.split('%')[0]);
            let balance = Number(goal.balance?.split('%')[0]);
            return getStyle(goal.preferredQuantity,balance,current);
        }
    }

    const getStyle = (preferredQuantity, balance, current) => {
        if (preferredQuantity === 'higher') {
            if (balance > current) {
                return 'green-opaque-bg';
            } else {
                return 'red-opaque-bg';
            }
        } else {
            if (balance > current) {
                return 'red-opaque-bg'
            } else {
                return 'green-opaque-bg';
            }
        }
    }
   

    return (
        <Table>
            <TableHead>
                <TableRow >
                    {columns.map((column) => (
                        <TableCell
                            key={column.id}
                            align={column.align}
                        >
                            {column.label}
                        </TableCell>
                    ))}
                </TableRow>

            </TableHead>
            <TableBody>
                {goals &&
                    Boolean(goals.length) &&
                    goals.map((goal, index) => {
                        const balanceCellStyle = getBalanceCellStyle(goal);
                        return <TableRow key={goal.id}>
                            <TableCell>{goal.goal}</TableCell>
                            <TableCell>{goal.subGoal}</TableCell>
                            {typeof goal.targetMetric === 'number' ?
                                <TableCell>&#8377; {goal.targetMetric.toLocaleString('en-IN')}</TableCell> :
                                <TableCell>{goal.targetMetric}</TableCell>
                            }
                            {typeof goal.current === 'number' ?
                                <TableCell>&#8377; {goal.current.toLocaleString('en-IN')}</TableCell> :
                                <TableCell>{goal.current}</TableCell>
                            }
                            {typeof goal.balance === 'number' ?
                                <TableCell className={balanceCellStyle}>&#8377; {goal.balance.toLocaleString('en-IN')}</TableCell> :
                                <TableCell className={balanceCellStyle}>{goal.balance}</TableCell>
                            }
                            <TableCell>{goal.reachablitiyInMonths}</TableCell>
                            <TableCell>{goal.reachabilityInYears}</TableCell>
                            <TableCell>{goal.started && new Date(goal.started).toDateString(0)}</TableCell>
                            <TableCell>{goal.finished && new Date(goal.finished).toDateString(0)}</TableCell>
                            <TableCell>{goal.plannedStart && new Date(goal.plannedStart).toDateString(0)}</TableCell>
                            <TableCell>
                                <IconButton placeholder="edit-goal" edge="end" onClick={() => setEditIndex(index)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton placeholder="delete-goal" edge="end" onClick={() => {
                                    deleteHandler(goal)
                                }}>
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    }

                    )}
            </TableBody>
        </Table>
    );
};

export default GoalsList;