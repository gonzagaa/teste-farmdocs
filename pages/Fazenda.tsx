import styles from '../styles/Fazenda.module.css';
import Head from 'next/head';
import ModalComponent from '../components/ModalComponent';
import { SlArrowLeft } from "react-icons/sl";
import ModalDocumentos from '../components/ModalDocumentos';
import React, { useState } from 'react';
import ModalEmbargos from '../components/ModalEmbargos';

export default function Fazenda() {
    const [activeModal, setActiveModal] = useState(null); // Usar `null` para indicar que nenhum modal está aberto

  const handleCardClick = (modalId) => {
    setActiveModal(modalId);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  const [notificacoesAtivadas, setNotificacoesAtivadas] = useState(false);

  const toggleNotificacoes = () => {
    setNotificacoesAtivadas(!notificacoesAtivadas);
  };

  const [jurosTipo, setJurosTipo] = useState('A.M.');

  const toggleJurosTipo = () => {
    setJurosTipo(jurosTipo === 'A.M.' ? 'A.A.' : 'A.M.');
  };
    
    return (
        <div className={styles.container}>
            <Head>
                <title>ForFarmDocs - Fazenda Barra Grande</title>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com"/>
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"></link>
            </Head>

            <main className={styles.wrapper}>
                {/* Conteúdo principal (cards) */}
                <div className={styles.content}>
                    <div className={styles.header}>
                        <div className={styles.headText}>
                        <a className={styles.a} href='http://localhost:3000/Home'>
                    <SlArrowLeft className={styles.iconArrow} />
                    Voltar
                        </a>    
                        <h2 className={styles.h2}>
                            <span className={styles.h2Span}>Fazenda</span> Barra Grande
                        </h2>
                        </div>

                        <div className={styles.boxCarinha}>
                        <a>
                            <ModalComponent/>
                        </a>
                        </div>
                    </div>

                    <div className={styles.licencas}>
                        <div className={styles.head}>
                            <h2 className={styles.h2}>Licenças</h2>
                            <p className={styles.p}>Clique para vizualizar ou adicionar novas licenças</p>
                        </div>

                        <div className={styles.cards}>
                            <div className={styles.card}>
                                <img className={styles.icon} src="./images/icons/registro.png" /> 

                                <h3 className={styles.h3} onClick={() => handleCardClick('modalIrrigacao')}>Registro de Irrigação pecuária e sequeiro.</h3>
                            </div>

                            <div className={styles.card} onClick={() => handleCardClick('modalBarragens')}>
                                <img className={styles.icon} src="./images/icons/cadastro.png" /> 

                                <h3 className={styles.h3} >Cadastro e licença de barragens.</h3>
                            </div>

                            <div className={styles.card} onClick={() => handleCardClick('modalOutorgas')}>
                                <img className={styles.icon} src="./images/icons/outorga.png" /> 

                                <h3 className={styles.h3} >Outorgas do uso de água.</h3>
                            </div>

                            <div className={styles.card} onClick={() => handleCardClick('modalBovinocultura')}>
                                <img className={styles.icon} src="./images/icons/licenca.png" /> 

                                <h3 className={styles.h3}>Licenças bovinocultura.</h3>
                            </div>

                            <div className={styles.card} onClick={() => handleCardClick('modalDeclaracoesDiversas')}>
                                <img className={styles.icon} src="./images/icons/declaracoes.png" /> 

                                <h3 className={styles.h3}>Declarações diversas.</h3>
                            </div>

                            <div className={styles.card} onClick={() => handleCardClick('modalSupressaoVegetal')}>
                                <img className={styles.icon} src="./images/icons/vegetal.png" /> 

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
                            <div className={styles.card} onClick={() => handleCardClick('modalMapas')}>
                                <img className={styles.icon} src="./images/icons/mapa.png" /> 

                                <h3 className={styles.h3} >Mapa e geo-referenciamento.</h3>
                            </div>

                            <div className={styles.card} onClick={() => handleCardClick('modalCertidoes')}>
                                <img className={styles.icon} src="./images/icons/certidoes.png" /> 

                                <h3 className={styles.h3} >Certidões CCIR, ITS e outros..</h3>
                            </div>

                            <div className={styles.card} onClick={() => handleCardClick('modalConsultar')}>
                                <img className={styles.icon} src="./images/icons/consultar.png" /> 

                                <h3 className={styles.h3}>Consultar embargos.</h3>
                            </div>

                            <div className={styles.card} onClick={() => handleCardClick('modalDocumentos')}>
                                <img className={styles.icon} src="./images/icons/documentos.png" /> 

                                <h3 className={styles.h3}>Documentos complementares.</h3>
                            </div>

                            <div className={styles.card} onClick={() => handleCardClick('modalCreditos')}>
                                <img className={styles.icon} src="./images/icons/creditos.png" /> 

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

                    <form className={styles.form}>
                        <div>
                            <input
                            type="text"
                            className={styles.input}
                            placeholder="Nº do processo"
                            />
                        </div>

                        <div>
                            <input
                            type="text"
                            className={styles.input}
                            placeholder="Nº da licença"
                            />
                        </div>

                        <div>
                            <input
                            type="text"
                            className={styles.input}
                            placeholder="Data de vencimento"
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
                            <select className={styles.input}>
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
                            id="fileUpload"
                            className={styles.fileInput}
                        />
                        <label htmlFor="fileUpload" className={styles.uploadButton}>
                            Anexar Arquivo
                        </label>
                    </form>

                </ModalDocumentos>

                <ModalDocumentos show={activeModal === 'modalBarragens'} onClose={handleCloseModal}>
                    <div className={styles.head}>
                        <h2 className={styles.h2}>Cadastro e licença de barragens.</h2>
                    </div>

                    <form className={styles.form}>
                        <div>
                            <input
                            type="text"
                            className={styles.input}
                            placeholder="Nº do processo"
                            />
                        </div>

                        <div>
                            <input
                            type="text"
                            className={styles.input}
                            placeholder="Nº da licença"
                            />
                        </div>

                        <div>
                            <input
                            type="text"
                            className={styles.input}
                            placeholder="Data de vencimento"
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
                            <select className={styles.input}>
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
                            id="fileUpload"
                            className={styles.fileInput}
                        />
                        <label htmlFor="fileUpload" className={styles.uploadButton}>
                            Anexar Arquivo
                        </label>
                    </form>

                </ModalDocumentos>

                <ModalDocumentos show={activeModal === 'modalOutorgas'} onClose={handleCloseModal}>
                    <div className={styles.head}>
                        <h2 className={styles.h2}>Outorgas do uso de água.</h2>
                    </div>

                    <form className={styles.form}>
                        <div>
                            <input
                            type="text"
                            className={styles.input}
                            placeholder="Nº do processo"
                            />
                        </div>

                        <div>
                            <input
                            type="text"
                            className={styles.input}
                            placeholder="Nº da portaria"
                            />
                        </div>

                        <div>
                            <input
                            type="text"
                            className={styles.input}
                            placeholder="Data de vencimento"
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
                            <select className={styles.input}>
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
                            id="fileUpload"
                            className={styles.fileInput}
                        />
                        <label htmlFor="fileUpload" className={styles.uploadButton}>
                            Anexar Arquivo
                        </label>
                    </form>

                </ModalDocumentos>
                
                <ModalDocumentos show={activeModal === 'modalBovinocultura'} onClose={handleCloseModal}>
                    <div className={styles.head}>
                        <h2 className={styles.h2}>Licenças bovinocultura.</h2>
                    </div>

                    <form className={styles.form}>
                        <div>
                            <input
                            type="text"
                            className={styles.input}
                            placeholder="Nº do processo"
                            />
                        </div>

                        <div>
                            <input
                            type="text"
                            className={styles.input}
                            placeholder="Nº da licença"
                            />
                        </div>

                        <div>
                            <input
                            type="text"
                            className={styles.input}
                            placeholder="Data de vencimento"
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
                            <select className={styles.input}>
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
                            id="fileUpload"
                            className={styles.fileInput}
                        />
                        <label htmlFor="fileUpload" className={styles.uploadButton}>
                            Anexar Arquivo
                        </label>
                    </form>

                </ModalDocumentos>

                <ModalDocumentos show={activeModal === 'modalDeclaracoesDiversas'} onClose={handleCloseModal}>
                    <div className={styles.head}>
                        <h2 className={styles.h2}>Declarações diversas.</h2>
                    </div>

                    <form className={styles.form}>
                        <div>
                            <input
                            type="text"
                            className={styles.input}
                            placeholder="Nº do processo"
                            />
                        </div>

                        <div>
                            <input
                            type="text"
                            className={styles.input}
                            placeholder="Nº da licença"
                            />
                        </div>

                        <div>
                            <input
                            type="text"
                            className={styles.input}
                            placeholder="Data de vencimento"
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
                            <select className={styles.input}>
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
                            id="fileUpload"
                            className={styles.fileInput}
                        />
                        <label htmlFor="fileUpload" className={styles.uploadButton}>
                            Anexar Arquivo
                        </label>
                    </form>

                </ModalDocumentos>

                <ModalDocumentos show={activeModal === 'modalSupressaoVegetal'} onClose={handleCloseModal}>
                    <div className={styles.head}>
                        <h2 className={styles.h2}>Licenças de supressão vegetal.</h2>
                    </div>

                    <form className={styles.form}>
                        <div>
                            <input
                            type="text"
                            className={styles.input}
                            placeholder="Nº do processo"
                            />
                        </div>

                        <div>
                            <input
                            type="text"
                            className={styles.input}
                            placeholder="Nº da licença"
                            />
                        </div>

                        <div>
                            <input
                            type="text"
                            className={styles.input}
                            placeholder="Data de vencimento"
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
                            <select className={styles.input}>
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
                            id="fileUpload"
                            className={styles.fileInput}
                        />
                        <label htmlFor="fileUpload" className={styles.uploadButton}>
                            Anexar Arquivo
                        </label>
                    </form>

                </ModalDocumentos>


                {/* Modais Diversos */}
                <ModalDocumentos show={activeModal === 'modalMapas'} onClose={handleCloseModal}>
                    <div className={styles.head}>
                        <h2 className={styles.h2}>Mapa e geo-referenciamento.</h2>
                    </div>

                    <form className={styles.form}>
                        <div>
                            <input
                            type="text"
                            className={styles.input}
                            placeholder="Nome do KML"
                            />
                        </div>

                        <input
                            type="file"
                            id="fileUpload"
                            className={styles.fileInput}
                        />
                        <label htmlFor="fileUpload" className={styles.uploadButton}>
                            Anexar Arquivo
                        </label>
                    </form>

                </ModalDocumentos>

                <ModalDocumentos show={activeModal === 'modalCertidoes'} onClose={handleCloseModal}>
                    <div className={styles.head}>
                        <h2 className={styles.h2}>Certidões CCIR, ITR e outros</h2>
                    </div>

                    <div className={styles.cardsModal}>
                        <div className={styles.card}>
                            <img className={styles.icon} src="./images/icons/localizacao.png" /> 

                            <h3 className={styles.h3}>CAR</h3>
                        </div>

                        <div className={styles.card}>
                            <img className={styles.icon} src="./images/icons/localizacao.png" /> 

                            <h3 className={styles.h3}>CCIR</h3>
                        </div>

                        <div className={styles.card}>
                            <img className={styles.icon} src="./images/icons/localizacao.png" /> 

                            <h3 className={styles.h3}>ITR</h3>
                        </div>

                        <div className={styles.card}>
                            <img className={styles.icon} src="./images/icons/localizacao.png" /> 

                            <h3 className={styles.h3}>IE</h3>
                        </div>

                        <div className={styles.card}>
                            <img className={styles.icon} src="./images/icons/localizacao.png" /> 

                            <h3 className={styles.h3}>Contrato de Arrendamento</h3>
                        </div>
                    </div>

                </ModalDocumentos>

                <ModalDocumentos show={activeModal === 'modalConsultar'} onClose={handleCloseModal}>
                    <div className={styles.head}>
                        <h2 className={styles.h2}>Consultar Embargos</h2>
                    </div>

                    <div className={styles.cardsModal}>
                        <div className={styles.card}>
                            <img className={styles.icon} src="./images/icons/localizacao.png" /> 

                            <h3 className={styles.h3}>Mapa interativo do MapBiomas</h3>
                        </div>

                        <div className={styles.card}>
                            <img className={styles.icon} src="./images/icons/link.png" /> 

                            <h3 className={styles.h3}>Link dos arquivos do MapBiomas</h3>
                        </div>

                        <div className={styles.card}>
                            <img className={styles.icon} src="./images/icons/link.png" /> 

                            <h3 className={styles.h3}>Link de desmates do prodes</h3>
                        </div>

                        <div className={styles.card}>
                            <img className={styles.icon} src="./images/icons/link.png" /> 

                            <h3 className={styles.h3}>Link de SHP de UC</h3>
                        </div>

                        <div className={styles.card}>
                            <img className={styles.icon} src="./images/icons/link.png" /> 

                            <h3 className={styles.h3}>Mapa interativo de embargos do SIGA</h3>
                        </div>

                        <div className={styles.card}>
                            <img className={styles.icon} src="./images/icons/link.png" /> 

                            <h3 className={styles.h3}>SIGA dataset 627</h3>
                        </div>

                        <div className={styles.card}>
                            <img className={styles.icon} src="./images/icons/link.png" /> 

                            <h3 className={styles.h3}>IBAMA - Consulta Áreas Embargadas</h3>
                        </div>
                    </div>

                </ModalDocumentos>

                <ModalDocumentos show={activeModal === 'modalDocumentos'} onClose={handleCloseModal}>
                    <div className={styles.head}>
                        <h2 className={styles.h2}>Documentos complementares.</h2>
                    </div>

                    <form className={styles.form}>
                        <div>
                            <input
                            type="text"
                            className={styles.input}
                            placeholder="Nome do documento"
                            />
                        </div>

                        <div>
                            <input
                            type="text"
                            className={styles.input}
                            placeholder="Observação"
                            />
                        </div>

                        <input
                            type="file"
                            id="fileUpload"
                            className={styles.fileInput}
                        />
                        <label htmlFor="fileUpload" className={styles.uploadButton}>
                            Anexar Arquivo
                        </label>
                    </form>

                </ModalDocumentos>

                <ModalDocumentos show={activeModal === 'modalCreditos'} onClose={handleCloseModal}>
                    <div className={styles.head}>
                        <h2 className={styles.h2}>Créditos e financiamentos.</h2>
                    </div>

                    <form className={styles.form}>
                        <div>
                            <input
                            type="text"
                            className={styles.input}
                            placeholder="Nome da operação financeira"
                            />
                        </div>

                        <div>
                            <input
                            type="text"
                            className={styles.input}
                            placeholder="Instituição Financeira"
                            />
                        </div>

                        <div>
                            <input
                            type="text"
                            className={styles.input}
                            placeholder="Descrição da operação"
                            />
                        </div>

                        <div>
                            <input
                            type="number"
                            className={styles.input}
                            placeholder="R$ 0"
                            />
                        </div>

                        <div>
                            <input
                            type="number"
                            step="0.01"
                            className={styles.input}
                            placeholder="Juros (%)"
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
                            <select className={styles.input}>
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
                            id="fileUpload"
                            className={styles.fileInput}
                        />
                        <label htmlFor="fileUpload" className={styles.uploadButton}>
                            Anexar Arquivo
                        </label>
                    </form>

                </ModalDocumentos>

                <img className={styles.imagemFazenda} src="./images/fazenda1.png" />
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
    )
}