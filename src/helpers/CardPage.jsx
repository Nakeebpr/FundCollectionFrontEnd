import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

function CardPage({ timeline, amount }) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 5,
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper>
        <Card sx={{ minWidth: 275 }} className="cardPage">
          <CardContent className="cardContent">
            <Typography
              // sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
              className="homeDataHeading"
            >
              {`Total ${timeline} Collection`}
            </Typography>
            <Typography variant="h5" component="div" className="homeDataValue">
              {`₹ ${amount}`}
            </Typography>
          </CardContent>
        </Card>
      </Paper>
    </Box>
  );
}

export default CardPage;
