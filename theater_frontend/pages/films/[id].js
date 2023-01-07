import Layout from "../../components/layout";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { get_cookie } from "../../lib/cookies";

export default function Film() {
  const router = useRouter();
  const { id: film_id } = router.query;

  const [film, setData] = useState(null);
  const [ac_tk, setToken] = useState(null);
  useEffect(() => {
    if (!film_id) {
      return;
    }
    setToken(get_cookie("ac_tk"));
    fetch(`http://127.0.0.1:8000/api/films/${film_id}`)
      .then((rsp) => {
        if (rsp.status != 204) {
          return rsp.json();
        } else {
          return null;
        }
      })
      .then((result) => {
        if (result != null) {
          setData(result);
        }
      });
  }, [film_id]);

  function send_cmt(e) {
    e.preventDefault();
    if (document.getElementById("film-cmt").value.trim() == "") {
      alert("empty comment is not accepted");
      return;
    }
    fetch("http://127.0.0.1:8000/api/comments", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Token ${ac_tk}`,
      },
      body: JSON.stringify({
        film_id: film_id,
        content: document.getElementById("film-cmt").value,
      }),
    })
      .then((rsp) => {
        if (rsp.status == 200) {
          return rsp.json();
        } else {
          return null;
        }
      })
      .then((data) => {
        if (data != null) {
          document.getElementById("film-cmt").value = "";
          setData(data);
        } else {
          alert("error: cannot comment");
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <Layout>
      {film ? (
        <div>
          <h1 className="m-3">
            {film["name"].charAt(0).toUpperCase() + film["name"].slice(1)}
          </h1>
          <video width="500" height="500" controls src={film["video"]} />
          <p className="lead">Description: {film["description"]}</p>
          <p>
            Categories:{" "}
            {film["categories"].map((category) => category["name"] + " ")}
          </p>
          <h4>Comments</h4>
          {film["comment_film"].length > 0
            ? film["comment_film"].map((cmt) => (
                <table key={cmt.id}>
                  <tbody>
                    <tr>
                      <td>
                        {cmt.creator.avatar != null ? (
                          <img
                            src={cmt.creator.avatar}
                            height="25px"
                            width="25px"
                          />
                        ) : null}
                      </td>
                      <td>
                        {cmt.creator.nickname != "" ? (
                          <b>{cmt.creator.nickname}:</b>
                        ) : (
                          <b>{cmt.creator.username}:</b>
                        )}
                      </td>
                      <td>{cmt.content}</td>
                    </tr>
                  </tbody>
                </table>
              ))
            : null}

          {ac_tk && ac_tk != "" ? (
            <Form className="py-3" onSubmit={send_cmt}>
              <Row>
                <Col>
                  <Form.Control
                    type="text"
                    id="film-cmt"
                    placeholder="Say something..."
                  />
                </Col>
                <Col>
                  <Button variant="primary" type="submit">
                    Comment
                  </Button>
                </Col>
              </Row>
            </Form>
          ) : null}
        </div>
      ) : (
        <div>
          <h1>No film</h1>
        </div>
      )}
    </Layout>
  );
}
