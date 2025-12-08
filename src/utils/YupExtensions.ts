import * as Yup from "yup";

const arabicRegex = /^[\u0600-\u06FF\s]+$/;
const englishRegex = /^[A-Za-z\s]+$/;
const noLettersRegex = /^[^A-Za-z]+$/;
const noSymbolsRegex = /^[A-Za-z0-9\s]+$/;

Yup.addMethod(Yup.string, "arabicOnly", function (message) {
  return this.test("arabic-only", message, (value) => {
    if (!value) return true;
    return arabicRegex.test(value);
  });
});

Yup.addMethod(Yup.string, "englishOnly", function (message) {
  return this.test("english-only", message, (value) => {
    if (!value) return true;
    return englishRegex.test(value);
  });
});

Yup.addMethod(Yup.string, "noLetters", function (message) {
  return this.test("no-letters", message, (value) => {
    if (!value) return true;
    return noLettersRegex.test(value);
  });
});

Yup.addMethod(Yup.string, "noSymbols", function (message) {
  return this.test("no-symbols", message, (value) => {
    if (!value) return true;
    return noSymbolsRegex.test(value);
  });
});

declare module "yup" {
  interface StringSchema {
    arabicOnly(message?: string): this;
    englishOnly(message?: string): this;
    noLetters(message?: string): this;
    noSymbols(message?: string): this;
  }
}

export default Yup;
