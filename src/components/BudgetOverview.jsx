import React, { useState } from "react";
import { Container, Button, Typography, Box } from "@mui/material";
import TransactionPieChart from "./TransactionPieChart";

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
                >
                    Report 2
                </Button>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center", height: "55vh", alignItems: "center" }}>
                {currentReport === "report1" ? (
                    <TransactionPieChart />
                ) : (
                    <Typography variant="h5" textAlign="center">
                        This is Report 2
                    </Typography>
                )}
            </Box>
        </Container>
    );
};

export default BudgetOverview;