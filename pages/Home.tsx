import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import Head from "next/head";
import ModalComponent from "../components/ModalComponent";
import ModalAdicionarFazenda from "../components/ModalAdicionarFazenda";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/router";
import { getFazendaByUserId } from "../firestore/fazendas/controller/fazenda.controller";
import { FazendaDTO } from "../firestore/fazendas/dto/fazendas.dto";

const Home = () => {
  const [user, setUser] = useState(null);
  const [fazendas, setFazendas] = useState<FazendaDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        const fetchedFazendas = await getFazendaByUserId(user.uid);
        setFazendas(fetchedFazendas);
      } else {
        setUser(null);
        setFazendas([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleFazendaClick = (id: string) => {
    // Redireciona para a página da fazenda
    router.push(`/${id}`);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>ForFarm Docs</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        ></link>
      </Head>

      <main className={styles.wrapper}>
        <ModalAdicionarFazenda />
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.headText}>
              <h2 className={styles.h2}>
                <span className={styles.h2Span}>Olá, </span>
                {user?.displayName || "Usuário"}!
              </h2>
              <p className={styles.p}>Aqui estão suas fazendas:</p>
            </div>

            <div className={styles.boxCarinha}>
              <a>
                <ModalComponent />
              </a>
            </div>
          </div>

          <div className={styles.fazendas}>
            <div className={styles.cards}>
              {fazendas.length > 0 ? (
                fazendas.map((fazenda) => (
                  <a
                    key={fazenda.id}
                    onClick={() => handleFazendaClick(fazenda.id)} // Redireciona ao clicar
                    className={styles.card}
                  >
                    <img
                      className={styles.imagemFazenda}
                      src={fazenda.thumbnail}
                      alt={`Imagem da ${fazenda.name}`}
                    />
                    <div className={styles.text}>
                      <h2 className={styles.h2}>{fazenda.name}</h2>
                      <p className={styles.p}>
                        Clique para acessar os documentos dessa fazenda
                      </p>
                    </div>
                  </a>
                ))
              ) : (
                <p className={styles.noFazendas}>
                  Você ainda não adicionou nenhuma fazenda.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        * {
          font-family: "Montserrat", sans-serif;
          box-sizing: border-box;
          padding: 0;
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default Home;
