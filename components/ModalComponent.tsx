// geral
import React, { useState } from "react";
import Modal from "react-modal";
import ModalNotificacoes from "../components/ModalNotificacoes";

//icons react
import { SlArrowLeft } from "react-icons/sl";
import { FaRegUser, FaCheck } from "react-icons/fa6";

//css
import styles from "../styles/ModalPerfil.module.css";
import zIndex from "@mui/material/styles/zIndex";

Modal.setAppElement("#__next");

const ModalComponent = () => {
  const [modalIsOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className={styles.Modal}>
      <button className={styles.buttonOpen} onClick={openModal}>
        <img className={styles.imgButtonOpen} src="./images/chapeu.png" />
      </button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className={styles.modalView}>
          <button className={styles.buttonVoltar} onClick={closeModal}>
            <SlArrowLeft /> Voltar
          </button>

          <div className={styles.buttons}>
            <button className={styles.button}>
              <img className={styles.icon} src="./images/perfil.png" />
              <div className={styles.text}>
                <h2 className={styles.h2}>Editar perfil</h2>
                <p className={styles.p}>Vizualize e edite suas informações pessoais.</p>
              </div>
            </button>
            
            <button className={styles.button}>
                <ModalNotificacoes/>
            </button>

            <button className={styles.button}>
              <img className={styles.icon} src="./images/folha.png" />
              <div className={styles.text}>
                <h2 className={styles.h2}>Minhas Propriedades</h2>
                <p className={styles.p}>Vizualize e edite suas propriedades.</p>
              </div>
            </button>

            <button className={styles.button}>
              <img className={styles.icon} src="./images/chat.png" />
              <div className={styles.text}>
                <h2 className={styles.h2}>Fale Conosco</h2>
                <p className={styles.p}>Entre em contato com a nossa equipe.</p>
              </div>
            </button>

            <button className={styles.button}>
              <img className={styles.icon} src="./images/duvida.png" />
              <div className={styles.text}>
                <h2 className={styles.h2}>Perguntas Frequentes</h2>
                <p className={styles.p}>Acesse nossa central de ajuda.</p>
              </div>
            </button>

            <button className={styles.button}>
              <img className={styles.icon} src="./images/lixeira.png" />
              <div className={styles.text}>
                <h2 className={styles.h2}>Excluir conta</h2>
                <p className={styles.p}>Clique aqui para excluir sua conta.</p>
              </div>
            </button>
          </div>

          <button className={styles.buttonSair} onClick={closeModal}>
            Sair da conta
          </button>
        </div>
      </Modal>
    </div>
  );
};

const customStyles = {
  content: {
    top: "0",
    right: "0",
    left: "auto",
    bottom: "auto",
    boxShadow: "-10px 10px 30px rgba(0, 0, 0, 0.1)",
    borderRadius: "0 0 0 35px",
    backgroundColor: "transparent",
    border: "none",
    outline: "none",
    padding: 0,
    margin: 0,
    zIndex: 20,
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    backdropFilter: "blur(2px)",
    WebkitBackdropFilter: "blur(2px)",
  },
};

export default ModalComponent;
