export const currencies = [
  {
    value: 0,
    label: "USD - US Dollar - $",
  },
  {
    value: 2,
    label: "EUR - Euro - €",
  },
  {
    value: 1,
    label: "TRY - Turkish Lira - ₺",
  },
];

export const languages = [
    {
      value: "TR",
      label: "Türkçe",
    },
    {
      value: "EN",
      label: "English",
    },
    {
      value: "FR",
      label: "Français",
    },
    {
      value: "ES",
      label: "Español",
    },
    {
      value: "DE",
      label: "Deutsch",
    },
    {
      value: "RU",
      label: "Русский",
    },
  ];


export function getCurrency(str){

  if (str === "USD"){
    return 0;
  }else if (str === "TRY"){
    return 1;
  }else {
    return 2;
  }
}