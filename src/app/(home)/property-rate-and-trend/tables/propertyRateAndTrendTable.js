import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
export default function PropertyRateAndTrendTable({ tableHeaders = [], data = [] }) {
    return (
        <>
            <TableContainer
                component={Paper}
                sx={{ maxHeight: 400, overflowY: "auto" }}
            >
                <Table sx={{ minWidth: 650 }} stickyHeader aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {tableHeaders.map((item, index) => (
                                <TableCell
                                    key={`${item}-${index}`}
                                    className="fw-bold"
                                >
                                    {item.headerDisplayName}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => (
                            <TableRow
                                key={row.city}
                                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {row.city}<br />
                                    {row.noOfProjects}
                                </TableCell>
                                <TableCell>{row.noOfTransactions}</TableCell>
                                <TableCell>{row.currentRate}</TableCell>
                                <TableCell>{row.changeValue}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}