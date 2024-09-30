import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { IoCloseOutline } from "react-icons/io5";
import styles from "../styles/ModalNotificacoes.module.css";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../services/firebase";
import moment from "moment";

Modal.setAppElement("#__next");

const ModalNotificacoes = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchNotifications = async () => {
      if (currentUser) {
        const notificationsQuery = query(
          collection(db, "Notification"),
          where("creatorId", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(notificationsQuery);
        const fetchedNotifications = querySnapshot.docs.map((doc) => doc.data());

        // Filtrando e classificando as notificações conforme solicitado
        const filteredNotifications = fetchedNotifications.filter((notification) => {
          const daysUntilDue = moment(notification.vencimento).diff(moment(), 'days');
          return daysUntilDue <= 7 || daysUntilDue < 0;
        });

        setNotifications(filteredNotifications);
      }
    };

    fetchNotifications();
  }, [currentUser]);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const getVencimentoStyle = (vencimento) => {
    const daysUntilDue = moment(vencimento).diff(moment(), 'days');
    if (daysUntilDue < 0) {
      return { style: styles.vencimentoOverdue, text: `Vencido há: ${Math.abs(daysUntilDue)} dias` };
    } else if (daysUntilDue <= 7) {
      return { style: styles.vencimentoWarning, text: `Vencimento em: ${daysUntilDue} dias` };
    }
    return { style: "", text: "" };
  };

  return (
    <div className={styles.Modal}>
      <button className={styles.button} onClick={openModal}>
        <img className={styles.icon} src="./images/notificacao.png" />
        <div className={styles.text}>
          <h2 className={styles.h2}>Notificações</h2>
          <p className={styles.p}>Clique para visualizar suas notificações.</p>
        </div>
      </button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Notificações"
      >
        <div className={styles.modalView}>
          <div className={styles.header}>
            <div>
              <h2 className={styles.h2}>Notificações</h2>
              <p className={styles.p}>Acompanhe seus vencimentos aqui</p>
            </div>

            <button className={styles.closeButton} onClick={closeModal}>
              <IoCloseOutline />
            </button>
          </div>

          <div className={styles.scrollContainer}>
            {notifications.length > 0 ? (
              <ul className={styles.notificationList}>
                {notifications.map((notification, index) => {
                  const vencimentoInfo = getVencimentoStyle(notification.vencimento);
                  return (
                    <li key={index} className={styles.notificationItem}>
                      <h3 className={styles.fazendaName}>
                        <strong>{notification.fazendaName}</strong>
                      </h3>
                      <h3 className={styles.notificationTitle}>{notification.title}</h3>
                      <p className={styles.notificationText}>
                        {notification.description.replace(
                          /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)/,
                          moment(notification.vencimento).format("DD/MM/YYYY")
                        )}
                      </p>
                      <p className={`${styles.notificationAlertDate} ${vencimentoInfo.style}`}>
                        {vencimentoInfo.text} ({moment(notification.vencimento).format("DD/MM/YYYY")})
                      </p>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <h3 className={styles.h3}>Você ainda não possui nenhuma notificação</h3>
            )}
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
