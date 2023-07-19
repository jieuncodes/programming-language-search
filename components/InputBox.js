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

        const renderedSuggestions = this.state.resultState
          .map((item, index) => {
            const regex = new RegExp(`(${this.input.value.trim()})`, "gi");
            const highlightedItem = item.replace(
              regex,
              '<span class="Suggestion__item--matched">$1</span>'
            );

            const isSelected = index === this.state.selectedIndex;
            const listItemClass = isSelected
              ? "Suggestion__item--selected"
              : "";

            return `
                    <li data-index="${index}" class="${listItemClass}">
                        ${highlightedItem}
                    </li>`;
          })
          .join("");

        this.suggestionContainer.innerHTML = `<ul>${renderedSuggestions}</ul>`;
        this.state.isSuggestionOn = true;

        this.suggestionContainer.querySelectorAll("li").forEach((li) => {
          li.addEventListener("click", (e) => {
            const languageText = e.target.textContent.trim();
            this.onSelect(languageText);
          });
        });
      }
    };

    this.bindEvents();
    this.render();
  }

  debounce = (func, delay) => {
    let inDebounce;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(inDebounce);
      inDebounce = setTimeout(() => func.apply(context, args), delay);
    };
  };

  bindEvents() {
    this.input.addEventListener(
      "input",
      this.debounce(this.handleInput.bind(this), 200)
    );
    this.input.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  handleInput = async (e) => {
    const typedValue = e.target.value;
    if (typedValue === "") {
      this.setState({ resultState: [] });
      return;
    } else {
      try {
        const res = await fetchSearchResult(typedValue);
        this.setState({ resultState: res });
      } catch (error) {
        console.error("Failed to fetch search result:", error);
      }
    }
  };

  handleKeyDown = (e) => {
    if (e.defaultPrevented) {
      return;
    }
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
        e.preventDefault();
        if (this.state.isSuggestionOn && this.state.selectedIndex >= 0) {
          this.onSelect(this.state.resultState[this.state.selectedIndex]);
        }
        break;
      default:
        break;
    }
  };
}
