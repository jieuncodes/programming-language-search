import { fetchSearchResult } from "../api.js";

export default class InputBox {
  constructor({ $app, onSelect }) {
    this.$target = document.createElement("form");
    this.$target.className = "SearchInput";
    $app.appendChild(this.$target);
    this.input = document.createElement("input");
    this.input.className = "SearchInput__input";
    this.input.type = "text";
    this.input.placeholder = "프로그램 언어를 입력하세요.";
    this.$target.appendChild(this.input);

    this.suggestionContainer = document.createElement("div");
    this.suggestionContainer.className = "Suggestion";
    this.suggestionContainer.style.visibility = "hidden";

    this.onSelect = onSelect;
    $app.appendChild(this.suggestionContainer);

    this.state = {
      resultState: [],
      selectedIndex: 0,
      isSuggestionOn: false,
    };

    this.setState = (nextState) => {
      this.state = { ...this.state, ...nextState };
      console.log("render");
      this.render();
    };

    this.render = () => {
      if (this.state.resultState.length === 0) {
        this.suggestionContainer.style.visibility = "hidden";
        this.state.isSuggestionOn = false;
      } else {
        this.suggestionContainer.style.visibility = "visible";
        this.suggestionContainer.innerHTML = `
                <ul>${this.state.resultState
                  .map((item, index) => {
                    return `<li data-index="${index}" class="
                    ${
                      this.input.value == item.trim()
                        ? "Suggestion__item--matched"
                        : index === this.state.selectedIndex
                        ? "Suggestion__item--selected"
                        : ""
                    }">
                        ${item}</li>`;
                  })
                  .join("")}
                </ul>`;
        this.state.isSuggestionOn = true;

        this.suggestionContainer.querySelectorAll("li").forEach((li) => {
          li.addEventListener("click", (e) => {
            const languageText = e.target.textContent.trim();
            this.onSelect(languageText);
          });
        });
      }
      this.input.focus();
    };

    this.input.addEventListener("input", async (e) => {
      const typedValue = e.target.value;
      if (typedValue === "") {
        this.setState({ resultState: [] });
        return;
      } else {
        const res = await fetchSearchResult(typedValue);
        this.setState({ resultState: res });
      }
    });

    this.input.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          this.setState({
            selectedIndex:
              this.state.selectedIndex === 0
                ? this.state.resultState.length - 1
                : this.state.selectedIndex - 1,
          });
          break;
        case "ArrowDown":
          e.preventDefault();
          this.setState({
            selectedIndex:
              this.state.selectedIndex >= this.state.resultState.length - 1
                ? 0
                : this.state.selectedIndex + 1,
          });
          break;
        case "Enter":
          if (this.state.isSuggestionOn && this.state.selectedIndex >= 0) {
            window.alert(this.state.resultState[this.state.selectedIndex]);
          }
          break;
        default:
          break;
      }
    });

    this.render();
  }
}
