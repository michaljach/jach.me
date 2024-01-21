import { Component, render, Router } from "htm0";
import HomePage from "./pages/home/home";
import ItemsPage from "./pages/items/items";
import Year2023Page from "./pages/2023/2023";
import PrivacyPage from "./pages/privacy/privacy";

class AppComponent extends Component {
  render() {
    return (
      <Router
        routes={{
          "/": <HomePage />,
          "/items": <ItemsPage />,
          "/2023": <Year2023Page />,
          "/privacy": <PrivacyPage />,
        }}
      />
    );
  }
}

render(AppComponent, document.body);
