import React from "react";
import styles from "./loading.module.css";

export default function Loading() {
  return (
    <div>
      <div className={styles.spinnerBox}>
        <div className={styles.configureBorder1}>
          <div className={styles.configureCore}></div>
        </div>
        <div className={styles.configureBorder2}>
          <div className={styles.configureCore}></div>
        </div>
      </div>
    </div>
  );
}
