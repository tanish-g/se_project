import React, { useState } from 'react';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const QueryForm = () => {
  const [formData, setFormData] = useState({
    sessionInput: '',
    sessionYearInput: '',
    admnNoInput: ''
  });
  const [queryResults, setQueryResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setQueryResults(data);
      setErrorMessage('');
    } catch (error) {
      console.error(error);
      setErrorMessage('Error fetching data');
      setQueryResults([]);
    }
  };

  return (
    <div>
      <h1>Query Form</h1>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Session"
          name="sessionInput"
          value={formData.sessionInput}
          onChange={handleChange}
        />
        <TextField
          label="Session Year"
          name="sessionYearInput"
          value={formData.sessionYearInput}
          onChange={handleChange}
        />
        <TextField
          label="Admission Number"
          name="admnNoInput"
          value={formData.admnNoInput}
          onChange={handleChange}
        />
        <Button type="submit" variant="contained" color="primary">
          Submit Query
        </Button>
      </form>

      {errorMessage && <p>{errorMessage}</p>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {queryResults.length > 0 &&
                Object.keys(queryResults[0]).map((header) => (
                  <TableCell key={header}>{header}</TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {queryResults.map((row, index) => (
              <TableRow key={index}>
                {Object.values(row).map((value, index) => (
                  <TableCell key={index}>{value}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default QueryForm;
