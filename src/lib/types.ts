export enum FormFieldType {
  INPUT = "input",
  TEXT = "text",
  PASSWORD = "password",
  NUMBER = "number",
  NUMERIC_ONLY = "numericOnly",
  FILE = "file",
  CHECKBOX = "checkbox",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  DATE = "date",
  MONTH = "month",
  YEAR = "year",
  SELECT = "select",
  SELECT_ITEM = "selectItem",
  SKELETON = "skeleton",
  DATETIME = "datetime",
}

export type ComboXSelect = {
  value: string | number
  label?: string
}
