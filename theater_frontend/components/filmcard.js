import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

export default function FilmCard({ film }) {
  return (
    <Card style={{ width: "18rem" }} className="p-2 m-3">
      <Card.Img variant="top" src={film["img"]} />
      <Card.Body>
        <Card.Title>{film["name"]}</Card.Title>
        <Card.Text>
          {film["description"]}
        </Card.Text>
        <Button variant="primary" href={"/films/" + film.id}>Watch</Button>
      </Card.Body>
      <Card.Footer>
        {film["categories"].map((category) => category["name"] + " ")}
      </Card.Footer>
    </Card>
  );
}
