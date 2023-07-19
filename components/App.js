import InputBox from "./InputBox.js";
import SelectedLanguage from "./SelectedLanguage.js";

export class App {
  constructor($app) {
    this.state = {
      selection: [],
    };

    this.onSelect = (language) => {
      if (language) {
        alert(language);

        const newSelection = [...this.state.selection];

        const index = newSelection.indexOf(language);
        if (index > -1) {
          newSelection.splice(index, 1);
        }
        newSelection.push(language);

        while (newSelection.length > 5) {
          newSelection.shift();
        }

        this.setState({ selection: newSelection });
        SelectedLanguage.setState({ selection: newSelection });
      }
    };

    new SelectedLanguage({
      $app,
      selection: this.state.selection,
      onSelect: this.onSelect.bind(this),
    });

    new InputBox({
      $app,
      selection: this.state.selection,
      onSelect: this.onSelect.bind(this),
    });

    this.setState = (nextState) => {
      this.state = nextState;
    };
  }
}
