import { Component } from "htm0";
import styles from "./2023.css";

export default class Year2023Page extends Component {
  styles = styles;

  render() {
    return (
      <div class="container">
        <main>
          <div class="header">
            <h1>2023 in review (work in progress)</h1>
            <span>by Michael Jach</span>
          </div>

          <div class="item">
            <h2>Best music album</h2>
            <span>Let's start here - Lil Yachty</span>
          </div>

          <div class="item">
            <h2>Best artist</h2>
            <span>Hudson Mohawke</span>
          </div>

          <div class="item">
            <h2>Best game</h2>
            <span>Cyberpunk 2077 2.0</span>
          </div>

          <div class="item">
            <h2>Best movie</h2>
            <span>-</span>
          </div>

          <div class="item">
            <h2>Best TV series</h2>
            <span>Succession Severance Get Gotti</span>
          </div>

          <div class="item">
            <h2>Best podcast episode</h2>
            <span>
              The Really Good Podcast | Mark Cuban Lex Fridman Mark Zuckerberg
            </span>
          </div>

          <div class="item">
            <h2>Best book</h2>
            <span>Adolf Hitler Biography - Bronisław Kurzweil</span>
          </div>

          <div class="item">
            <h2>Best hardware innovation</h2>
            <span>4K/60 ProRes Log on iPhone 15 Pro</span>
          </div>

          <div class="item">
            <h2>Best software innovation</h2>
            <span>ChatGPT 5</span>
          </div>

          <div class="item">
            <h2>Best tech blopper</h2>
            <span>Twitter rebrand to X Next.js SQL</span>
          </div>

          <div class="item">
            <h2>Best personal blopper</h2>
            <span>Krzysztof Gonciarz drugs/use of women</span>
          </div>

          <div class="item">
            <h2>Best comback story</h2>
            <span>Cyberpunk 2077 Atrioc AI porn</span>
          </div>

          <div class="item">
            <h2>Best meme</h2>
            <a href="https://twitter.com/cachedeposits/status/1650534793287806978">
              Link →
            </a>
          </div>
        </main>
      </div>
    );
  }
}
