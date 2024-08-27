import styles from "../styles/Home.module.css";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import ModalComponent from "../components/ModalComponent";
import ModalAdicionarFazenda from "../components/ModalAdicionarFazenda";
import "swiper/swiper-bundle.css"; // Importando o CSS do Swiper

const Home = () => {
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
        <ModalAdicionarFazenda/>
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.headText}>
              <h2 className={styles.h2}>
                <span className={styles.h2Span}>Olá, </span>Nome!
              </h2>
              <p className={styles.p}>Aqui estão suas fazendas:</p>
            </div>

            <div className={styles.boxCarinha}>
              <a>
                <ModalComponent/>
              </a>
            </div>
          </div>

          <div className={styles.fazendas}>
            <div className={styles.cards}>
              <a href="http://localhost:3000/Fazenda" className={styles.card}>
                <img className={styles.imagemFazenda} src="./images/fazenda1.png" />

                <div className={styles.text}>
                  <h2 className={styles.h2}>Fazenda Barra Grande</h2>
                  <p className={styles.p}>Clique para acessar os documentos dessa fazenda</p>
                </div>
              </a>

              <a className={styles.card}>
                <img className={styles.imagemFazenda} src="./images/fazenda2.png" />

                <div className={styles.text}>
                  <h2 className={styles.h2}>Fazenda Ana Cecilia</h2>
                  <p className={styles.p}>Clique para acessar os documentos dessa fazenda</p>
                </div>
              </a>

              <a className={styles.card}>
                <img className={styles.imagemFazenda} src="./images/fazenda3.png" />

                <div className={styles.text}>
                  <h2 className={styles.h2}>Fazenda Itamara</h2>
                  <p className={styles.p}>Clique para acessar os documentos dessa fazenda</p>
                </div>
              </a>

              <a className={styles.card}>
                <img className={styles.imagemFazenda} src="./images/fazenda1.png" />

                <div className={styles.text}>
                  <h2 className={styles.h2}>Fazenda Barra Grande</h2>
                  <p className={styles.p}>Clique para acessar os documentos dessa fazenda</p>
                </div>
              </a>
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
