import { Auth } from "./build";

export default (options:{apiKey:string, url:string}) => {
  return () => new Promise<void>((resolve, reject) => {
    const { apiKey, url } = options;
    if(window.Kakao) {
      resolve();
    }
    const { length } = document.scripts
    for (let i = 0; i < length; i++) {
      const item = document.scripts.item(i)
      if(item.src.includes(url)) {
        resolve();
        // Object.assign(Auth, window.Kakao);
      }
    }
   
    const KakaoScript = document.createElement('script');
    KakaoScript.src = url;
    KakaoScript.charset = 'utf-8';
    KakaoScript.async = true;
    KakaoScript.defer = true;
    document.body.appendChild(KakaoScript);
    KakaoScript.onload = () => {
      Object.assign(Auth, window.Kakao);
      Auth.init(apiKey);
      resolve();
    };
    KakaoScript.onerror = () => {
      reject();
    };
  });
}

// export const isInitialized = () => {
//   if(!window.Kakao) {
//     return false;
//   }

//   return window.Kakao.isInitialized();
// }

declare global {
  interface Window {
    Kakao:any;
  }
}
