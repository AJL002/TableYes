import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import HomePage from "./components/HomePage/HomePage";
import SignupPage from "./components/SignupPage/SignupPage";
import LoginPage from "./components/LoginPage/LoginPage";
import { Container, Nav, Navbar } from "react-bootstrap";

function App() {
  const token = localStorage.getItem("token");
  return (
    <BrowserRouter>
      {token && (
        <Navbar className="nav-bg" variant="light" expand="md">
          <Container>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="ms-auto">
                <Nav.Link as={Link} to={"/logout"}>
                  Logout
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}
      <Switch>
        <Route exact path="/" component={token ? HomePage : LoginPage} />
        <Route path="/signup" component={SignupPage} />
        <Route
          path="/logout"
          component={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
        />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
