import { FormControl, Input, FormHelperText, Button } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { styled } from "@mui/material/styles";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${theme.breakpoints.down("sm")}`]: {
    fontSize: "0.8rem",
  },
}));

export default function Form() {
  const [stockName, setStockName] = useState("");
  const [stockNumber, setStockNumber] = useState("");
  const [dividendData, setDividendData] = useState([]);

  const handleStockNameChange = (event) => {
    setStockName(event.target.value);
  };

  const handleStockNumberChange = (event) => {
    setStockNumber(event.target.value);
  };

  const handleSubmit = () => {
    if (stockName) {
      axios
        .get("http://localhost:3000/stocks/" + stockName)
        .then((response) => {
          console.log(response);
          const dividendDates = Object.keys(
            response.data.chart.result[0].events.dividends
          );
          const dividends = dividendDates.map((timestamp) => {
            const date = new Date(timestamp * 1000);
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            const formattedDate = `${day}/${month}/${year}`;
            return {
              date: formattedDate,
              amount:
                response.data.chart.result[0].events.dividends[timestamp]
                  .amount,
            };
          });
          dividends.sort((a, b) => new Date(b.date) - new Date(a.date));
          setDividendData(dividends);
        })
        .catch((error) => {
          console.error("Error fetching stocks:", error);
        });
    }
  };

  return (
    <section>
      {/* <h2>Dividend yield when juxtaposed with historical dividend payouts</h2> */}
      <h3>
        อัตราผลตอบแทนจากเงินปันผล เมื่อเทียบเคียงกับการจ่ายเงินปันผลในอดีต
      </h3>
      <FormControl>
        <div>
          <Input
            id="stocks-name"
            placeholder="Write your stocks name"
            value={stockName}
            onChange={handleStockNameChange}
          />
        </div>
        <FormHelperText />
        <br />
        <div>
          <Input
            id="stocks-number"
            type="number"
            placeholder="Number of stocks"
            value={stockNumber}
            onChange={handleStockNumberChange}
          />
        </div>
        <FormHelperText />
        <br />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </FormControl>
      <br />
      {dividendData.length > 0 && (
        <>
          <br />
          <h4>{stockName.toUpperCase()} Dividend Yield</h4>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell style={{ textAlign: "center" }}>
                    Dividend date
                  </StyledTableCell>
                  <StyledTableCell style={{ textAlign: "center" }}>
                    Dividend value
                  </StyledTableCell>
                  <StyledTableCell style={{ textAlign: "center" }}>
                    Dividend estimate
                  </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dividendData.map((dividend, index) => (
                  <TableRow key={index}>
                    <StyledTableCell style={{ textAlign: "center" }}>
                      {dividend.date}
                    </StyledTableCell>
                    <StyledTableCell style={{ textAlign: "center" }}>
                      {dividend.amount}
                    </StyledTableCell>
                    <StyledTableCell style={{ textAlign: "center" }}>
                      {(dividend.amount * stockNumber).toFixed()}
                    </StyledTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </section>
  );
}
