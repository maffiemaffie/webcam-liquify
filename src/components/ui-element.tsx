type UIElementInputType = {
  name: string;
  type: string;
}

interface UIElement {
  getInputs(): UIElementInputType[];
  updateInput(input: string, newValue: any): void;
}

const TransformerUIElement = ({transformer}: {transformer: UIElement}) => {
  const makeInputs = (inputs: UIElementInputType[]) => {
    const count = document.querySelectorAll('.transformer-controls').length;

    return inputs.map((input, i) => {
      const id = `transformer-${count}-input-${i}`;
      return (
        <div className="transformer-control">
          <label htmlFor={id}>{input.name}</label>
          <input id={id} type={input.type}/>
        </div>
      );
    });
  };

  return (
    <form className="transformer-controls">
      {makeInputs(transformer.getInputs())}
    </form>
  );
};