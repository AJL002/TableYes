import React, { useState, useRef } from "react";
import { Form, Button, Row, Spinner } from "react-bootstrap";
import { login } from "../../api/index.js";

function LoginPage() {
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailRef = useRef();
  const passwordRef = useRef();

  const onLoginClicked = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);

    if (form.checkValidity() === false) {
      return;
    }

    setLoading(true);

    const loginUser = async () => {
      try {
        const { data } = await login({
          email: emailRef.current.value,
          password: passwordRef.current.value,
        });

        // Show successful message
        setLoading(false);

        // Save data
        localStorage.setItem("idToken", data.idToken);
        localStorage.setItem("accessToken", data.accessToken);
        window.location.href = "/";
      } catch (error) {
        alert(`Error login in: ${error.response.data.message}`);
        setLoading(false);
      }
    };

    loginUser();
  };

  return (
    <div className="root">
      <div className="card-form">
        <Row>
          <Row>
            <h1 className="card-form-title mt-3">Login</h1>
            <div className="form-container">
              <div className="form-content">
                <Form
                  noValidate
                  validated={validated}
                  onSubmit={onLoginClicked}
                >
                  <Form.Group className="mt-2" controlId="formBasicEmail">
                    <Form.Label className="form-label">
                      Email address
                    </Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email address"
                      ref={emailRef}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mt-2" controlId="formBasicPassword">
                    <Form.Label className="form-label">Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter password"
                      ref={passwordRef}
                      required
                    />
                  </Form.Group>
                  <div className="form-button-container">
                    <Button
                      className="mt-3 form-button"
                      variant="success"
                      type="submit"
                      disabled={loading}
                    >
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
                  </div>
                </Form>
              </div>
            </div>
          </Row>
          <Row>
            <div className="m-3">
              <span className="hint-text">
                Need an account? <a href="/signup">Signup</a>
              </span>
            </div>
          </Row>
        </Row>
      </div>
    </div>
  );
}

export default LoginPage;
