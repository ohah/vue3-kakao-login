## kakao-login
[Official Kako Login](https://developers.kakao.com/tool/demo/login/login)
[developer Documents](https://developers.kakao.com/sdk/reference/js/release/Kakao.html)

## vue3-kakao-login
Vue 3 + TypeScript + Vite
## Install

```shell
npm install vue3-kakao-login
```

## How to use

#### main.ts(main.js)
```typescript
import KakaoLogin from 'vue3-kakao-login'
createApp(App).use(KakaoLogin, {apiKey : "javascript key"}).mount('#app')
interface options : {
  apiKey:string
  url?:string
}
```

### Redirect Login Sample Code
```html
<script setup lang="ts">
import { AuthSuccessCallback, isInitialized, KakaoAuth } from 'vue3-kakao-login';
const Kakao = inject<KakaoAuth>("KaKao");

const localStorageKakaoToken = (data: AuthSuccessCallback) => {
	localStorage.setItem("vue3-kakao-login-token", JSON.stringify(data))
}

const redirectResult = ref<HTMLElement>();

const redirect = () => {
  KaKao?.Auth.authorize({
    redirectUri: 'http://localhost:5173/'
  })
}
const getToken = async () => {
  await isInitialized();
	const url = new URL(window.location.href);
	const code = url.searchParams.get("code");
	const makeFormData = (params: { [key: string]: string }) => {
		const searchParams = new URLSearchParams()
		Object.keys(params).forEach(key => {
			searchParams.append(key, params[key])
		})

		return searchParams
	}
	if (code) {
		const loginInfo = await axios.post<AuthSuccessCallback>('https://kauth.kakao.com/oauth/token',
			makeFormData({
				response_type: 'code',
				grant_type: 'authorization_code',
				client_id: 'f04f16218867b9f1dcfa3b70dc3813ff',
				redirect_uri: 'http://localhost:5173/',
				client_secret: 'tokPHJnOiMLBmOIsprxSgnIRwwzcJhVB',
				code,
			}),
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded;',
				},
			});
		localStorageKakaoToken(loginInfo.data);
	}
	const token = localStorage.getItem("vue3-kakao-login-token");
	if (token) {
		const tokenInfo: AuthSuccessCallback = JSON.parse(token);
		Kakao?.Auth.getStatusInfo(({ status, user }) => {
			Kakao?.Auth.setAccessToken(tokenInfo.access_token)
			if (status === 'connected') {
				redirectResult.value = Kakao?.Auth.getAccessToken();
			}
		})
	}
}
onMounted(()=>{
  getToken();
})
</script>
<template>
  <div>
    <h2>Redirect</h2>
    <button @click="redirect">
      <img src="//k.kakaocdn.net/14/dn/btroDszwNrM/I6efHub1SN5KCJqLm1Ovx1/o.jpg" width="222" alt="카카오 로그인 버튼" />
    </button>
    <div>login success. token: {{ redirectResult }}</div>
  </div>
</template>
```


## License

MIT License

Copyright (c) 2022 ohah.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.