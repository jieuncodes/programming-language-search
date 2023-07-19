export default class SelectedLanguage {
  constructor({ $app, selection = [], onSelect }) {
    this.$target = document.createElement("div");
    this.$target.className = "SelectedLanguage";
    $app.appendChild(this.$target);

    this.state = {
      selection: selection,
    };

    this.setState = (nextState) => {
      this.state = nextState;
      this.render();
    };

    this.onSelect = onSelect;

    this.render = () => {
      this.$target.innerHTML = `
                <ul>${this.state.selection
                  .map((item) => `<li>${item}</li>`)
                  .join("")}
                </ul>
            `;
    };

    this.render();
  }
}
