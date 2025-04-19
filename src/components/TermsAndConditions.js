import React from 'react';
import {Box, Typography} from "@mui/material";
import {Link} from "react-router-dom";

function TermsAndConditions() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100vw',
            padding: 20,
            boxSizing: 'border-box',
        }}>
            <div style={{
                width: '70%',
                maxWidth: 800,
                padding: 30,
                borderRadius: 8,
                boxShadow: '0 0 10px rgba(0,0,0,0.1)'
            }}>
                <h1>Terms and Conditions</h1>
                <p><strong>Last updated:</strong> April 16, 2025</p>

                <h2>1. About Budget Bud</h2>
                <p>Budget Bud is a budgeting and finance-tracking tool that allows users to enter personal transaction data and receive insights through reporting and analytics. The information entered is entirely user-submitted and may include text or numerical values related to budgeting and spending.</p>

                <h2>2. Account Registration</h2>
                <p>To use certain features of Budget Bud, you may be required to create an account. When registering, you agree to provide accurate and complete information, including your name and email address.</p>
                <p>You are responsible for keeping your login credentials secure. We are not liable for any unauthorized access to your account due to your failure to protect this information.</p>

                <h2>3. User-Submitted Information</h2>
                <p>All data you enter into Budget Bud — such as expenses, income, or budget notes — is considered user-submitted content. You retain ownership of your data. By using the service, you grant Budget Bud a limited license to use that information solely to provide you with personalized budget reports and insights.</p>
                <p>We will never sell your data or use it for advertising purposes.</p>

                <h2>4. Acceptable Use</h2>
                <p>You agree not to:</p>
                <ul>
                    <li>Use Budget Bud for illegal or unauthorized purposes.</li>
                    <li>Interfere with or disrupt the service or servers.</li>
                    <li>Attempt to access or reverse-engineer any part of the source code or database.</li>
                </ul>
                <p>Violation of these rules may result in suspension or termination of your account.</p>

                <h2>5. Data and Privacy</h2>
                <p>Please review our <a href="/privacy">Privacy Policy</a> to understand how we collect, use, and protect your information.</p>

                <h2>6. Availability and Changes</h2>
                <p>We may change, suspend, or discontinue parts of the service at any time without notice. We also reserve the right to modify these Terms. If we make material changes, we’ll let you know by updating the “Last updated” date above or by other reasonable means.</p>
                <p>Continuing to use the service after changes are made means you accept the new Terms.</p>

                <h2>7. Termination</h2>
                <p>We reserve the right to suspend or terminate your account at any time if you violate these Terms or use the service in a harmful way.</p>

                <h2>8. Disclaimer</h2>
                <p>Budget Bud is provided “as is” without warranties of any kind. We make no guarantees that the service will be error-free, secure, or continuously available.</p>
                <p>You use the service at your own risk, and we are not liable for any losses resulting from your use of the platform.</p>

                <h2>9. Governing Law</h2>
                <p>These Terms are governed by the laws of the Commonwealth of Virginia, United States, without regard to its conflict of law principles.</p>

                <h2>10. Contact Us</h2>
                <p>If you have any questions about these Terms, feel free to <a href="https://budgetingbud.com/contact" target="_blank" rel="noopener noreferrer">contact us</a>.</p>
            </div>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    py: 4,
                }}
            >
                <Typography
                    variant="h2"
                    sx={{
                        fontWeight: 'bold',
                        fontSize: '4rem',
                        background: 'linear-gradient(45deg, #1DB954, #006400)',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        display: 'inline-block',
                        mb: 2,
                    }}
                >
                    BudgetBud
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 4,
                        flexWrap: 'wrap',
                    }}
                >
                    <Link to="/">
                        Home
                    </Link>
                    <Link to="/contact">
                        Contact
                    </Link>
                    <Link to="/privacy">
                        Privacy Policy
                    </Link>
                </Box>
            </Box>
        </div>
    );
}

export default TermsAndConditions;