import styles from '../styles/Fazenda.module.css';
import Head from 'next/head';
import { SlArrowLeft } from "react-icons/sl";
import { FaTrashAlt } from "react-icons/fa";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getFazendaById } from '../firestore/fazendas/controller/fazenda.controller';
import { FazendaDTO } from '../firestore/fazendas/dto/fazendas.dto';
import ModalComponent from '../components/ModalComponent';
import ModalDocumentos from '../components/ModalDocumentos';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, addDoc, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import moment from 'moment';
import { auth, db, storage } from '../services/firebase';
import { ADDNotificationDTO } from '../firestore/notification/dto/notification';

const Fazenda = () => {
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [fazenda, setFazenda] = useState<FazendaDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
    const [uploading, setUploading] = useState(false);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (id) {
            const fetchFazenda = async () => {
                const fetchedFazenda = await getFazendaById(id as string);
                setFazenda(fetchedFazenda);
                setLoading(false);
            };
            fetchFazenda();
        }
    }, [id]);

    const handleCardClick = async (modalId: string, collectionName: string) => {
        setActiveModal(modalId);
        await fetchUploadedFiles(collectionName);
    };

    const handleCloseModal = () => {
        setActiveModal(null);
        setUploadedFiles([]);
    };

    const fetchUploadedFiles = async (collectionName: string) => {
        if (id) {
            const filesQuery = query(collection(db, collectionName), where("fazendaId", "==", id));
            const querySnapshot = await getDocs(filesQuery);
            const files = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUploadedFiles(files);
        }
    };

    const handleDeleteFile = async (fileId: string, fileURL: string, collectionName: string) => {
        try {
            const fileRef = ref(storage, fileURL);
            await deleteObject(fileRef);

            const fileDocRef = doc(db, collectionName, fileId);
            await deleteDoc(fileDocRef);

            setUploadedFiles(uploadedFiles.filter(file => file.id !== fileId));
        } catch (error) {
            console.error("Erro ao deletar documento:", error);
            alert("Erro ao deletar o documento. Tente novamente.");
        }
    };

    const [notificacoesAtivadas, setNotificacoesAtivadas] = useState(false);

    const toggleNotificacoes = () => {
        setNotificacoesAtivadas(!notificacoesAtivadas);
    };

    const [jurosTipo, setJurosTipo] = useState('A.M.');

    const toggleJurosTipo = () => {
        setJurosTipo(jurosTipo === 'A.M.' ? 'A.A.' : 'A.M.');
    };

    const formatVencimentoInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value.replace(/\D/g, '');
        if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2);
        }
        if (value.length > 5) {
            value = value.substring(0, 5) + '/' + value.substring(5);
        }
        event.target.value = value;
    };

    const saveDocumentData = async (collectionName: string, data: any, file: File, fileName: string) => {
        try {
            setUploading(true);
            const storageRef = ref(storage, `uploads/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed', null, (error) => {
                console.error("Erro no upload:", error);
            });

            await uploadTask;

            const downloadURL = await getDownloadURL(storageRef);
            
            const currentUser = auth.currentUser;

            // Convertendo o vencimento para ISO string
            const formattedData = {
                ...data,
                vencimento: moment(data.vencimento, 'DD/MM/YYYY').toISOString(),
                fileURL: downloadURL,
                fileName: fileName,
                fazendaId: id as string,
                creatorId: currentUser?.uid,
                createdAt: moment().toISOString(),
                updatedAt: moment().toISOString(),
            };

            await addDoc(collection(db, collectionName), formattedData);

            if (notificacoesAtivadas) {
                const notificationData = new ADDNotificationDTO(
                    data.notify_at,
                    id as string,
                    fazenda?.name || '',
                    currentUser?.uid || '',
                    fileName,
                    formattedData.vencimento,
                    `Você tem um documento prestes a vencer: ${fileName}`,
                    `O documento ${fileName} vence em ${formattedData.vencimento}.`
                );

                await addDoc(collection(db, 'Notification'), {
                    ...notificationData
                });
            }

            setUploading(false);
            return downloadURL;
        } catch (error) {
            setUploading(false);
            console.error("Erro ao salvar documento:", error);
            throw error;
        }
    };

    const handleDocumentClick = (url: string) => {
        if (url) {
            window.open(url, '_blank');
        } else {
            alert("Documento não encontrado.");
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>ForFarmDocs - {fazenda?.name || 'Fazenda'}</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"></link>
            </Head>

            <main className={styles.wrapper}>
                <div className={styles.content}>
                    <div className={styles.header}>
                        <div className={styles.headText}>
                            <a className={styles.a} href='/Home'>
                                <SlArrowLeft className={styles.iconArrow} />
                                Voltar
                            </a>
                            <h2 className={styles.h2}>
                                <span className={styles.h2Span}>Fazenda</span> {fazenda?.name}
                            </h2>
                        </div>

                        <div className={styles.boxCarinha}>
                            <a>
                                <ModalComponent />
                            </a>
                        </div>
                    </div>

                    <div className={styles.licencas}>
                        <div className={styles.head}>
                            <h2 className={styles.h2}>Licenças</h2>
                            <p className={styles.p}>Clique para visualizar ou adicionar novas licenças</p>
                        </div>

                        <div className={styles.cards}>
                            <div className={styles.card} onClick={() => handleCardClick('modalIrrigacao', 'RIPS')}>
                                <img className={styles.icon} src="/images/icons/registro.png" />
                                <h3 className={styles.h3}>Registro de Irrigação pecuária e sequeiro.</h3>
                            </div>

                            <div className={styles.card} onClick={() => handleCardClick('modalBarragens', 'CLB')}>
                                <img className={styles.icon} src="/images/icons/cadastro.png" />
                                <h3 className={styles.h3}>Cadastro e licença de barragens.</h3>
                            </div>

                            <div className={styles.card} onClick={() => handleCardClick('modalOutorgas', 'OUA')}>
                                <img className={styles.icon} src="/images/icons/outorga.png" />
                                <h3 className={styles.h3}>Outorgas do uso de água.</h3>
                            </div>

                            <div className={styles.card} onClick={() => handleCardClick('modalBovinocultura', 'LBS')}>
                                <img className={styles.icon} src="/images/icons/licenca.png" />
                                <h3 className={styles.h3}>Licenças bovinocultura.</h3>
                            </div>

                            <div className={styles.card} onClick={() => handleCardClick('modalDeclaracoesDiversas', 'DD')}>
                                <img className={styles.icon} src="/images/icons/declaracoes.png" />
                                <h3 className={styles.h3}>Declarações diversas.</h3>
                            </div>

                            <div className={styles.card} onClick={() => handleCardClick('modalSupressaoVegetal', 'LSV')}>
                                <img className={styles.icon} src="/images/icons/vegetal.png" />
                                <h3 className={styles.h3}>Licenças de supressão vegetal.</h3>
                            </div>
                        </div>
                    </div>

                    <div className={styles.diversos}>
                        <div className={styles.head}>
                            <h2 className={styles.h2}>Diversos</h2>
                            <p className={styles.p}>Selecione uma das opções abaixo para executar uma ação.</p>
                        </div>

                        <div className={styles.cards}>
                            <div className={styles.card} onClick={() => handleCardClick('modalMapas', 'KML')}>
                                <img className={styles.icon} src="/images/icons/mapa.png" />
                                <h3 className={styles.h3}>Mapa e geo-referenciamento.</h3>
                            </div>

                            <div className={styles.card} onClick={() => handleCardClick('modalCertidoes', 'Certidoes')}>
                                <img className={styles.icon} src="/images/icons/certidoes.png" />
                                <h3 className={styles.h3}>Certidões CCIR, ITR e outros..</h3>
                            </div>

                            <div className={styles.card} onClick={() => handleCardClick('modalConsultar', 'Consultar')}>
                                <img className={styles.icon} src="/images/icons/consultar.png" />
                                <h3 className={styles.h3}>Consultar embargos.</h3>
                            </div>

                            <div className={styles.card} onClick={() => handleCardClick('modalDocumentos', 'DC')}>
                                <img className={styles.icon} src="/images/icons/documentos.png" />
                                <h3 className={styles.h3}>Documentos complementares.</h3>
                            </div>

                            <div className={styles.card} onClick={() => handleCardClick('modalCreditos', 'CF')}>
                                <img className={styles.icon} src="/images/icons/creditos.png" />
                                <h3 className={styles.h3}>Créditos e financiamentos.</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modais Licencas */}
                <ModalDocumentos show={activeModal === 'modalIrrigacao'} onClose={handleCloseModal}>
                    <div className={styles.head}>
                        <h2 className={styles.h2}>Registro de Irrigação pecuária e sequeiro.</h2>
                    </div>

                    <div>
                        <h3>Documentos Carregados:</h3>
                        <ul className={styles.documentList}>
                            {uploadedFiles.map((file, index) => (
                                <li key={index} className={styles.documentItem}>
                                    <a className={styles.h3Span} href={file.fileURL} target="_blank" rel="noopener noreferrer">
                                        {file.processo} - {moment(file.vencimento).format('DD/MM/YYYY')}
                                    </a>
                                    <FaTrashAlt
                                        className={styles.deleteIcon}
                                        onClick={() => handleDeleteFile(file.id, file.fileURL, 'RIPS')}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>

                    <form className={styles.form} onSubmit={async (e) => {
                        e.preventDefault();
                        const fileInput = document.getElementById('fileUploadIrrigacao') as HTMLInputElement;
                        if (fileInput && fileInput.files && fileInput.files.length > 0) {
                            const file = fileInput.files[0];
                            const data = {
                                processo: (document.getElementById('processoIrrigacao') as HTMLInputElement).value,
                                registro: (document.getElementById('registroIrrigacao') as HTMLInputElement).value,
                                vencimento: (document.getElementById('vencimentoIrrigacao') as HTMLInputElement).value,
                                notify_at: notificacoesAtivadas ? moment((document.getElementById('vencimentoIrrigacao') as HTMLInputElement).value, 'DD/MM/YYYY').subtract(Number((document.getElementById('prazoIrrigacao') as HTMLSelectElement).value), 'days').toISOString() : null,
                            };
                            await saveDocumentData('RIPS', data, file, 'Registro de Irrigação pecuária e sequeiro.');
                            handleCloseModal();
                        }
                    }}>
                        <div>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Nº do processo"
                                id="processoIrrigacao"
                            />
                        </div>

                        <div>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Nº da licença"
                                id="registroIrrigacao"
                            />
                        </div>

                        <div>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Data de vencimento"
                                id="vencimentoIrrigacao"
                                onChange={formatVencimentoInput}
                                maxLength={10}
                            />
                        </div>

                        <div className={styles.toggleContainer}>
                            <label className={styles.inputLabel}>
                                Ativar notificações
                            </label>
                            <input
                                type="checkbox"
                                className={styles.toggle}
                                checked={notificacoesAtivadas}
                                onChange={toggleNotificacoes}
                            />
                        </div>

                        {notificacoesAtivadas && (
                            <div>
                                <select className={styles.input} id="prazoIrrigacao">
                                    <option value="" disabled selected>
                                        Selecione o prazo de notificações
                                    </option>
                                    <option value="7">7 dias</option>
                                    <option value="30">30 dias</option>
                                    <option value="60">60 dias</option>
                                    <option value="90">90 dias</option>
                                    <option value="180">180 dias</option>
                                </select>
                            </div>
                        )}

                        <input
                            type="file"
                            id="fileUploadIrrigacao"
                            className={styles.fileInput}
                        />
                        <label htmlFor="fileUploadIrrigacao" className={styles.uploadButton}>
                            {uploading ? 'Carregando...' : 'Anexar Arquivo'}
                        </label>
                        <button type="submit" className={styles.uploadButton} disabled={uploading}>
                            {uploading ? 'Salvando...' : 'Salvar'}
                        </button>
                    </form>
                </ModalDocumentos>

                <ModalDocumentos show={activeModal === 'modalBarragens'} onClose={handleCloseModal}>
                    <div className={styles.head}>
                        <h2 className={styles.h2}>Cadastro e licença de barragens.</h2>
                    </div>

                    <div>
                        <h3>Documentos Carregados:</h3>
                        <ul className={styles.documentList}>
                            {uploadedFiles.map((file, index) => (
                                <li key={index} className={styles.documentItem}>
                                    <a className={styles.h3Span} href={file.fileURL} target="_blank" rel="noopener noreferrer">
                                        {file.processo} - {moment(file.vencimento).format('DD/MM/YYYY')}
                                    </a>
                                    <FaTrashAlt
                                        className={styles.deleteIcon}
                                        onClick={() => handleDeleteFile(file.id, file.fileURL, 'CLB')}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>

                    <form className={styles.form} onSubmit={async (e) => {
                        e.preventDefault();
                        const fileInput = document.getElementById('fileUploadBarragens') as HTMLInputElement;
                        if (fileInput && fileInput.files && fileInput.files.length > 0) {
                            const file = fileInput.files[0];
                            const data = {
                                processo: (document.getElementById('processoBarragens') as HTMLInputElement).value,
                                registro: (document.getElementById('registroBarragens') as HTMLInputElement).value,
                                vencimento: (document.getElementById('vencimentoBarragens') as HTMLInputElement).value,
                                notify_at: notificacoesAtivadas ? moment((document.getElementById('vencimentoBarragens') as HTMLInputElement).value, 'DD/MM/YYYY').subtract(Number((document.getElementById('prazoBarragens') as HTMLSelectElement).value), 'days').toISOString() : null,
                            };
                            await saveDocumentData('CLB', data, file, 'Cadastro e licença de barragens.');
                            handleCloseModal();
                        }
                    }}>
                        <div>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Nº do processo"
                                id="processoBarragens"
                            />
                        </div>

                        <div>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Nº da licença"
                                id="registroBarragens"
                            />
                        </div>

                        <div>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Data de vencimento"
                                id="vencimentoBarragens"
                                onChange={formatVencimentoInput}
                                maxLength={10}
                            />
                        </div>

                        <div className={styles.toggleContainer}>
                            <label className={styles.inputLabel}>
                                Ativar notificações
                            </label>
                            <input
                                type="checkbox"
                                className={styles.toggle}
                                checked={notificacoesAtivadas}
                                onChange={toggleNotificacoes}
                            />
                        </div>

                        {notificacoesAtivadas && (
                            <div>
                                <select className={styles.input} id="prazoBarragens">
                                    <option value="" disabled selected>
                                        Selecione o prazo de notificações
                                    </option>
                                    <option value="7">7 dias</option>
                                    <option value="30">30 dias</option>
                                    <option value="60">60 dias</option>
                                    <option value="90">90 dias</option>
                                    <option value="180">180 dias</option>
                                </select>
                            </div>
                        )}

                        <input
                            type="file"
                            id="fileUploadBarragens"
                            className={styles.fileInput}
                        />
                        <label htmlFor="fileUploadBarragens" className={styles.uploadButton}>
                            {uploading ? 'Carregando...' : 'Anexar Arquivo'}
                        </label>
                        <button type="submit" className={styles.uploadButton} disabled={uploading}>
                            {uploading ? 'Salvando...' : 'Salvar'}
                        </button>
                    </form>
                </ModalDocumentos>

                <ModalDocumentos show={activeModal === 'modalOutorgas'} onClose={handleCloseModal}>
                    <div className={styles.head}>
                        <h2 className={styles.h2}>Outorgas do uso de água.</h2>
                    </div>

                    <div>
                        <h3>Documentos Carregados:</h3>
                        <ul className={styles.documentList}>
                            {uploadedFiles.map((file, index) => (
                                <li key={index} className={styles.documentItem}>
                                    <a className={styles.h3Span} href={file.fileURL} target="_blank" rel="noopener noreferrer">
                                        {file.processo} - {moment(file.vencimento).format('DD/MM/YYYY')}
                                    </a>
                                    <FaTrashAlt
                                        className={styles.deleteIcon}
                                        onClick={() => handleDeleteFile(file.id, file.fileURL, 'OUA')}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>

                    <form className={styles.form} onSubmit={async (e) => {
                        e.preventDefault();
                        const fileInput = document.getElementById('fileUploadOutorgas') as HTMLInputElement;
                        if (fileInput && fileInput.files && fileInput.files.length > 0) {
                            const file = fileInput.files[0];
                            const data = {
                                processo: (document.getElementById('processoOutorgas') as HTMLInputElement).value,
                                registro: (document.getElementById('registroOutorgas') as HTMLInputElement).value,
                                vencimento: (document.getElementById('vencimentoOutorgas') as HTMLInputElement).value,
                                notify_at: notificacoesAtivadas ? moment((document.getElementById('vencimentoOutorgas') as HTMLInputElement).value, 'DD/MM/YYYY').subtract(Number((document.getElementById('prazoOutorgas') as HTMLSelectElement).value), 'days').toISOString() : null,
                            };
                            await saveDocumentData('OUA', data, file, 'Outorgas do uso de água.');
                            handleCloseModal();
                        }
                    }}>
                        <div>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Nº do processo"
                                id="processoOutorgas"
                            />
                        </div>

                        <div>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Nº da portaria"
                                id="registroOutorgas"
                            />
                        </div>

                        <div>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Data de vencimento"
                                id="vencimentoOutorgas"
                                onChange={formatVencimentoInput}
                                maxLength={10}
                            />
                        </div>

                        <div className={styles.toggleContainer}>
                            <label className={styles.inputLabel}>
                                Ativar notificações
                            </label>
                            <input
                                type="checkbox"
                                className={styles.toggle}
                                checked={notificacoesAtivadas}
                                onChange={toggleNotificacoes}
                            />
                        </div>

                        {notificacoesAtivadas && (
                            <div>
                                <select className={styles.input} id="prazoOutorgas">
                                    <option value="" disabled selected>
                                        Selecione o prazo de notificações
                                    </option>
                                    <option value="7">7 dias</option>
                                    <option value="30">30 dias</option>
                                    <option value="60">60 dias</option>
                                    <option value="90">90 dias</option>
                                    <option value="180">180 dias</option>
                                </select>
                            </div>
                        )}

                        <input
                            type="file"
                            id="fileUploadOutorgas"
                            className={styles.fileInput}
                        />
                        <label htmlFor="fileUploadOutorgas" className={styles.uploadButton}>
                            {uploading ? 'Carregando...' : 'Anexar Arquivo'}
                        </label>
                        <button type="submit" className={styles.uploadButton} disabled={uploading}>
                            {uploading ? 'Salvando...' : 'Salvar'}
                        </button>
                    </form>
                </ModalDocumentos>

                <ModalDocumentos show={activeModal === 'modalBovinocultura'} onClose={handleCloseModal}>
                    <div className={styles.head}>
                        <h2 className={styles.h2}>Licenças bovinocultura.</h2>
                    </div>

                    <div>
                        <h3>Documentos Carregados:</h3>
                        <ul className={styles.documentList}>
                            {uploadedFiles.map((file, index) => (
                                <li key={index} className={styles.documentItem}>
                                    <a className={styles.h3Span} href={file.fileURL} target="_blank" rel="noopener noreferrer">
                                        {file.processo} - {moment(file.vencimento).format('DD/MM/YYYY')}
                                    </a>
                                    <FaTrashAlt
                                        className={styles.deleteIcon}
                                        onClick={() => handleDeleteFile(file.id, file.fileURL, 'LBS')}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>

                    <form className={styles.form} onSubmit={async (e) => {
                        e.preventDefault();
                        const fileInput = document.getElementById('fileUploadBovinocultura') as HTMLInputElement;
                        if (fileInput && fileInput.files && fileInput.files.length > 0) {
                            const file = fileInput.files[0];
                            const data = {
                                processo: (document.getElementById('processoBovinocultura') as HTMLInputElement).value,
                                registro: (document.getElementById('registroBovinocultura') as HTMLInputElement).value,
                                vencimento: (document.getElementById('vencimentoBovinocultura') as HTMLInputElement).value,
                                notify_at: notificacoesAtivadas ? moment((document.getElementById('vencimentoBovinocultura') as HTMLInputElement).value, 'DD/MM/YYYY').subtract(Number((document.getElementById('prazoBovinocultura') as HTMLSelectElement).value), 'days').toISOString() : null,
                            };
                            await saveDocumentData('LBS', data, file, 'Licenças bovinocultura.');
                            handleCloseModal();
                        }
                    }}>
                        <div>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Nº do processo"
                                id="processoBovinocultura"
                            />
                        </div>

                        <div>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Nº da licença"
                                id="registroBovinocultura"
                            />
                        </div>

                        <div>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Data de vencimento"
                                id="vencimentoBovinocultura"
                                onChange={formatVencimentoInput}
                                maxLength={10}
                            />
                        </div>

                        <div className={styles.toggleContainer}>
                            <label className={styles.inputLabel}>
                                Ativar notificações
                            </label>
                            <input
                                type="checkbox"
                                className={styles.toggle}
                                checked={notificacoesAtivadas}
                                onChange={toggleNotificacoes}
                            />
                        </div>

                        {notificacoesAtivadas && (
                            <div>
                                <select className={styles.input} id="prazoBovinocultura">
                                    <option value="" disabled selected>
                                        Selecione o prazo de notificações
                                    </option>
                                    <option value="7">7 dias</option>
                                    <option value="30">30 dias</option>
                                    <option value="60">60 dias</option>
                                    <option value="90">90 dias</option>
                                    <option value="180">180 dias</option>
                                </select>
                            </div>
                        )}

                        <input
                            type="file"
                            id="fileUploadBovinocultura"
                            className={styles.fileInput}
                        />
                        <label htmlFor="fileUploadBovinocultura" className={styles.uploadButton}>
                            {uploading ? 'Carregando...' : 'Anexar Arquivo'}
                        </label>
                        <button type="submit" className={styles.uploadButton} disabled={uploading}>
                            {uploading ? 'Salvando...' : 'Salvar'}
                        </button>
                    </form>
                </ModalDocumentos>

                <ModalDocumentos show={activeModal === 'modalDeclaracoesDiversas'} onClose={handleCloseModal}>
                    <div className={styles.head}>
                        <h2 className={styles.h2}>Declarações diversas.</h2>
                    </div>

                    <div>
                        <h3>Documentos Carregados:</h3>
                        <ul className={styles.documentList}>
                            {uploadedFiles.map((file, index) => (
                                <li key={index} className={styles.documentItem}>
                                    <a className={styles.h3Span} href={file.fileURL} target="_blank" rel="noopener noreferrer">
                                        {file.processo} - {moment(file.vencimento).format('DD/MM/YYYY')}
                                    </a>
                                    <FaTrashAlt
                                        className={styles.deleteIcon}
                                        onClick={() => handleDeleteFile(file.id, file.fileURL, 'DD')}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>

                    <form className={styles.form} onSubmit={async (e) => {
                        e.preventDefault();
                        const fileInput = document.getElementById('fileUploadDeclaracoesDiversas') as HTMLInputElement;
                        if (fileInput && fileInput.files && fileInput.files.length > 0) {
                            const file = fileInput.files[0];
                            const data = {
                                processo: (document.getElementById('processoDeclaracoesDiversas') as HTMLInputElement).value,
                                registro: (document.getElementById('registroDeclaracoesDiversas') as HTMLInputElement).value,
                                vencimento: (document.getElementById('vencimentoDeclaracoesDiversas') as HTMLInputElement).value,
                                notify_at: notificacoesAtivadas ? moment((document.getElementById('vencimentoDeclaracoesDiversas') as HTMLInputElement).value, 'DD/MM/YYYY').subtract(Number((document.getElementById('prazoDeclaracoesDiversas') as HTMLSelectElement).value), 'days').toISOString() : null,
                            };
                            await saveDocumentData('DD', data, file, 'Declarações diversas.');
                            handleCloseModal();
                        }
                    }}>
                        <div>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Nº do processo"
                                id="processoDeclaracoesDiversas"
                            />
                        </div>

                        <div>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Nº da licença"
                                id="registroDeclaracoesDiversas"
                            />
                        </div>

                        <div>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Data de vencimento"
                                id="vencimentoDeclaracoesDiversas"
                                onChange={formatVencimentoInput}
                                maxLength={10}
                            />
                        </div>

                        <div className={styles.toggleContainer}>
                            <label className={styles.inputLabel}>
                                Ativar notificações
                            </label>
                            <input
                                type="checkbox"
                                className={styles.toggle}
                                checked={notificacoesAtivadas}
                                onChange={toggleNotificacoes}
                            />
                        </div>

                        {notificacoesAtivadas && (
                            <div>
                                <select className={styles.input} id="prazoDeclaracoesDiversas">
                                    <option value="" disabled selected>
                                        Selecione o prazo de notificações
                                    </option>
                                    <option value="7">7 dias</option>
                                    <option value="30">30 dias</option>
                                    <option value="60">60 dias</option>
                                    <option value="90">90 dias</option>
                                    <option value="180">180 dias</option>
                                </select>
                            </div>
                        )}

                        <input
                            type="file"
                            id="fileUploadDeclaracoesDiversas"
                            className={styles.fileInput}
                        />
                        <label htmlFor="fileUploadDeclaracoesDiversas" className={styles.uploadButton}>
                            {uploading ? 'Carregando...' : 'Anexar Arquivo'}
                        </label>
                        <button type="submit" className={styles.uploadButton} disabled={uploading}>
                            {uploading ? 'Salvando...' : 'Salvar'}
                        </button>
                    </form>
                </ModalDocumentos>

                <ModalDocumentos show={activeModal === 'modalSupressaoVegetal'} onClose={handleCloseModal}>
                    <div className={styles.head}>
                        <h2 className={styles.h2}>Licenças de supressão vegetal.</h2>
                    </div>

                    <div>
                        <h3>Documentos Carregados:</h3>
                        <ul className={styles.documentList}>
                            {uploadedFiles.map((file, index) => (
                                <li key={index} className={styles.documentItem}>
                                    <a className={styles.h3Span} href={file.fileURL} target="_blank" rel="noopener noreferrer">
                                        {file.processo} - {moment(file.vencimento).format('DD/MM/YYYY')}
                                    </a>
                                    <FaTrashAlt
                                        className={styles.deleteIcon}
                                        onClick={() => handleDeleteFile(file.id, file.fileURL, 'LSV')}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>

                    <form className={styles.form} onSubmit={async (e) => {
                        e.preventDefault();
                        const fileInput = document.getElementById('fileUploadSupressaoVegetal') as HTMLInputElement;
                        if (fileInput && fileInput.files && fileInput.files.length > 0) {
                            const file = fileInput.files[0];
                            const data = {
                                processo: (document.getElementById('processoSupressaoVegetal') as HTMLInputElement).value,
                                registro: (document.getElementById('registroSupressaoVegetal') as HTMLInputElement).value,
                                vencimento: (document.getElementById('vencimentoSupressaoVegetal') as HTMLInputElement).value,
                                notify_at: notificacoesAtivadas ? moment((document.getElementById('vencimentoSupressaoVegetal') as HTMLInputElement).value, 'DD/MM/YYYY').subtract(Number((document.getElementById('prazoSupressaoVegetal') as HTMLSelectElement).value), 'days').toISOString() : null,
                            };
                            await saveDocumentData('LSV', data, file, 'Licenças de supressão vegetal.');
                            handleCloseModal();
                        }
                    }}>
                        <div>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Nº do processo"
                                id="processoSupressaoVegetal"
                            />
                        </div>

                        <div>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Nº da licença"
                                id="registroSupressaoVegetal"
                            />
                        </div>

                        <div>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Data de vencimento"
                                id="vencimentoSupressaoVegetal"
                                onChange={formatVencimentoInput}
                                maxLength={10}
                            />
                        </div>

                        <div className={styles.toggleContainer}>
                            <label className={styles.inputLabel}>
                                Ativar notificações
                            </label>
                            <input
                                type="checkbox"
                                className={styles.toggle}
                                checked={notificacoesAtivadas}
                                onChange={toggleNotificacoes}
                            />
                        </div>

                        {notificacoesAtivadas && (
                            <div>
                                <select className={styles.input} id="prazoSupressaoVegetal">
                                    <option value="" disabled selected>
                                        Selecione o prazo de notificações
                                    </option>
                                    <option value="7">7 dias</option>
                                    <option value="30">30 dias</option>
                                    <option value="60">60 dias</option>
                                    <option value="90">90 dias</option>
                                    <option value="180">180 dias</option>
                                </select>
                            </div>
                        )}

                        <input
                            type="file"
                            id="fileUploadSupressaoVegetal"
                            className={styles.fileInput}
                        />
                        <label htmlFor="fileUploadSupressaoVegetal" className={styles.uploadButton}>
                            {uploading ? 'Carregando...' : 'Anexar Arquivo'}
                        </label>
                        <button type="submit" className={styles.uploadButton} disabled={uploading}>
                            {uploading ? 'Salvando...' : 'Salvar'}
                        </button>
                    </form>
                </ModalDocumentos>

                {/* Modais Diversos */}
                <ModalDocumentos show={activeModal === 'modalMapas'} onClose={handleCloseModal}>
                    <div className={styles.head}>
                        <h2 className={styles.h2}>Mapa e geo-referenciamento.</h2>
                    </div>

                    <div>
                        <h3>Documentos Carregados:</h3>
                        <ul className={styles.documentList}>
                            {uploadedFiles.map((file, index) => (
                                <li key={index} className={styles.documentItem}>
                                    <a className={styles.h3Span} href={file.fileURL} target="_blank" rel="noopener noreferrer">
                                        {file.processo} - {moment(file.vencimento).format('DD/MM/YYYY')}
                                    </a>
                                    <FaTrashAlt
                                        className={styles.deleteIcon}
                                        onClick={() => handleDeleteFile(file.id, file.fileURL, 'KML')}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>

                    <form className={styles.form} onSubmit={async (e) => {
                        e.preventDefault();
                        const fileInput = document.getElementById('fileUploadMapas') as HTMLInputElement;
                        if (fileInput && fileInput.files && fileInput.files.length > 0) {
                            const file = fileInput.files[0];
                            const data = {
                                nome: (document.getElementById('nomeKML') as HTMLInputElement).value,
                            };
                            await saveDocumentData('KML', data, file, 'Mapa e geo-referenciamento.');
                            handleCloseModal();
                        }
                    }}>
                        <div>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Nome do KML"
                                id="nomeKML"
                            />
                        </div>

                        <input
                            type="file"
                            id="fileUploadMapas"
                            className={styles.fileInput}
                        />
                        <label htmlFor="fileUploadMapas" className={styles.uploadButton}>
                            {uploading ? 'Carregando...' : 'Anexar Arquivo'}
                        </label>
                        <button type="submit" className={styles.uploadButton} disabled={uploading}>
                            {uploading ? 'Salvando...' : 'Salvar'}
                        </button>
                    </form>
                </ModalDocumentos>

                <ModalDocumentos show={activeModal === 'modalCertidoes'} onClose={() => setActiveModal(null)}>
                    <div className={styles.head}>
                        <h2 className={styles.h2}>Certidões CCIR, ITR e outros</h2>
                    </div>

                    <div className={styles.cardsModal}>
                        <div className={styles.card} onClick={() => handleDocumentClick(fazenda?.carURL || '')}>
                            <img className={styles.icon} src="/images/icons/localizacao.png" />
                            <h3 className={styles.h3}>CAR</h3>
                        </div>

                        <div className={styles.card} onClick={() => handleDocumentClick(fazenda?.ccirURL || '')}>
                            <img className={styles.icon} src="/images/icons/localizacao.png" />
                            <h3 className={styles.h3}>CCIR</h3>
                        </div>

                        <div className={styles.card} onClick={() => handleDocumentClick(fazenda?.itrURL || '')}>
                            <img className={styles.icon} src="/images/icons/localizacao.png" />
                            <h3 className={styles.h3}>ITR</h3>
                        </div>

                        <div className={styles.card} onClick={() => handleDocumentClick(fazenda?.inscricaoEstadualURL || '')}>
                            <img className={styles.icon} src="/images/icons/localizacao.png" />
                            <h3 className={styles.h3}>IE</h3>
                        </div>

                        <div className={styles.card} onClick={() => handleDocumentClick(fazenda?.contratoArrendamentoURL || '')}>
                            <img className={styles.icon} src="/images/icons/localizacao.png" />
                            <h3 className={styles.h3}>Contrato de Arrendamento</h3>
                        </div>
                    </div>
                </ModalDocumentos>

                <ModalDocumentos show={activeModal === 'modalConsultar'} onClose={handleCloseModal}>
                    <div className={styles.head}>
                        <h2 className={styles.h2}>Consultar Embargos</h2>
                    </div>

                    <div>
                        <h3>Documentos Carregados:</h3>
                        <ul className={styles.documentList}>
                            {uploadedFiles.map((file, index) => (
                                <li key={index} className={styles.documentItem}>
                                    <a className={styles.h3Span} href={file.fileURL} target="_blank" rel="noopener noreferrer">
                                        {file.processo} - {moment(file.vencimento).format('DD/MM/YYYY')}
                                    </a>
                                    <FaTrashAlt
                                        className={styles.deleteIcon}
                                        onClick={() => handleDeleteFile(file.id, file.fileURL, 'Consultar')}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.cardsModal}>
                        <button onClick={() => window.location.href = `https://plataforma.alerta.mapbiomas.org/mapa?monthRange[0]=2019-01&monthRange[1]=2023-12&sources[0]=All&territoryType=all&authorization=all&embargoed=all&locationType=alert_code&activeBaseMap=7&map=-14.306969%2C-54.272461%2C4`}>
                            <div className={styles.card}>
                                <img className={styles.icon} src="/images/icons/localizacao.png" />
                                <h3 className={styles.h3}>Mapa interativo do MapBiomas</h3>
                            </div>
                        </button>

                        <button onClick={() => window.location.href = `https://plataforma.alerta.mapbiomas.org/downloads`}>
                            <div className={styles.card}>
                                <img className={styles.icon} src="/images/icons/link.png" />
                                <h3 className={styles.h3}>Link dos arquivos do MapBiomas</h3>
                            </div>
                        </button>

                        <button onClick={() => window.location.href = `https://terrabrasilis.dpi.inpe.br/`}>
                            <div className={styles.card}>
                                <img className={styles.icon} src="/images/icons/link.png" />
                                <h3 className={styles.h3}>Link de desmates do prodes</h3>
                            </div>
                        </button>

                        <button onClick={() => window.location.href = `https://metadados.snirh.gov.br/geonetwork/srv/api/records/9407d38f-84d2-48ea-97dd-ee152c493043`}>
                            <div className={styles.card}>
                                <img className={styles.icon} src="/images/icons/link.png" />
                                <h3 className={styles.h3}>Link de SHP de UC</h3>
                            </div>
                        </button>

                        <button onClick={() => window.location.href = `https://siga.meioambiente.go.gov.br/maps/new?layer=geonode:vw_embargo_poligono_publico&view=True`}>
                            <div className={styles.card}>
                                <img className={styles.icon} src="/images/icons/link.png" />
                                <h3 className={styles.h3}>Mapa interativo de embargos do SIGA</h3>
                            </div>
                        </button>

                        <button onClick={() => window.location.href = `https://siga.meioambiente.go.gov.br/catalogue/#/dataset/627`}>
                            <div className={styles.card}>
                                <img className={styles.icon} src="/images/icons/link.png" />
                                <h3 className={styles.h3}>SIGA dataset 627</h3>
                            </div>
                        </button>

                        <button onClick={() => window.location.href = `https://servicos.ibama.gov.br/ctf/publico/areasembargadas/ConsultaPublicaAreasEmbargadas.php`}>
                            <div className={styles.card}>
                                <img className={styles.icon} src="/images/icons/link.png" />
                                <h3 className={styles.h3}>IBAMA - Consulta Áreas Embargadas</h3>
                            </div>
                        </button>
                    </div>
                </ModalDocumentos>

                <ModalDocumentos show={activeModal === 'modalDocumentos'} onClose={handleCloseModal}>
                    <div className={styles.head}>
                        <h2 className={styles.h2}>Documentos complementares.</h2>
                    </div>

                    <div>
                        <h3>Documentos Carregados:</h3>
                        <ul className={styles.documentList}>
                            {uploadedFiles.map((file, index) => (
                                <li key={index} className={styles.documentItem}>
                                    <a className={styles.h3Span} href={file.fileURL} target="_blank" rel="noopener noreferrer">
                                        {file.processo} - {moment(file.vencimento).format('DD/MM/YYYY')}
                                    </a>
                                    <FaTrashAlt
                                        className={styles.deleteIcon}
                                        onClick={() => handleDeleteFile(file.id, file.fileURL, 'DC')}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>

                    <form className={styles.form} onSubmit={async (e) => {
                        e.preventDefault();
                        const fileInput = document.getElementById('fileUploadDocumentosComplementares') as HTMLInputElement;
                        if (fileInput && fileInput.files && fileInput.files.length > 0) {
                            const file = fileInput.files[0];
                            const data = {
                                nome: (document.getElementById('nomeDocumento') as HTMLInputElement).value,
                                observacao: (document.getElementById('observacaoDocumento') as HTMLInputElement).value,
                            };
                            await saveDocumentData('DC', data, file, 'Documentos complementares.');
                            handleCloseModal();
                        }
                    }}>
                        <div>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Nome do documento"
                                id="nomeDocumento"
                            />
                        </div>

                        <div>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Observação"
                                id="observacaoDocumento"
                            />
                        </div>

                        <input
                            type="file"
                            id="fileUploadDocumentosComplementares"
                            className={styles.fileInput}
                        />
                        <label htmlFor="fileUploadDocumentosComplementares" className={styles.uploadButton}>
                            {uploading ? 'Carregando...' : 'Anexar Arquivo'}
                        </label>
                        <button type="submit" className={styles.uploadButton} disabled={uploading}>
                            {uploading ? 'Salvando...' : 'Salvar'}
                        </button>
                    </form>
                </ModalDocumentos>

                <ModalDocumentos show={activeModal === 'modalCreditos'} onClose={handleCloseModal}>
                    <div className={styles.head}>
                        <h2 className={styles.h2}>Créditos e financiamentos.</h2>
                    </div>

                    <div>
                        <h3>Documentos Carregados:</h3>
                        <ul className={styles.documentList}>
                            {uploadedFiles.map((file, index) => (
                                <li key={index} className={styles.documentItem}>
                                    <a className={styles.h3Span} href={file.fileURL} target="_blank" rel="noopener noreferrer">
                                        {file.processo} - {moment(file.vencimento).format('DD/MM/YYYY')}
                                    </a>
                                    <FaTrashAlt
                                        className={styles.deleteIcon}
                                        onClick={() => handleDeleteFile(file.id, file.fileURL, 'CF')}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>

                    <form className={styles.form} onSubmit={async (e) => {
                        e.preventDefault();
                        const fileInput = document.getElementById('fileUploadCreditos') as HTMLInputElement;
                        if (fileInput && fileInput.files && fileInput.files.length > 0) {
                            const file = fileInput.files[0];
                            const data = {
                                nome: (document.getElementById('nomeOperacao') as HTMLInputElement).value,
                                instituicao: (document.getElementById('instituicaoFinanceira') as HTMLInputElement).value,
                                descricao: (document.getElementById('descricaoOperacao') as HTMLInputElement).value,
                                valor: Number((document.getElementById('valorOperacao') as HTMLInputElement).value),
                                juros: Number((document.getElementById('jurosOperacao') as HTMLInputElement).value),
                                vencimento: (document.getElementById('vencimentoOperacao') as HTMLInputElement).value,
                                notify_at: notificacoesAtivadas ? moment((document.getElementById('vencimentoOperacao') as HTMLInputElement).value, 'DD/MM/YYYY').subtract(Number((document.getElementById('prazoCreditos') as HTMLSelectElement).value), 'days').toISOString() : null,
                            };
                            await saveDocumentData('CF', data, file, 'Créditos e financiamentos.');
                            handleCloseModal();
                        }
                    }}>
                        <div>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Nome da operação financeira"
                                id="nomeOperacao"
                            />
                        </div>

                        <div>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Instituição Financeira"
                                id="instituicaoFinanceira"
                            />
                        </div>

                        <div>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Descrição da operação"
                                id="descricaoOperacao"
                            />
                        </div>

                        <div>
                            <input
                                type="number"
                                className={styles.input}
                                placeholder="R$ 0"
                                id="valorOperacao"
                            />
                        </div>

                        <div>
                            <input
                                type="number"
                                step="0.01"
                                className={styles.input}
                                placeholder="Juros (%)"
                                id="jurosOperacao"
                            />
                        </div>

                        <div className={styles.toggleContainer}>
                            <label className={styles.inputLabel}>
                                {jurosTipo}
                            </label>
                            <input
                                type="checkbox"
                                className={styles.toggle}
                                checked={jurosTipo === 'A.A.'}
                                onChange={toggleJurosTipo}
                            />
                        </div>

                        <div>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Vencimento da Operação"
                                id="vencimentoOperacao"
                                onChange={formatVencimentoInput}
                                maxLength={10}
                            />
                        </div>

                        <div className={styles.toggleContainer}>
                            <label className={styles.inputLabel}>
                                Ativar notificações
                            </label>
                            <input
                                type="checkbox"
                                className={styles.toggle}
                                checked={notificacoesAtivadas}
                                onChange={toggleNotificacoes}
                            />
                        </div>

                        {notificacoesAtivadas && (
                            <div>
                                <select className={styles.input} id="prazoCreditos">
                                    <option value="" disabled selected>
                                        Selecione o prazo de notificações
                                    </option>
                                    <option value="7">7 dias</option>
                                    <option value="30">30 dias</option>
                                    <option value="60">60 dias</option>
                                    <option value="90">90 dias</option>
                                    <option value="180">180 dias</option>
                                </select>
                            </div>
                        )}

                        <input
                            type="file"
                            id="fileUploadCreditos"
                            className={styles.fileInput}
                        />
                        <label htmlFor="fileUploadCreditos" className={styles.uploadButton}>
                            {uploading ? 'Carregando...' : 'Anexar Arquivo'}
                        </label>
                        <button type="submit" className={styles.uploadButton} disabled={uploading}>
                            {uploading ? 'Salvando...' : 'Salvar'}
                        </button>
                    </form>
                </ModalDocumentos>

                <img className={styles.imagemFazenda} src={fazenda?.thumbnail || "/images/fazenda1.png"} alt={`Imagem da ${fazenda?.name}`} />
            </main>

            <style jsx global>{`
                * {
                    font-family: "Montserrat", sans-serif;
                    box-sizing: border-box;
                    padding: 0;
                    margin: 0;
                },
            `}</style>
        </div>
    );
};

export default Fazenda;
