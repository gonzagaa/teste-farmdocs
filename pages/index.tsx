import { useState } from 'react';
import styles from '../styles/Login.module.css';
import Head from 'next/head';
import { auth, db } from '../services/firebase'; // Importando a configuração do Firebase
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Alterna entre as telas de login e cadastro
  const handleToggleRegister = () => {
    setIsRegister(!isRegister);
    setError('');
  };

  // Função para lidar com o login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Usuário logado com sucesso!');
      router.push('/Home'); // Redireciona para a página protegida
    } catch (error) {
      setError(error.message);
    }
  };

  // Função para lidar com o cadastro
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Atualiza o perfil do usuário com nome
      await updateProfile(user, {
        displayName: name,
      });

      // Cria o documento do usuário no Firestore
      await setDoc(doc(db, 'Users', user.uid), {
        id: user.uid,
        name,
        email,
        phone,
        createdAt: new Date().toISOString(),
      });

      alert('Usuário cadastrado com sucesso!');
      router.push('/Home'); // Redireciona para a página protegida
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>ForFarm Docs</title>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"></link>
      </Head>

      <img className={styles.logo} src="./images/forfarmlogobranca.png" />
      <img className={styles.bg} src="./images/bgforfarmweb.jpg" />

      <main className={styles.box}>
        {isRegister ? (
          <>
            <h1 className={styles.title}><span className={styles.spanH1}>Crie</span> sua conta!</h1>
            <p className={styles.subtitle}>Digite suas credenciais para criar sua conta.</p>
            <form className={styles.form} onSubmit={handleRegister}>
              <div className={styles.inputbox}>
                <label className={styles.label} htmlFor="name">Nome Completo</label>
                <input
                  className={styles.input}
                  id="name"
                  type="text"
                  placeholder="Digite aqui seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className={styles.inputbox}>
                <label className={styles.label} htmlFor="phone">Celular</label>
                <input
                  className={styles.input}
                  id="phone"
                  type="text"
                  placeholder="Digite aqui seu celular"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className={styles.inputbox}>
                <label className={styles.label} htmlFor="email">E-mail</label>
                <input
                  className={styles.input}
                  id="email"
                  type="email"
                  placeholder="Digite aqui seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className={styles.inputbox}>
                <label className={styles.label} htmlFor="password">Digite sua senha</label>
                <input
                  className={styles.input}
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className={styles.error}>{error}</p>}
              <button className={styles.button} type="submit">Cadastrar</button>
            </form>
            <a href="#" onClick={handleToggleRegister} className={styles.a}>Já possui cadastro? <span className={styles.aSpan}>Clique para entrar.</span></a>
          </>
        ) : (
          <>
            <h1 className={styles.title}><span className={styles.spanH1}>Boas-vindas</span> ao ForFarm Docs!</h1>
            <p className={styles.subtitle}>Digite seu <span className={styles.span}>Email</span> e <span className={styles.span}>Senha</span> para entrar na sua conta.</p>
            <form className={styles.form} onSubmit={handleLogin}>
              <div className={styles.inputbox}>
                <label className={styles.label} htmlFor="email">E-mail</label>
                <input
                  className={styles.input}
                  id="email"
                  type="email"
                  placeholder="Digite aqui seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className={styles.inputbox}>
                <label className={styles.label} htmlFor="password">Senha</label>
                <input
                  className={styles.input}
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className={styles.error}>{error}</p>}
              <button className={styles.button} type="submit">Acessar</button>
            </form>
  </>
        )}
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
}
