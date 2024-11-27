import * as React from 'react';
import { useState } from 'react';
import {Box, Dialog, DialogActions, DialogContent, DialogTitle, Button, SpeedDial, SpeedDialAction, SpeedDialIcon,
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import TransactionForm  from "./TransactionForm";
import CategoryForm from "./CategoryForm";
import BudgetForm from "./BudgetForm";

const actions = [
    { icon: <ReceiptLongIcon />, name: 'Transaction' },
    { icon: <CurrencyExchangeIcon />, name: 'Budget' },
    { icon: <CategoryIcon />, name: 'Category' },
    { icon: <PersonAddIcon />, name: 'Family' },
];

export default function BasicSpeedDial({ authTokens }) {
    const [open, setOpen] = useState(false);
    const [modalType, setModalType] = useState('');

    const handleActionClick = (actionName) => {
        setModalType(actionName);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setModalType('');
    };

    return (
        <Box sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1 }}>
            <SpeedDial
                ariaLabel="SpeedDial basic example"
                sx={{ position: 'absolute', bottom: 16, right: 16 }}
                icon={<SpeedDialIcon />}
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.name}
                        icon={action.icon}
                        tooltipTitle={action.name}
                        onClick={() => handleActionClick(action.name)}
                    />
                ))}
            </SpeedDial>

            <Dialog open={open && modalType === 'Transaction'} onClose={handleClose}>
                <DialogTitle>New Transaction</DialogTitle>
                <DialogContent>
                    <TransactionForm authTokens={authTokens}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={open && modalType === 'Budget'} onClose={handleClose}>
                <DialogTitle>Budget Modal</DialogTitle>
                <DialogContent>
                    <BudgetForm authTokens={authTokens}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={open && modalType === 'Category'} onClose={handleClose}>
                <DialogTitle>Category Modal</DialogTitle>
                <DialogContent>
                    <CategoryForm authTokens={authTokens}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={open && modalType === 'Family'} onClose={handleClose}>
                <DialogTitle>Family Modal</DialogTitle>
                <DialogContent>
                    <p>Content related to the Family action goes here.</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}