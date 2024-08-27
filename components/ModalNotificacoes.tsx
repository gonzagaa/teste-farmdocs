// geral
import React, { useState } from "react";
import Modal from "react-modal";

//icons react
import { IoCloseOutline } from "react-icons/io5";

//css
import styles from "../styles/ModalNotificacoes.module.css";

Modal.setAppElement("#__next");

const ModalNotificacoes = () => {
  const [modalIsOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className={styles.Modal}>
      <button className={styles.button} onClick={openModal}>
      <img className={styles.icon} src="./images/notificacao.png" />
        <div className={styles.text}>
            <h2 className={styles.h2}>Notificações</h2>
            <p className={styles.p}>Clique para vizualizar suas notificações.</p>
        </div>
      </button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className={styles.modalView}>
          <div className={styles.header}>
            <div>
                <h2 className={styles.h2}>Notificações</h2>
                <p className={styles.p}>Acompanhe seus vencimentos aqui</p>
            </div>

            <button className={styles.button} onClick={closeModal}>
            <IoCloseOutline />
            </button>
          </div>

          <div className={styles.content}>
                <h3 className={styles.h3}>Você ainda não possui nenhuma notificação</h3>
            </div>
        </div>
      </Modal>
    </div>
  );
};

const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        outline: "none",
        padding: 0,
        margin: 0,
        borderRadius: "20px",
        backgroundColor: "transparent",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        border: "none",
      },
      overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.10)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      },
};

export default ModalNotificacoes;
