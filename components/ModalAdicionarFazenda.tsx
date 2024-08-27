// geral
import React, { useState } from "react";
import Modal from "react-modal";

//icons react
import { IoCloseOutline } from "react-icons/io5";

//css
import styles from "../styles/ModalAdicionarFazenda.module.css";
import { Transition } from "react-spring";
import zIndex from "@mui/material/styles/zIndex";

Modal.setAppElement("#__next");

const ModalAdicionarFazenda = () => {
  const [modalIsOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className={styles.Modal}>
      <button className={styles.buttonAdicionar} onClick={openModal}>
        <img className={styles.icon} src="./images/adicionar.png" />
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
                <h2 className={styles.h2}>Adicionar Fazenda</h2>
                <p className={styles.p}>Preencha os campos abaixo para adicionar uma nova fazenda</p>
            </div>

            <button className={styles.button} onClick={closeModal}>
            <IoCloseOutline />
          </button>
          </div>

          <form className={styles.form}>
            <div className={styles.input}>
                <label className={styles.inputLabel}>
                Nome da Fazenda
                </label>
                <input
                type="text"
                className={styles.inputText}
                placeholder="Insira aqui o nome da fazenda"
                />
            </div>

            <div className={styles.input}>
                <label className={styles.inputLabel}>
                CAR
                </label>
                <div className={styles.input}>
                <label className={styles.fileLabel}>
                    <input type="file" className={styles.fileInput} />
                    <span className={styles.inputPlaceHolder}>Clique para adicionar o CAR</span>
                </label>
                </div>
            </div>

            <div className={styles.input}>
                <label className={styles.inputLabel}>
                CCIR
                </label>
                <div className={styles.input}>
                <label className={styles.fileLabel}>
                    <input type="file" className={styles.fileInput} />
                    <span className={styles.inputPlaceHolder}>Clique para adicionar o CCIR</span>
                </label>
                </div>
            </div>

            <div className={styles.input}>
                <label className={styles.inputLabel}>
                ITR
                </label>
                <div className={styles.input}>
                <label className={styles.fileLabel}>
                    <input type="file" className={styles.fileInput} />
                    <span className={styles.inputPlaceHolder}>Clique para adicionar o ITR</span>
                </label>
                </div>
            </div>

            <div className={styles.input}>
                <label className={styles.inputLabel}>
                Inscrição Estadual
                </label>
                <div className={styles.input}>
                <label className={styles.fileLabel}>
                    <input type="file" className={styles.fileInput} />
                    <span className={styles.inputPlaceHolder}>Clique para adicionar a inscrição estadual</span>
                </label>
                </div>
            </div>

            <div className={styles.input}>
                <label className={styles.inputLabel}>
                Contrato de arrendamento
                </label>
                <div className={styles.input}>
                <label className={styles.fileLabel}>
                    <input type="file" className={styles.fileInput} />
                    <span className={styles.inputPlaceHolder}>Clique para adicionar o contrato de arrendamento</span>
                </label>
                </div>
            </div>

            <div className={styles.input}>
                <label className={styles.inputLabel}>
                Imagem da fazenda
                </label>
                <div className={styles.input}>
                <label className={styles.fileLabel}>
                    <input type="file" className={styles.fileInput} />
                    <span className={styles.inputPlaceHolder}>Clique para adicionar fotos da sua fazenda</span>
                </label>
                </div>
            </div>

            <button className={styles.button}>
                Adicionar
            </button>
          </form>
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

export default ModalAdicionarFazenda;
