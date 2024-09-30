import styles from '../styles/Fazenda.module.css';
import Head from 'next/head';
import ModalComponent from '../components/ModalComponent';
import { SlArrowLeft } from "react-icons/sl";
import ModalDocumentos from '../components/ModalDocumentos';
import React, { useState, useEffect } from 'react';
import ModalEmbargos from '../components/ModalEmbargos';
import { useRouter } from 'next/router';
import { getFazendaById } from '../firestore/fazendas/controller/fazenda.controller'; // Função para buscar a fazenda pelo ID
import { FazendaDTO } from '../firestore/fazendas/dto/fazendas.dto';

export default function Fazenda() {
    const [activeModal, setActiveModal] = useState(null);
    const [fazenda, setFazenda] = useState<FazendaDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { id } = router.query; // Pega o ID da URL

    useEffect(() => {
        if (id) {
            // Função para buscar a fazenda pelo ID
            const fetchFazenda = async () => {
                const fetchedFazenda = await getFazendaById(id as string);
                setFazenda(fetchedFazenda);
                setLoading(false);
            };
            fetchFazenda();
        }
    }, [id]);

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

    if (loading) {
        return <p>Loading...</p>;
    }
    
    return (
        <div className={styles.container}>
            <Head>
                <title>ForFarmDocs - {fazenda?.name || 'Fazenda'}</title>
                <link rel="preconnect" href="https://fonts.googleapis.com"/>
                <link rel="preconnect" href="https://fonts.gstatic.com"/>
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"></link>
            </Head>

            <main className={styles.wrapper}>
                {/* Conteúdo principal (cards) */}
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

                {/* Outros modais... */}
                {/*...*/}

                <img className={styles.imagemFazenda} src={fazenda?.thumbnail || "./images/fazenda1.png"} alt={`Imagem da ${fazenda?.name}`} />
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
