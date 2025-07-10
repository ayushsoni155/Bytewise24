import React, { useState } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const FilterBar = ({ onFilter }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [semester, setSemester] = useState("");

  const handleFilterChange = (search, sem) => {
    onFilter({ search: search.toLowerCase(), sem });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleFilterChange(value, semester);
  };

  const handleSemesterChange = (e) => {
    const value = e.target.value;
    setSemester(value);
    handleFilterChange(searchTerm, value);
  };

  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", sm: "row" }}
      alignItems="center"
      justifyContent="center"
      gap={2}
      mb={3}
      width="100%"
    >
      <TextField
        label="Search by name or subject code"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{
          width: { xs: "100%", sm: 300 },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        label="Semester"
        variant="outlined"
        select
        value={semester}
        onChange={handleSemesterChange}
        sx={{
          width: { xs: "100%", sm: 180 },
        }}
      >
        <MenuItem value="">All Semesters</MenuItem>
        {[...Array(8)].map((_, i) => (
          <MenuItem key={i + 1} value={i + 1}>
            Semester {i + 1}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
};

export default FilterBar;
