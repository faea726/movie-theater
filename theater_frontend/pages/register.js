import Layout from "../components/layout";
import { useRouter } from "next/router";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { get_cookie, set_cookie, delete_all_cookies } from "../lib/cookies";
import { useState, useEffect } from "react";

export default function Register() {
  const router = useRouter();
  const [ac_tk, setToken] = useState("");

  useEffect(() => {
    setToken(get_cookie("ac_tk"));
  }, []);

  function register_new(e) {
    e.preventDefault();
    const username = document.getElementById("register-username").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value.trim();
    const password_confirm = document
      .getElementById("register-password-confirm")
      .value.trim();

    if (
      username == "" ||
      email == "" ||
      password == "" ||
      password != password_confirm
    ) {
      alert("invalid input");
      return;
    }

    const data = JSON.stringify({
      username: username,
      email: email,
      password: password,
    });

    fetch("http://127.0.0.1:8000/api/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: data,
    })
      .then((rsp) => {
        if (rsp.status == 201) {
          alert("Register success! You can login now.");
          router.push("/login");
        } else {
          alert("Register failed");
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <Layout>
      {ac_tk == "" ? (
        <Form className="mb-3" onSubmit={register_new}>
          <Form.Group className="mb-3" controlId="register-username">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="username" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="register-email">
            <Form.Label>email</Form.Label>
            <Form.Control type="email" placeholder="email" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="register-password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="password" />
          </Form.Group>

          <Form.Group className="mb-3" controlId="register-password-confirm">
            <Form.Label>Confirm</Form.Label>
            <Form.Control type="password" placeholder="password confirm" />
          </Form.Group>

          <Button variant="primary" type="submit">
            Register
          </Button>
        </Form>
      ) : (
        <h3>Logout first</h3>
      )}
    </Layout>
  );
}
