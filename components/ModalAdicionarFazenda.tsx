import React, { useState } from "react";
import Modal from "react-modal";
import { IoCloseOutline } from "react-icons/io5";
import styles from "../styles/ModalAdicionarFazenda.module.css";
import { storage } from "../services/firebase"; // Assumindo que você tem a configuração do Firebase similar à da mobile
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addFazenda } from "../firestore/fazendas/controller/fazenda.controller"; // Função para adicionar fazenda
import { AddFazendaDTO } from "../firestore/fazendas/dto/fazendas.dto";
import { getAuth } from "firebase/auth";

Modal.setAppElement("#__next");

const ModalAdicionarFazenda = () => {
  const [modalIsOpen, setIsOpen] = useState(false);

  const auth = getAuth();
  const currentUser = auth.currentUser;

  const [createFazenda, setCreateFazenda] = useState<AddFazendaDTO>({
    name: "",
    creatorId: currentUser?.uid || "", // Preencha o creatorId com o uid do usuário autenticado
    thumbnail: "",
    carURL: "",
    ccirURL: "",
    itrURL: "",
    inscricaoEstadualURL: "",
    contratoArrendamentoURL: "",
  });

  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [uploadingFields, setUploadingFields] = useState<{ [key: string]: boolean }>({});

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleFileSelect = async (field: string, file: File) => {
    try {
      setUploadingFields((prevState) => ({ ...prevState, [field]: true }));

      const storageRef = ref(storage, `uploads/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress((prevState) => ({
            ...prevState,
            [field]: progress,
          }));
        },
        (error) => console.error("File upload error:", error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setCreateFazenda((prevState) => ({
              ...prevState,
              [`${field}URL`]: downloadURL,
              ...(field === "thumbnail" && { thumbnail: downloadURL }), // Atribua a URL ao campo `thumbnail`
            }));
            setUploadingFields((prevState) => ({ ...prevState, [field]: false }));
          });
        }
      );
    } catch (error) {
      console.error("File upload error:", error);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Adicionando a fazenda no Firebase
    await addFazenda(createFazenda).then((res) => {
      if (res) {
        setCreateFazenda({
          name: "",
          creatorId: currentUser?.uid || "", // Reatribua o creatorId
          thumbnail: "",
          carURL: "",
          ccirURL: "",
          itrURL: "",
          inscricaoEstadualURL: "",
          contratoArrendamentoURL: "",
        });
        setUploadProgress({});
        setUploadingFields({});
        closeModal();
      }
    });
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
        contentLabel="Adicionar Fazenda"
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

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.input}>
              <label className={styles.inputLabel}>Nome da Fazenda</label>
              <input
                type="text"
                className={styles.inputText}
                placeholder="Insira aqui o nome da fazenda"
                onChange={(e) => setCreateFazenda({ ...createFazenda, name: e.target.value })}
                value={createFazenda.name}
              />
            </div>

            {["car", "ccir", "itr", "inscricaoEstadual", "contratoArrendamento", "thumbnail"].map((field) => (
              <div key={field} className={styles.input}>
                <label className={styles.inputLabel}>
                  {field === "car" ? "CAR" : field === "ccir" ? "CCIR" : field === "itr" ? "ITR" : field === "inscricaoEstadual" ? "Inscrição Estadual" : field === "contratoArrendamento" ? "Contrato de Arrendamento" : "Imagem da Fazenda"}
                </label>
                <div className={styles.input}>
                  <label className={styles.fileLabel}>
                    <input
                      type="file"
                      className={styles.fileInput}
                      onChange={(e) => handleFileSelect(field, e.target.files[0])}
                    />
                    <span className={styles.inputPlaceHolder}>
                      {uploadingFields[field]
                        ? `Fazendo upload ${uploadProgress[field] ? `${uploadProgress[field].toFixed(0)}%` : ""}`
                        : createFazenda[`${field}URL`]
                        ? "Arquivo adicionado na nuvem ✅"
                        : `Clique para adicionar o ${field === "car" ? "CAR" : field === "ccir" ? "CCIR" : field === "itr" ? "ITR" : field === "inscricaoEstadual" ? "Inscrição Estadual" : field === "contratoArrendamento" ? "Contrato de Arrendamento" : "Imagem da Fazenda"}`}
                    </span>
                  </label>
                </div>
              </div>
            ))}

            <button type="submit" className={styles.button}>
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
