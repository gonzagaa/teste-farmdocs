import React from 'react';
import styles from "../styles/ModalCertidoes.module.css";


const ModalEmbargos = ({ show, onClose, children }) => {
  if (!show) {
    return null;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default ModalEmbargos;