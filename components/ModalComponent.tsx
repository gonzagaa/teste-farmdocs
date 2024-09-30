import React, { useState } from "react";
import Modal from "react-modal";
import ModalNotificacoes from "../components/ModalNotificacoes";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { useRouter } from "next/router"; // Importando useRouter do Next.js

import { SlArrowLeft } from "react-icons/sl";
import styles from "../styles/ModalPerfil.module.css";

Modal.setAppElement("#__next");

const ModalComponent = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const router = useRouter(); // Instanciando o router

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      closeModal();
      router.push("/"); // Usando router.push para redirecionar para a página de login
    } catch (error) {
      console.error("Erro ao sair da conta:", error);
      alert("Erro ao sair da conta. Tente novamente.");
    }
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
              <ModalNotificacoes />
            </button>

            <button className={styles.button} onClick={closeModal}>
              <img className={styles.icon} src="./images/folha.png" />
              <div className={styles.text}>
                <h2 className={styles.h2}>Minhas Propriedades</h2>
                <p className={styles.p}>Vizualize e edite suas propriedades.</p>
              </div>
            </button>

            <button
              className={styles.button}
              onClick={() =>
                window.location.href =
                  "https://wa.me/5511915799139?text=Ol%C3%A1,%20preciso%20de%20ajuda%20com%20o%20Farm%20Docs%20%F0%9F%8C%BE"
              }
            >
              <img className={styles.icon} src="./images/chat.png" />
              <div className={styles.text}>
                <h2 className={styles.h2}>Fale Conosco</h2>
                <p className={styles.p}>Entre em contato com a nossa equipe.</p>
              </div>
            </button>

            <button
              className={styles.button}
              onClick={() =>
                window.location.href = "https://www.forfarmdocs.com/#faq"
              }
            >
              <img className={styles.icon} src="./images/duvida.png" />
              <div className={styles.text}>
                <h2 className={styles.h2}>Perguntas Frequentes</h2>
                <p className={styles.p}>Acesse nossa central de ajuda.</p>
              </div>
            </button>
          </div>

          <button className={styles.buttonSair} onClick={handleSignOut}>
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
