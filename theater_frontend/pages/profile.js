import Layout from "../components/layout";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useRouter } from "next/router";
import { get_cookie, delete_cookie } from "../lib/cookies";
import { useEffect, useState } from "react";

export default function Profile() {
  const router = useRouter();
  const [ac_tk, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setToken(get_cookie("ac_tk"));
    if (!ac_tk) {
      return;
    }

    fetch("http://127.0.0.1:8000/api/profile", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Token ${ac_tk}`,
      },
    })
      .then((rsp) => {
        if (rsp.status != 200) {
          return null;
        } else {
          return rsp.json();
        }
      })
      .then((data) => {
        if (data != null) {
          setUser(data);
        } else {
          delete_cookie("ac_tk");
          alert("Authentication failed. Please login again");
        }
      });
  }, [ac_tk]);

  function update_profile(e) {
    e.preventDefault();
    let form = new FormData();
    // Default
    if (document.getElementById("profile-password").value != "") {
      if (
        document.getElementById("profile-password").value ==
        document.getElementById("profile-password-confirm").value
      ) {
        form.append(
          "password",
          document.getElementById("profile-password").value
        );
      } else {
        alert("Password not match!");
        return;
      }
    }
    if (document.getElementById("profile-email").value != "") {
      form.append("email", document.getElementById("profile-email").value);
    }
    // Premium
    if (document.getElementById("profile-nickname").value != "") {
      form.append(
        "nickname",
        document.getElementById("profile-nickname").value
      );
    }
    if (document.getElementById("profile-avatar").files.length > 0) {
      form.append("avatar", document.getElementById("profile-avatar").files[0]);
    }

    fetch("http://127.0.0.1:8000/api/profile", {
      method: "PUT",
      headers: {
        Authorization: `Token ${ac_tk}`,
      },
      body: form,
    })
      .then((rsp) => {
        if (rsp.status == 202) {
          return null;
        } else {
          return rsp.json();
        }
      })
      .then((data) => {
        if (data == null) {
          router.push("/");
        } else {
          alert(data);
        }
      })
      .catch((err) => console.log(err));
  }

  const [need_conirm, setConfirm] = useState(false);
  function pscf_hdl(e) {
    e.preventDefault();
    if (e.target.value != "") {
      setConfirm(true);
    } else {
      setConfirm(false);
    }
  }

  return (
    <Layout>
      {user ? (
        <div>
          <h2>
            <strong>
              {user.username}{" "}
              {user.is_premium && user.nickname != ""
                ? ` (${user.nickname}) `
                : null}{" "}
            </strong>
            {user.is_premium ? (
              <img src="/favicon.ico" width="15" height="15" alt="premium" />
            ) : null}
          </h2>
          <div>
            <img src={user.avatar} width="100" height="100" />
          </div>

          <Form className="py-3" onSubmit={update_profile}>
            {user.is_premium ? (
              <Form.Group className="mb-3" controlId="profile-nickname">
                <Form.Label>New Nickname</Form.Label>
                <Form.Control type="text" placeholder={user.nickname} />
              </Form.Group>
            ) : null}

            {user.is_premium ? (
              <Form.Group className="mb-3" controlId="profile-avatar">
                <Form.Label>Avatar</Form.Label>
                <Form.Control type="file" multiple />
              </Form.Group>
            ) : null}

            <Form.Group className="mb-3" controlId="profile-email">
              <Form.Label>New Email</Form.Label>
              <Form.Control type="email" placeholder={user.email} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="profile-password">
              <Form.Label>New Password</Form.Label>
              <Form.Control type="password" onChange={pscf_hdl} />
            </Form.Group>

            {need_conirm ? (
              <Form.Group className="mb-3" controlId="profile-password-confirm">
                <Form.Label>Confirm password</Form.Label>
                <Form.Control type="password" placeholder="Confirm password" />
              </Form.Group>
            ) : null}

            <Button variant="primary" type="submit">
              Save
            </Button>
          </Form>

          <p>
            <i>Leave a field blank if don't want to update that field</i>
          </p>
        </div>
      ) : (
        <div>
          <h1>Login...</h1>
        </div>
      )}
    </Layout>
  );
}
