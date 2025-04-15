import React, {useContext, useState} from 'react';
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    FormGroup,
} from '@mui/material';
import {api, AuthContext} from "../context/AuthContext";
import AlertHandler from "../components/AlertHandler";

const inquiryOptions = [
    'General Inquiry',
    'Technical Support',
    'Feedback',
    'Other'
];

const ContactForm = () => {
    const { authTokens } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [inquiryType, setInquiryType] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const validateForm = () => {
        if (authTokens) {
            if (!inquiryType || !message) {
                setError('Please provide both a subject and a message.');
                return false;
            }
        } else {
            if (!email || !inquiryType || !message) {
                setError('Please provide your email, subject, and message.');
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        setError('');

        try {
            if (authTokens) {
                 await api.post(
                    '/contact/',
                    { inquiryType, message },
                );
            } else {
                await api.post(
                    '/contact/',
                    { email, inquiryType, message },
                );
            }

        } catch (err) {
            setError('Failed to send message. Please try again');
        } finally {
            setIsSubmitting(false);
            setSubmitted(true);
        }
    };

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'background.default',
                padding: 2,
            }}
        >
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    width: '100%',
                    maxWidth: 600,
                    padding: 4,
                    backgroundColor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 3,
                }}
            >
                <Typography variant="h4" mb={3} align="center" fontWeight="bold">
                    Contact Us
                </Typography>
                <FormGroup>
                    {!authTokens && (
                        <FormControl sx={{ mb: 3 }} required>
                            <TextField
                                label="Email Address"
                                type="email"
                                variant="outlined"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                fullWidth
                            />
                        </FormControl>
                    )}
                    <FormControl fullWidth sx={{ mb: 3 }} required>
                        <InputLabel>Inquiry Type</InputLabel>
                        <Select
                            value={inquiryType}
                            label="Inquiry Type"
                            variant="outlined"
                            onChange={(e) => setInquiryType(e.target.value)}
                        >
                            {inquiryOptions.map((option, index) => (
                                <MenuItem key={index} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl sx={{ mb: 3 }} required>
                        <TextField
                            label="Message"
                            multiline
                            rows={4}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            variant="outlined"
                            required
                            fullWidth
                        />
                    </FormControl>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </Button>
                    {submitted && (
                        <Typography sx={{ mt: 2 }} color="success.main">
                            Thank you! We'll get back to you soon.
                        </Typography>
                    )}
                    {error && (
                        <AlertHandler alertMessage={error} />
                    )}
                </FormGroup>
            </Box>
        </Box>
    );
};

export default ContactForm;