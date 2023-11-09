import { Component, render } from "wcsx";
import HomePage from "./pages/home";

class AppComponent extends Component {
  render() {
    return <HomePage />;
  }
}

render(AppComponent, document.body);
