import Layout from "../../components/layout";
import Button from "react-bootstrap/Button";

export default function Films() {
  return (
    <Layout>
      <h1>Please choose a specific film</h1>
      <Button variant="primary" href="/">
        Back To Home
      </Button>
    </Layout>
  );
}
