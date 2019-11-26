import React from "react";
import logo from "./logo.svg";
import "./App.css";
import ApolloClient from "apollo-boost";
import { gql } from "apollo-boost";
import { ApolloProvider, useQuery } from "@apollo/react-hooks";
import Main from "./components/main";

const client = new ApolloClient({
  uri: "/.netlify/functions/apollo-graphql"
});

const HELLO_QUERY = gql`
  {
    hello
  }
`;

function HelloComponent() {
  const { loading, error, data } = useQuery(HELLO_QUERY);

  if (loading) return <p>Loading... </p>;
  if (error) return <p>Error: ({error})</p>;
  console.log(data);
  return <p>Hey there! {data.hello}</p>;
}

const HelloButton = () => {
  const callHello = async e => {
    e.preventDefault();
    const response = await fetch("/.netlify/functions/hello").then(response =>
      response.json()
    );
    console.log(response);
  };
  return <button onClick={callHello}>Click me!</button>;
};

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Main />
      </div>
    </ApolloProvider>
  );
}

export default App;
