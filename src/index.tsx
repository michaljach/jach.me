import { Component, render } from "htm0";
import HomePage from "./pages/home";

class AppComponent extends Component {
  render() {
    return <HomePage />;
  }
}

render(AppComponent, document.body);
