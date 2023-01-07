import SSRProvider from "react-bootstrap/SSRProvider";
import Head from "next/head";
import Container from "react-bootstrap/Container";
import NavBar from "./navbar";

export default function Layout({ children }) {
  return (
    <SSRProvider>
      <Container>
        <header>
          <Head>
            <title>Theater</title>
            <meta name="description" content="Theater for your own movies" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
        </header>
        <NavBar />
        <main className="m-3">{children}</main>
      </Container>
    </SSRProvider>
  );
}
