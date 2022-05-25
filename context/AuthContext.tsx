import { User } from "@firebase/auth";
import {
  createContext,
  FC,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
  useContext,
} from "react";
import { auth } from "../firebase";
import { fetchApi, queries } from "../utils/Fetching";
import Cookies from 'js-cookie'
import { signInWithCustomToken } from "firebase/auth";
import jwtDecode from 'jwt-decode'

export interface UserMax extends User {
  city?: string;
  country?: string;
  weddingDate?: Date;
  role?: string[];
  accessToken?: string;
  _id?: string;
}

type Context = {
  user: Partial<UserMax | null>;
  setUser: Dispatch<SetStateAction<Partial<UserMax | null>>>;
};

const initialContext: Context = {
  user: null,
  setUser: (user) => {},
};

interface tokenDecode {
  iss:            string;
  name:           string;
  picture:        string;
  aud:            string;
  auth_time:      number;
  user_id:        string;
  sub:            string;
  iat:            number;
  exp:            number;
  email:          string;
  email_verified: boolean;
  firebase:       Firebase;
}

interface Firebase {
  identities:       Identities;
  sign_in_provider: string;
}

interface Identities {
  "google.com": string[];
  email:        string[];
}

const AuthContext = createContext<Context>(initialContext);

const AuthProvider: FC <any> = ({ setLoading, children }) => {
  const [user, setUser] = useState<Partial<UserMax | null>>(null);

  const SessionWithCustomToken = async (sessionCookie : string) => {
    const result = await fetchApi({
      query: queries.authStatus,
      variables: { sessionCookie },
    });

    if(result?.customToken){
      console.info("Llamo con mi sessionCookie para traerme customToken");
      console.info("Custom token", result.customToken)
      result.customToken && signInWithCustomToken(auth, result.customToken);
      console.info("Hago sesion con el custom token");

    }
  }


  useEffect(() => {
    setLoading(true)
    auth.onAuthStateChanged(async (user: any) => {
      const sessionCookie = Cookies.get("sessionBodas");
      console.info("Verificando cookie", sessionCookie);
      if (sessionCookie) {
        console.info("Tengo cookie de sesion");
        if (user) {
          Cookies.set("idToken", await user.getIdToken(), {expires: 1})
          console.info("Tengo user de contexto firebase");
          const tokenDecode:tokenDecode = jwtDecode(sessionCookie)
          if(tokenDecode?.sub === user?.uid){
            console.info("Coincide user con sessionCookie");
            const moreInfo = await fetchApi({
              query: queries.getUser,
              variables: { uid: user?.uid },
            });
            moreInfo && console.info("Tengo datos de la base de datos");
            setUser({ ...user, ...moreInfo });
            console.info("Guardo datos en contexto react");
          } else {
            console.info("No coincide user con sessionCookie");
            SessionWithCustomToken(sessionCookie)
          }
        } else {
          console.info("NO tengo user de contexto de firebase");
          SessionWithCustomToken(sessionCookie)
        }
      }
      setLoading(false)
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

const AuthContextProvider = () => useContext(AuthContext);

export { AuthProvider, AuthContextProvider };
