import { Component } from "htm0";
import styles from "./home.css";

export default class HomePage extends Component {
  styles = styles;

  render() {
    return (
      <div class="container">
        <main>
          <header>
            <h1>Michael Jach</h1>
            <span>Software engineer</span>
          </header>

          <div>
            I craft fast and beautiful user interfaces and apps using modern
            technologies like <a href="https://react.dev/">React</a>, <a href="https://github.com/michaljach/htm0">htm0</a> or{" "}
            <a href="https://developer.apple.com/xcode/swiftui/">SwiftUI</a>{" "}
            (iOS). I'm a huge believer in open source, you can check my code on{" "}
            <a href="https://github.com/michaljach">Github</a>. I share my
            thoughts and likes on{" "}
            <a href="https://twitter.com/michaeljach/likes">Twitter</a> and I'm
            also reachable via email.
          </div>

          <ul class="links">
            <li>
              <a href="https://github.com/michaljach">Open source</a>
            </li>
            <li>
              <a href="mailto:michaljach@gmail.com?subject=jach.me">Contact</a>
            </li>
          </ul>

          <section class="thoughts">
            <h2>Thoughts</h2>

            <ul class="items">
              <li class="item">
                <a href="2023">
                  <h3>2023 in review</h3>
                  <span>
                    My take on best movies, shows, music, artists and bloopers
                    from this year.
                  </span>
                </a>
              </li>

              <li class="item">
                <a href="items">
                  <h3>69 items</h3>
                  <span> I own 69 items. Here is the list. </span>
                </a>
              </li>
            </ul>
          </section>
        </main>
      </div>
    );
  }
}
