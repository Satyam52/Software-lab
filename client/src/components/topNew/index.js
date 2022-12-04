import React from "react";
import { Skeleton, Divider, Avatar, Typography, Box } from "@mui/material";
import styles from "./style.module.css";
import { deepOrange, green } from "@mui/material/colors";

// div>
//       <Skeleton variant="circular" width={40} height={40} />
//       <Skeleton variant="rectangular" width={210} height={60} />
//       <Skeleton variant="rounded" width={210} height={60} />
//     </div>

const TopNew = () => {
  return (
    <div className={styles.container}>
      <Typography className={styles.title} variant="h4">
        New and notable
      </Typography>
      <Divider />
      <div className={styles.childs}>
        <div className={styles.topNewContainer}>
          <div></div>
          <Typography>Name</Typography>
          <Typography s>Highest Bid</Typography>
        </div>
        <div className={styles.topNewContainer}>
          <div></div>
          <Typography>Name</Typography>
          <Typography s>Highest Bid</Typography>
        </div>
        {[0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((item, idx) => {
          return (
            <span key={idx} className={styles.singleChild}>
              <Box>
                <div className={styles.topNewContainer}>
                  <Avatar
                    sx={{ bgcolor: deepOrange[500], width: 56, height: 56 }}
                    variant="rounded"
                    src="https://picsum.photos/200/200"
                  >
                    A
                  </Avatar>
                  <Typography style={{ marginLeft: "20px" }} variant="h6">
                    Product title #####
                  </Typography>
                  <Typography style={{ marginLeft: "20px" }} variant="h6">
                    ₹454
                  </Typography>
                </div>
                {/* <Skeleton />
                <Skeleton animation="wave" />
                <Skeleton animation={false} /> */}
              </Box>
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default TopNew;
