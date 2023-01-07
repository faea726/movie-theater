import Layout from "../components/layout";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { get_cookie, set_cookie, delete_cookie } from "../lib/cookies";

export default function Login() {
  const router = useRouter();

  const [ac_tk, setToken] = useState(null);
  useEffect(() => {
    setToken(get_cookie("ac_tk"));
  }, []);

  function login_view(e) {
    e.preventDefault();
    fetch("http://127.0.0.1:8000/api/login", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: document.getElementById("login-username").value,
        password: document.getElementById("login-password").value,
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
          delete_cookie("ac_tk");
          set_cookie("ac_tk", data["token"], 2);
          router.push("/");
        } else {
          alert("login failed");
        }
      })
      .catch((err) => alert(err));
  }

  return (
    <Layout>
      {ac_tk == null || ac_tk == "" ? (
        <Form className="py-3" onSubmit={login_view}>
          <Form.Group className="mb-3" controlId="login-username">
            <Form.Label>Username</Form.Label>
            <Form.Control type="username" placeholder="username" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="login-password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>

          <Button variant="primary" type="submit">
            Login
          </Button>
        </Form>
      ) : (
        <h3>Already login</h3>
      )}
      <i>
        Not have an account yet? Please <a href="/register">register here</a>!
      </i>
    </Layout>
  );
}
