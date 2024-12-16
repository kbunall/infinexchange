import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  TablePagination,
  TextField,
} from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import SearchIcon from "@mui/icons-material/Search";
import MovingIcon from '@mui/icons-material/Moving';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
const GenericTable = ({ columns, rows, pagination, children }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleSortChange = (field) => {
    let direction = "asc";
    if (sortConfig.key === field && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key: field, direction });
  };

  const filteredRows = rows.filter((row) =>
    columns.every((column) => {
      if (!column.filterable) return true;
      const filter = filters[column.field] || "";
      return String(row[column.field])
        .toLowerCase()
        .includes(filter.toLowerCase());
    })
  );

  const sortedRows = [...filteredRows].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const paginatedRows = pagination
    ? sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : sortedRows;

  return (
    <Paper elevation={12}>
      <Box p={3}>
        <Box sx={{ flexGrow: 1 }} my={4}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead style={{ backgroundColor: "#004AAD" }}>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.field}
                      style={{
                        color: 'white',
                        cursor: column.orderable ? "pointer" : "default",
                      }}
                      onClick={() =>
                        column.orderable && handleSortChange(column.field)
                      }
                    >
                      {column.filterable ? (
                        <TextField
                          variant="outlined"
                          size="small"
                          style={{ marginLeft: 8, backgroundColor: '#004aad' }}
                          value={filters[column.field] || ""}
                          onChange={(e) =>
                            handleFilterChange(column.field, e.target.value)
                          }
                          placeholder={column.headerName}
                          InputProps={{
                            startAdornment: (
                              <SearchIcon style={{ marginRight: 8 }} />
                            ),
                          }}
                        />
                      ) : (
                        <div>
                          {column.headerName} 
                          
                          {column.orderable && (<UnfoldMoreIcon></UnfoldMoreIcon>)}
                          
                        </div>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRows.map((row, rowIndex) => (
                  <TableRow
                    key={rowIndex}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    {columns.map((column) => (
                      <TableCell
                        key={column.field}
                        // style={{
                        //   backgroundColor:
                        //     !column.colorful || row[column.field] === 0
                        //       ? "white"
                        //       : row[column.field] > 0
                        //       ? "#C5FF98"
                        //       : "#FFAAAA",
                        //   color: (!column.colorful || row[column.field] === 0)
                        //     ? 'black'
                        //     : (row[column.field] > 0 ? '#00a530' : '#E90000')
                        // }}
                      >
                        {column.field === "actions" ? (
                          <>{column.render(row)}</>
                        ) : column.field === "priceChangePercentage" ? (
                          <>
                            {row[column.field]}{" "}
                            {row[column.field] > 0 ? (
                              <MovingIcon style={{ color: "green" }} fontSize="small" />
                            ) : row[column.field] < 0 ? (
                              <TrendingDownIcon style={{ color: "red" }} fontSize="small" />
                            ) : null}
                          </>
                        ) : column.render ? (
                          column.render(row)
                        ) : (
                          row[column.field]
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {pagination && (
              <Box
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
                m={2}
              >
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage="Sayfa başına satır:"
                  sx={{
                    "& .MuiTablePagination-selectLabel": {
                      marginBottom: "0",
                    },
                    "& .MuiTablePagination-select": {
                      marginTop: "0",
                    },
                    "& .MuiTablePagination-displayedRows": {
                      marginTop: "0",
                      marginBottom: "0",
                    },
                  }}
                />
              </Box>
            )}
          </TableContainer>
          {children}
        </Box>
      </Box>
    </Paper>
  );
};

export default GenericTable;
