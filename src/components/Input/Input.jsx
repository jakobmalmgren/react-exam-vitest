import "./Input.scss";

function Input({
  label,
  type,
  customClass,
  name,
  handleChange,
  defaultValue,
  disabled,
  maxLength,
  // la till data-testid för du har ej skickat med name props till
  // Input komponenten o då kan ja ej nå de via getbylabeltext ex..
  // så för o nå de la ja till det, så la även till rest för nå de..
  ...rest
}) {
  return (
    <section className="input">
      <label className="input__label" htmlFor={name}>
        {label}
      </label>
      <input
        input
        id={name}
        type={type}
        className={`input__field ${customClass ? customClass : ""}`}
        name={name}
        onChange={handleChange}
        defaultValue={defaultValue ? defaultValue : ""}
        maxLength={maxLength}
        disabled={disabled}
        // och här
        {...rest}
      />
    </section>
  );
}

export default Input;
