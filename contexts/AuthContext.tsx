import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  updateEmail,
  updatePassword,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  UserInfo,
  signOut,
} from "firebase/auth";
import {
  DocumentData,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { app, db } from "../services/firebase";
import { userSchema } from "../firestore/usuario/dto/usuario.dto";

type Error = {
  error: string;
  status: string;
};

type SignInCredentials = {
  email: string;
  password: string;
};

type SignUpCredentials = {
  name: string;
  registryCode: string;
  birthdate: string;
  email: string;
  phone: string;
  thumbnail?: string;
  password: string;
};

type AuthContextData = {
  user: UserInfo | undefined | null;
  error: Error | undefined | null;
  signIn: (credentials: SignInCredentials) => Promise<any>;
  signUp: (credentials: SignUpCredentials) => Promise<any>;
  signOut: () => Promise<void>;
  changeProfileImage: (image: string) => Promise<void>;
  loadUser: () => Promise<void | string>;
  updateUser: (name: string, email: string, password: string) => Promise<void>;
  verificationEmail: () => void;
  loading: boolean;
  token: string;
  role: "medico" | "staff" | "patient";
  setRole: (role: "medico" | "staff" | "patient") => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

const USER_KEY = "auth-user";
const TOKEN_KEY = "auth-token";

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const auth = getAuth(app);

  const [user, setUser] = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string>("");
  const [error, setError] = useState<Error | null>(null);
  const [role, setRole] = useState<"medico" | "staff" | "patient">("staff");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user as UserInfo);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  async function loadUser() {
    setLoading(true);
    const userAS = localStorage.getItem(USER_KEY);
    const tokenAS = localStorage.getItem(TOKEN_KEY);

    try {
      if (userAS) {
        const userJSON: UserInfo = JSON.parse(userAS);
        const q = query(
          collection(db, "Users"),
          where("id", "==", userJSON.uid)
        );

        const querySnapshot = await getDocs(q);
        const user = querySnapshot.docs.map((doc) => doc.data())[0];
        setUser(user as UserInfo);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  async function signIn({ email, password }: SignInCredentials) {
    try {
      setLoading(true);

      const res = await signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          const user = userCredential.user;

          localStorage.setItem(TOKEN_KEY, user.refreshToken);
          localStorage.setItem(USER_KEY, JSON.stringify(user));
          setToken(user.refreshToken);
          setUser(user);
          setLoading(false);
          return user;
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setLoading(false);
          return {
            errorCode,
            errorMessage,
          };
        });

      return res;
    } catch (error: any) {
      setLoading(false);
      return error;
    }
  }

  async function signUp({
    name,
    registryCode,
    birthdate,
    phone,
    thumbnail,
    email,
    password,
  }: SignUpCredentials) {
    try {
      setLoading(true);

      const res = await createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          const user = userCredential.user;

          await updateProfile(user, {
            displayName: name,
          });

          await userSchema.validate(
            {
              name,
              registryCode,
              birthdate,
              phone,
              email,
              thumbnail,
            },
            { abortEarly: false }
          );

          await setDoc(doc(db, "Users", user.uid), {
            id: user.uid,
            name,
            registryCode,
            birthdate,
            phone,
            thumbnail: thumbnail || "",
            email,
            createdAt: new Date().toISOString(),
          });

          localStorage.setItem(TOKEN_KEY, user.refreshToken);
          localStorage.setItem(USER_KEY, JSON.stringify(user));
          setToken(user.refreshToken);

          // Use Router for navigation
          // Example: router.push("/account-created");

          setTimeout(() => {
            setUser(user);
            setLoading(false);
          }, 1200);

          return user;
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert("Erro ao criar conta: " + errorMessage);
          setLoading(false);
          return {
            errorCode,
            errorMessage,
          };
        });

      return res;
    } catch (error: any) {
      setLoading(false);
      return error;
    }
  }

  async function signOut() {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    await firebaseSignOut(auth);
  }

  async function updateUser(name: string, email: string, password: string) {
    const user = auth.currentUser;

    if (user) {
      try {
        await updateProfile(user, { displayName: name });
        await updateEmail(user, email);
        await updatePassword(user, password);
      } catch (error) {
        console.error(error);
      }
    }
  }

  function checkEmailVerified() {
    const user = auth.currentUser;
    if (user) {
      return user.emailVerified;
    }
  }

  function verificationEmail() {
    const user = auth.currentUser;
    const isVerified = checkEmailVerified();
    if (user && !isVerified) {
      sendEmailVerification(user)
        .then(() => {
          console.log("Email enviado");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  async function changeProfileImage(photoURL: string) {
    console.log(photoURL);
    await updateDoc(doc(db, "Users", String(user?.uid)), {
      ...(user as UserInfo),
      photoURL,
    });
    setUser({
      ...(user as UserInfo),
      photoURL,
    });
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        error,
        role,
        setRole,
        loading,
        signIn,
        signUp,
        signOut,
        changeProfileImage,
        loadUser,
        updateUser,
        verificationEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export { AuthProvider, useAuth, signOut };
