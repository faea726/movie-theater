import Layout from "../components/layout";
import FilmCard from "../components/filmcard";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useEffect, useState } from "react";

export default function New() {
  const [films, setData] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/films")
      .then((res) => res.json())
      .then((data) => {
        data.sort(function (a, b) {
          if (a.id < b.id) return 1;
          if (a.id > b.id) return -1;
          return 0;
        });
        setData(data);
      });
  }, []);

  return (
    <Layout>
      <h1>Home</h1>
      <Row xs={1} md={3} className="g-4">
        {films?.map((item) => (
          <Col key={item["id"]}>
            <FilmCard film={item} />
          </Col>
        ))}
      </Row>
    </Layout>
  );
}
