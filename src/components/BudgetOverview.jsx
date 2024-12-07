import React, { useState } from "react";
import { Container, Button, Typography, Box } from "@mui/material";
import TransactionPieChart from "./TransactionPieChart";
import TransactionTableView from "./TransactionTableView";
import TransactionBarChart from "./TransactionBarChart";

const BudgetOverview = () => {
    const [currentReport, setCurrentReport] = useState("report1");

    const handleReportToggle = (report) => {
        setCurrentReport(report);
    };

    return (
        <Container sx={{ marginTop: 4 }}>
            <Box display="flex" justifyContent="center" mb={3}>
                <Button
                    variant={currentReport === "report1" ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => handleReportToggle("report1")}
                    sx={{ marginRight: 2 }}
                >
                    Transaction Overview
                </Button>
                <Button
                    variant={currentReport === "report2" ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => handleReportToggle("report2")}
                    sx={{ marginRight: 2 }}
                >
                    Transaction Bar Chart
                </Button>
                <Button
                    variant={currentReport === "report3" ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => handleReportToggle("report3")}
                >
                    Transaction Data
                </Button>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center", height: "85vh", alignItems: "center" }}>
                {currentReport === "report1" ? (
                    <TransactionPieChart />
                ) : currentReport === "report2" ? (
                    <Typography variant="h5" textAlign="center">
                        <TransactionBarChart />
                    </Typography>
                ) : (
                    <Typography variant="h5" textAlign="center">
                        <TransactionTableView />
                    </Typography>
                )}
            </Box>
        </Container>
    );
};

export default BudgetOverview;