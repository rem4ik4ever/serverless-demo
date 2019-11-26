import React from "react";
import { Router, Link, navigate } from "@reach/router";
import { useNetlifyIdentity } from "react-netlify-identity";
import useLoading from "../hooks/useLoading";

let IdentityContext = React.createContext();

function PrivateRoute(props) {
  console.log("Identity Context", IdentityContext);
  const identity = React.useContext(IdentityContext);
  let { as: Comp, ...rest } = props;
  return identity.user ? (
    <Comp {...rest} />
  ) : (
    <div>
      <h3>You are trying to view a protected page. Please log in</h3>
      <Login />
    </div>
  );
}

const Home = () => {
  return <div>This is Home</div>;
};

const About = () => {
  return <div>This is about </div>;
};

const AuthForm = ({ title, actionTitle, onSubmit, formRef }) => {
  return (
    <div>
      <form onSubmit={onSubmit} ref={formRef}>
        <h1>{title}</h1>
        <label htmlFor="email">
          Email: <input type="email" name="email" />
        </label>
        <label htmlFor="password">
          Password: <input type="password" name="password" />
        </label>

        <input type="submit" name="submit" label={actionTitle} />
      </form>
    </div>
  );
};

const Login = () => {
  const formRef = React.createRef();
  const { loginUser } = React.useContext(IdentityContext);
  const [msg, setMsg] = React.useState("");
  const [isLoading, load] = useLoading();

  const login = event => {
    event.preventDefault();
    const email = formRef.current.email.value;
    const password = formRef.current.password.value;
    load(loginUser(email, password))
      .then(user => {
        console.log("Success! Signed up", user);
        navigate("home");
      })
      .catch(err => console.error(err) || setMsg("Error: " + err.message));
  };
  if (isLoading) return "Loading...";
  return (
    <div>
      {msg}
      <AuthForm
        title="Sign In"
        actionTitle="Submit"
        onSubmit={login}
        formRef={formRef}
      />
    </div>
  );
};

const SignUp = () => {
  const formRef = React.createRef();
  const { signupUser } = React.useContext(IdentityContext);
  const [msg, setMsg] = React.useState("");
  const [isLoading, load] = useLoading();
  const signup = event => {
    event.preventDefault();
    const email = formRef.current.email.value;
    const password = formRef.current.password.value;
    load(signupUser(email, password))
      .then(user => {
        console.log("Success! Signed up", user);
        navigate("home");
      })
      .catch(err => console.error(err) || setMsg("Error: " + err.message));
  };
  if (isLoading) return "Loading...";
  return (
    <div>
      {msg}
      <AuthForm
        label="Sign Up"
        onSubmit={signup}
        formRef={formRef}
        actionTitle="Register"
      />
    </div>
  );
};

const SecretStuff = () => {
  return <div>Ah I see you have permissions to see this! Welcome!</div>;
};

const Main = () => {
  const url = "https://rem4ik-serverless-demo.netlify.com";
  const identity = useNetlifyIdentity(url);
  return (
    <IdentityContext.Provider value={identity}>
      <div>
        <nav>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/sign-up">Sign Up</Link>
          </li>
          <li>
            <Link to="/secret-stuff">Secret Stuff</Link>
          </li>
        </nav>
      </div>

      <Router>
        <About path="/about" />
        <Login path="/login" />
        <SignUp path="/sign-up" />
        <PrivateRoute as={SecretStuff} path="/secret-stuff" />
        <Home path="/" />
      </Router>
    </IdentityContext.Provider>
  );
};

export default Main;
