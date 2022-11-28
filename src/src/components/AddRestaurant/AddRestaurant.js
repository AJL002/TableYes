import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { submitRestaurant } from "../../api";

function AddRestaurant(props) {
  const [validated, setValidated] = useState(false);
  const [show, setShow] = useState(true);
  const { handleOnClosed, handleOnSubmitted } = props;
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
  const [loading, setLoading] = useState(false);

  const restaurantNameRef = useRef();
  const restaurantEmailRef = useRef();
  const restaurantlocationID = useRef();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCoordinates({ lat: latitude, lng: longitude });
      }
    );
  }, []);

  const onClosed = () => {
    setShow(false);
    handleOnClosed();
  };

  const onSubmitClicked = (event) => {
    const saveRestaurant = async () => {
      try {
        setLoading(true);
        await submitRestaurant({
          fullname: restaurantNameRef.current.value,
          email: restaurantEmailRef.current.value,
          lat: coordinates.lat,
          long: coordinates.lng,
          token: localStorage.getItem("accessToken"),
          locationID: restaurantlocationID.current.value
        },
        );

        // Hide spinner
        setLoading(false);

        // Hide modal
        setShow(false);
        handleOnSubmitted();
      } catch (error) {
        alert(`Error submitting restaurant: ${error.response.data.message}`);
        setLoading(false);
      }
    };

    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);

    if (form.checkValidity() === false) return;

    saveRestaurant();
  };

  return (
    <Modal show={show} onHide={onClosed}>
      <Modal.Header closeButton>
        <Modal.Title>Add your restaurant</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated} onSubmit={onSubmitClicked}>
          <Form.Group className="mt-2" controlId="formBasicName">
            <Form.Label>Restaurant name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter the restaurant name"
              ref={restaurantNameRef}
              required
            />
          </Form.Group>

          <Form.Group className="mt-2" controlId="formBasicEmail">
            <Form.Label className="form-label">Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email address"
              ref={restaurantEmailRef}
              required
            />
          </Form.Group>

          <Form.Group className="mt-2" controlId="formBasicLat">
            <Form.Label>Latitude</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter the restaurant latitude"
              value={coordinates.lat}
              onChange={(e) => {
                setCoordinates({ lat: e.target.value, lng: coordinates.lng });
              }}
              required
            />
          </Form.Group>

          <Form.Group className="mt-2" controlId="formBasicLng">
            <Form.Label>Longitude</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter the restaurant longitude"
              value={coordinates.lng}
              onChange={(e) => {
                setCoordinates({ lat: coordinates.lat, lng: e.target.value });
              }}
              required
            />
          </Form.Group>

          <Form.Group className="mt-2" controlId="formBasicLocationID">
            <Form.Label>Restaurant name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter location ID"
              ref={restaurantlocationID}
              required
            />
          </Form.Group>

          <Button className="m-2" variant="secondary" onClick={onClosed}>
            Close
          </Button>

          <Button className="m-2" type="submit" variant="success">
            <span>Submit</span>
            <Spinner
              as="span"
              animation="grow"
              size="sm"
              role="status"
              aria-hidden="true"
              variant="dark"
              className={loading ? "" : "visually-hidden"}
            />
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
export default AddRestaurant;
