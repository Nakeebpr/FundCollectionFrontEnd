import React from "react";
import { Skeleton } from "@mui/material";

function LoadingSkeleton() {
  return (
    <div>
      {[1, 2, 3, 4, 5].map((item, index) => {
        return (
          <Skeleton
            sx={{
              margin: "5px",
              bgcolor: "grey.900",
              "&::after": {
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
              },
            }}
            key={index}
            variant="rectangular"
            height={40}
            animation="wave"
          />
        );
      })}
    </div>
  );
}

export default LoadingSkeleton;
