import Layout from "../../components/layout";
import FilmCard from "../../components/filmcard";
import { useRouter } from "next/router";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useState, useEffect } from "react";

export default function Category() {
  const router = useRouter();
  const { id } = router.query;

  const [films, setData] = useState(null);
  useEffect(() => {
    if (!id) {
      return;
    }
    fetch("http://127.0.0.1:8000/api/films")
      .then((res) => res.json())
      .then((data) => {
        data = data.filter((item) => {
          const ctgs = item["categories"];
          if (ctgs.find((e) => e.id == id)) {
            return true;
          } else {
            return false;
          }
        });
        setData(data);
      });
  }, [id]);

  return (
    <Layout>
      <h1>Category</h1>
      <Row xs={1} md={2} className="g-4">
        {films?.map((item) => (
          <Col key={item["id"]}>
            <FilmCard film={item} />
          </Col>
        ))}
      </Row>
    </Layout>
  );
}
