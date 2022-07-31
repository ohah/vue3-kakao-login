import { App } from "vue";
import { script } from "@/KakaoLogin";
import { KakaoAuth } from "@/KaKaoLoginPlugin";
export const Auth:KakaoAuth = {} as KakaoAuth;
export let initialize: ()=> Promise<void>;

export function isInitialized() {
  return initialize();
}

export default async (app: App, options: { apiKey: string, url?:string } = { apiKey: "" , url: "https://developers.kakao.com/sdk/js/kakao.min.js"}) => {
  options = {
    ...options,
    url: options.url || "https://developers.kakao.com/sdk/js/kakao.min.js",
    apiKey: options.apiKey || ""
  }
  if(!options.apiKey) {
    alert('api키(javascript)값을 입력해주세요');
  }
  initialize = script({
    apiKey: options.apiKey,
    url: options.url
  })
  window.addEventListener("DOMContentLoaded", async () => {
    initialize();
  });
  // const Kakao = Symbol() as InjectionKey<KakaoAuth>
  app.provide("Kakao", Auth);
};
