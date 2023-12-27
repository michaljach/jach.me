import { Component } from "htm0";
import styles from "./2023.css";

export default class Year2023Page extends Component {
  styles = styles;

  render() {
    return (
      <div class="container">
        <main>
          <div class="header">
            <h1>2023 in review</h1>
            <span>by Michael Jach</span>
          </div>

          <div class="item">
            <h2>Best music album</h2>
            <span>Let's start here — Lil Yachty</span>
          </div>

          <div class="item">
            <h2>Best artist/creator</h2>
            <span>Hudson Mohawke</span>
            <div class="item-addon">
              <span>Honorable mentions: Jack Sather</span>
            </div>
          </div>

          <div class="item">
            <h2>Best game</h2>
            <span>Hogwarts Legacy</span>
            <div class="item-addon">
              <span>
                Honorable mentions: Disco Elysium, Cyberpunk 2077 2.0, Baldurs
                Gate 3
              </span>
            </div>
          </div>

          <div class="item">
            <h2>Best movie</h2>
            <span>Where the Crawdads Sing</span>
            <div class="item-addon">
              <span>
                Honorable mentions: The Outsider, Alien Covenant, The Killer,
                The system was blinking red, Air, Oppenheimer, Barbie
              </span>
            </div>
          </div>

          <div class="item">
            <h2>Best TV series</h2>
            <span>Succession</span>
            <div class="item-addon">
              <span>
                Honorable mentions: How to become a Mob boss, Severance, Get
                Gotti, Fear City
              </span>
            </div>
          </div>

          <div class="item">
            <h2>Best podcast episode</h2>
            <span>The Really Good Podcast — Mark Cuban</span>
            <div class="item-addon">
              <span>
                Honorable mentions: Lex Fridman with Mark Zuckerberg, Stan
                Wyjątkowy - Wybory 2023 (PL), Piers Morgan vs HasanAbi On
                Palestine-Israel Conflict and War
              </span>
            </div>
          </div>

          <div class="item">
            <h2>Best book</h2>
            <span>Dune — Frank Herbert</span>
            <div class="item-addon">
              <span>
                Honorable mentions: Adolf Hitler Biography - Bronisław Kurzweil,
                Foundation Prelude — Asimov
              </span>
            </div>
          </div>

          <div class="item">
            <h2>Best hardware innovation</h2>
            <span>4K/60 ProRes Log on iPhone 15 Pro</span>
          </div>

          <div class="item">
            <h2>Best software innovation</h2>
            <span>ChatGPT 4.5</span>
            <div class="item-addon">
              <span>Honorable mentions: Make real by Tldraw</span>
            </div>
          </div>

          <div class="item">
            <h2>Best tech blopper</h2>
            <span>Twitter rebrand to X</span>
            <div class="item-addon">
              <span>Honorable mentions: Next.js inline SQL</span>
            </div>
          </div>

          <div class="item">
            <h2>Best comback story</h2>
            <span>Cyberpunk 2077</span>
            <div class="item-addon">
              <span>
                Honorable mentions: Atrioc AI Porn scandal, 2023 Polish
                parliamentary election
              </span>
            </div>
          </div>

          <div class="item">
            <h2>Best meme</h2>
            <a href="https://twitter.com/cachedeposits/status/1650534793287806978">
              Link →
            </a>
          </div>

          <div class="item">
            <h2>Best photo</h2>
            <a href="https://twitter.com/ennntropy/status/1610831450663784448/photo/1">
              Link →
            </a>
          </div>

          <div class="item">
            <h2>Best Twitter thread</h2>
            <a href="https://twitter.com/wxbx4/status/1661649415910612992">
              Link →
            </a>
          </div>
        </main>
      </div>
    );
  }
}
