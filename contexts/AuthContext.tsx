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
  UserInfo,
  User,
  signOut,
} from "firebase/auth";

import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { app, db } from "../services/firebase";
import { userSchema } from "../firestore/usuario/dto/usuario.dto";
import { fetchUserSubscriptions } from "../services/membros";
import {
  SignInCredentials,
  SignUpCredentials,
  Subscription,
} from "../services/types";
import { SUBSCRIPTION_PLAN_ID } from "../services/constants";

type AuthContextData = {
  user: UserInfo | undefined | null;
  firebaseUser: any;
  setFirebaseUser: React.Dispatch<React.SetStateAction<User>>;
  error: Error | undefined | null;
  signIn: (credentials: SignInCredentials) => Promise<any>;
  signUp: (credentials: SignUpCredentials) => Promise<any>;
  signOut: () => Promise<void>;
  changeProfileImage: (image: string) => Promise<void>;
  updateUser: (nome: string, email: string, senha: string) => Promise<void>;
  verificationEmail: () => void;
  subscriptions: Subscription[];
  isMember: boolean;
  loading: boolean;
  token: string;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const auth = getAuth(app);

  const [user, setUser] = useState<UserInfo | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User>({} as User);
  const [token, setToken] = useState<string>("");
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isMember, setIsMember] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const subscriptions = await fetchUserSubscriptions(user.email as string);

          if (subscriptions) {
            setSubscriptions(subscriptions.subscriptions);

            subscriptions.subscriptions.map((subscription) => {
              if (subscription.plan.id === SUBSCRIPTION_PLAN_ID) {
                if (subscription.overdue_since === null) {
                  setIsMember(true);
                }
              }
            });
          }
        } catch (e) {
          console.log(e);
        }

        setUser(user as UserInfo);

        const q = query(collection(db, "Users"), where("id", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const userFirestore = querySnapshot.docs.map((doc) => doc.data())[0];

        setFirebaseUser(userFirestore as any);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  async function signIn({ email, password }: SignInCredentials) {
    try {
      setLoading(true);
      const res = await signInWithEmailAndPassword(auth, email, password);

      const user = res.user;
      localStorage.setItem("token", user.refreshToken);
      localStorage.setItem("user", JSON.stringify(user));
      setToken(user.refreshToken);
      setUser(user);
      setLoading(false);
      router.push("/dashboard"); // Redireciona para a página do usuário

      return user;
    } catch (error: any) {
      setLoading(false);
      setError(error);
      return error;
    }
  }

  async function signUp({
    name,
    thumbnail,
    email,
    password,
    phone,
  }: SignUpCredentials) {
    try {
      setLoading(true);

      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;

      await updateProfile(user, {
        displayName: name,
        photoURL: thumbnail,
      });

      await userSchema.validate(
        { name, email, thumbnail, phone },
        { abortEarly: false }
      );

      await setDoc(doc(db, "Users", user.uid), {
        id: user.uid,
        name,
        phone,
        thumbnail: thumbnail || "",
        email,
        createdAt: new Date().toISOString(),
      });

      localStorage.setItem("token", user.refreshToken);
      localStorage.setItem("user", JSON.stringify(user));
      setToken(user.refreshToken);

      setUser(user);
      setLoading(false);
      router.push("/dashboard");

      return user;
    } catch (error: any) {
      setLoading(false);
      setError(error);
      return error;
    }
  }

  async function signOut() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken("");
    await auth.signOut();
    router.push("/login"); // Redireciona para a página de login
  }

  async function updateUser(nome: string, email: string, senha: string) {
    const user = getAuth().currentUser;

    if (user) {
      try {
        await updateProfile(user, { displayName: nome });
        await updateEmail(user, email);
        await updatePassword(user, senha);
      } catch (error) {
        console.error(error);
      }
    }
  }

  function checkEmailVerified() {
    const user = getAuth().currentUser;
    return user ? user.emailVerified : false;
  }

  function verificationEmail() {
    const user = getAuth().currentUser;
    if (user && !checkEmailVerified()) {
      sendEmailVerification(user)
        .then(() => console.log("Email enviado"))
        .catch((error) => console.log(error));
    }
  }

  async function changeProfileImage(photoURL: string) {
    const user = getAuth().currentUser;

    if (user) {
      await updateProfile(user, { photoURL });
      setUser({ ...user, photoURL });
    }
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        firebaseUser,
        setFirebaseUser,
        error,
        loading,
        signIn,
        signUp,
        signOut,
        changeProfileImage,
        updateUser,
        verificationEmail,
        subscriptions,
        isMember,
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
