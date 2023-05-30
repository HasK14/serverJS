class EmailAlreadyBeenUsed extends Error {
  constructor() {
    super("Email already is being used");
  }
}

module.exports = EmailAlreadyBeenUsed;
