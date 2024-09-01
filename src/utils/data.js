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
    value: "NULL",
    label: "Select",
  },
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


export const getCopyrightDesc = (value) => {
   switch(value){
    case 1: return "You state that your work cannot be used or adapted in any way without your permission. (All rights reserved.)";
    case 2: return "If you choose this option, you allow anyone to freely use your story for any purpose. They can print, sell, or even make a movie out of it. (Public Domain)";
    case 3: return "You retain some rights to your story, but you allow others to translate or adapt it as long as they credit you as the original author.";
    case 4: return "By choosing this option, you allow others to edit, adapt, and build upon your story for non-commercial purposes, as long as they credit you as the original author.";
    case 5: return "If you choose this option, you allow your story to be shared without any modifications, as long as they credit you as the original author.";
    case 6: return "If you choose this option, you allow others to adapt and build upon your story for non-commercial purposes, as long as they credit you and share their new creations under the same license terms.";
    case 7: return "If you choose this option, you allow your story to be adapted and built upon for any purpose, including commercial use, as long as they credit you and share their new creations under the same license terms.";
    case 8: return "If you choose this option, you allow your story to be used for any purpose without any modifications, as long as they credit you as the original author.";
   }
}

export const selectOptionsForAuthorType = [
  /*{
    value: 0,
    label: "Owner",
    role:"OWNER"
  },*/
  {
    value: 1,
    label: "Writer",
    role:"WRITER"
  },
  {
    value: 2,
    label: "Viewer",
    role:"VIEWER"
  },
]
/*

1. All Rights Reserved
English: You state that your work cannot be used or adapted in any way without your permission. (All rights reserved.)
2. Public Domain
English: If you choose this option, you allow anyone to freely use your story for any purpose. They can print, sell, or even make a movie out of it. (Public Domain)
3. Creative Commons Attribution (CC BY)
English: You retain some rights to your story, but you allow others to translate or adapt it as long as they credit you as the original author.
4. Creative Commons Attribution-NonCommercial (CC BY-NC)
English: By choosing this option, you allow others to edit, adapt, and build upon your story for non-commercial purposes, as long as they credit you as the original author.
5. Creative Commons Attribution-NonCommercial-NoDerivatives (CC BY-NC-ND)
English: If you choose this option, you allow your story to be shared without any modifications, as long as they credit you as the original author.
6. Creative Commons Attribution-NonCommercial-ShareAlike (CC BY-NC-SA)
English: If you choose this option, you allow others to adapt and build upon your story for non-commercial purposes, as long as they credit you and share their new creations under the same license terms.
7. Creative Commons Attribution-ShareAlike (CC BY-SA)
English: If you choose this option, you allow your story to be adapted and built upon for any purpose, including commercial use, as long as they credit you and share their new creations under the same license terms.
8. Creative Commons Attribution-NoDerivatives (CC BY-ND)
English: If you choose this option, you allow your story to be used for any purpose without any modifications, as long as they credit you as the original author.



1. Tüm Haklar Saklıdır
Türkçe: Çalışmanızın izniniz olmadan hiçbir şekilde kullanılamayacağını veya uyarlanamayacağını belirtirsiniz. (Tüm haklar saklıdır.)
2. Halka Açık Alan
Türkçe: Bu seçeneği tercih ederseniz, herkesin hikayenizi herhangi bir amaçla özgürce kullanmasına izin vermiş olursunuz. Hikayenizi basıp satabilirler ya da bir film haline getirebilirler. (Halka Açık Alan)
3. Creative Commons (CC) İsnadı
Türkçe: Hikayenizin bazı haklarını korursunuz, ancak size atıf yaptıkları sürece başkalarının hikayenizi çevirmesine veya uyarlamasına izin verirsiniz.
4. (CC) Atıf-Gayriticari
Türkçe: Bu seçeneği tercih ederseniz, ticari olmayan amaçlarla hikayenizi düzenlemelerine, uyarlamalarına ve geliştirmelerine izin verirsiniz; ancak sizi orijinal yazar olarak belirtmeleri gerekir.
5. (CC) Atıf-Gayriticari-Türetilemez
Türkçe: Bu seçeneği seçerseniz, hikayeniz üzerinde herhangi bir değişiklik yapılmadan paylaşılmasına izin verirsiniz; ancak sizi asıl yazar olarak göstermeleri gerekir.
6. (CC) Atıf-Gayriticari-LisansDevam
Türkçe: Bu seçeneği seçerseniz, ticari olmayan amaçlarla hikayenizi uyarlamalarına ve geliştirmelerine izin verirsiniz; ancak size atıfta bulunmaları ve oluşturdukları yeni içerikleri aynı lisans koşulları altında paylaşmaları gerekir.
7. (CC) Atıf-LisansDevam
Türkçe: Bu seçeneği seçerseniz, hikayenizin ticari dahil her türlü amaçla uyarlanmasına ve geliştirilmesine izin verirsiniz; ancak size atıfta bulunmaları ve yeni oluşturdukları içerikleri aynı lisans koşulları altında paylaşmaları gerekir.
8. (CC) Atıf-Türetilemez
Türkçe: Bu seçeneği seçerseniz, hikayenizin herhangi bir değişiklik yapılmadan, herhangi bir amaçla kullanılmasına izin verirsiniz; ancak sizi asıl yazar olarak belirtmeleri gerekir.
*/