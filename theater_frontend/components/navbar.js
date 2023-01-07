import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { delete_cookie, get_cookie } from "../lib/cookies";

export default function NavBar() {
  const router = useRouter();
  const [categories, setData] = useState(null);
  const [ac_tk, setToken] = useState(null);

  useEffect(() => {
    setToken(get_cookie("ac_tk"));

    fetch("http://127.0.0.1:8000/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  function logout_view(e) {
    e.preventDefault();
    delete_cookie("ac_tk");
    fetch("http://127.0.0.1:8000/api/logout", {
      method: "POST",
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Token ${ac_tk}`,
      },
    })
      .then((rsp) => {
        if (rsp.status == 200) {
          if (window.location.pathname == "/") {
            router.reload("/");
          } else {
            router.push("/");
          }
        }
      })
      .catch((err) => alert(err));
  }

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      bg="dark"
      variant="dark"
      className="rounded-4"
    >
      <Container className="mx-3">
        <Navbar.Brand href="/">Theater</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">All</Nav.Link>
            <Nav.Link href="/new">New</Nav.Link>
            <NavDropdown
              title="Categories"
              id="collasible-nav-dropdown"
              bg="dark"
              variant="dark"
            >
              {categories?.map((category) => (
                <NavDropdown.Item
                  href={`/categories/${category["id"]}`}
                  key={category["id"]}
                >
                  {category["name"].charAt(0).toUpperCase() +
                    category["name"].slice(1)}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
          </Nav>
          {ac_tk && ac_tk != "" ? (
            <Nav>
              <Nav.Link href="/donate">Donate</Nav.Link>
              <Nav.Link href="/profile">Profile</Nav.Link>
              <Nav.Link onClick={logout_view}>Logout</Nav.Link>
            </Nav>
          ) : (
            <Nav>
              <Nav.Link href="/donate">Donate</Nav.Link>
              <Nav.Link href="/login">Login</Nav.Link>
              <Nav.Link href="/register">Register</Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
