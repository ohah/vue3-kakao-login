<script setup lang="ts">
import { onMounted, ref, inject, provide, computed } from 'vue';
import { KakaoAuth, isInitialized, AuthSuccessCallback } from './KaKaoLoginPlugin';
import axios, { AxiosPromise } from "axios";
const Kakao = inject<KakaoAuth>("Kakao");

const localStorageKakaoToken = (data: AuthSuccessCallback) => {
	localStorage.setItem("vue3-kakao-login-token", JSON.stringify(data))
}

const redirect = () => {
	Kakao?.Auth.authorize({
		redirectUri: 'http://localhost:5000/',
		// prompts: "login",
	})
}
const popup = () => {
	Kakao?.Auth.login({
		success: (authObj) => {
			console.log('success', authObj)
		},
		fail: (err) => {
			console.log('fail', err)
		},
	})
}

const redirectResult = ref<string>();
const profile = ref<HTMLElement>();
const createLoginButton = async () => {
	await isInitialized();
	Kakao.Auth.createLoginButton({
		container: profile.value,
		success: function (authObj) {
			localStorageKakaoToken(authObj);
		},
		fail: function (err) {
			alert('failed to login: ' + JSON.stringify(err))
		},
	})
}

onMounted(() => {
	createLoginButton();
})

onMounted(async () => {
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
				redirect_uri: 'http://localhost:5000/',
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
		Kakao.Auth.getStatusInfo(({ status, user }) => {
			Kakao.Auth.setAccessToken(tokenInfo.access_token)
			if (status === 'connected') {
				redirectResult.value = Kakao?.Auth.getAccessToken();
			}
		})
	}
});
const logout = () => {
	Kakao.Auth.logout((e) => {
		console.log('logout', e)
	});
}

const getProfile = () => {
	Kakao.API.request({
		url: '/v2/user/me',
		success: function(res) {
			alert(JSON.stringify(res))
		},
		fail: function(error) {
			alert(
				'login success, but failed to request user information: ' +
					JSON.stringify(error)
			)
		},
	})
}
const shareBtn = ref<HTMLElement>();

const KakaoTalkShare = () => {
	Kakao.Share.createDefaultButton({
		container: shareBtn.value,
		objectType: 'location',
		address: '경기 성남시 분당구 판교역로 235 에이치스퀘어 N동 8층',
		addressTitle: '카카오 판교오피스 카페톡',
		content: {
			title: '신메뉴 출시♥︎ 체리블라썸라떼',
			description: '이번 주는 체리블라썸라떼 1+1',
			imageUrl:
				'http://k.kakaocdn.net/dn/bSbH9w/btqgegaEDfW/vD9KKV0hEintg6bZT4v4WK/kakaolink40_original.png',
			link: {
				mobileWebUrl: 'https://developers.kakao.com',
				webUrl: 'https://developers.kakao.com',
			},
		},
		social: {
			likeCount: 286,
			commentCount: 45,
			sharedCount: 845,
		},
		buttons: [
			{
				title: '웹으로 보기',
				link: {
					mobileWebUrl: 'https://developers.kakao.com',
					webUrl: 'https://developers.kakao.com',
				},
			},
		],
	})
}

</script>
<template>
	<div @click="logout"> 로그아웃 </div>
	<h1> 카카오 로그인 </h1> 
	<section class="login-grid">
		<div>
			<h2>Redirect</h2>
			<button @click="redirect">
				<img src="//k.kakaocdn.net/14/dn/btroDszwNrM/I6efHub1SN5KCJqLm1Ovx1/o.jpg" width="222" alt="카카오 로그인 버튼" />
			</button>
			<div>login success. token: {{ redirectResult }}</div>
		</div>
		<div>
			<h2>Popup</h2>
			<button @click="popup">
				<img src="//k.kakaocdn.net/14/dn/btroDszwNrM/I6efHub1SN5KCJqLm1Ovx1/o.jpg" width="222" alt="카카오 로그인 버튼" />
			</button>
		</div>
		<div>
			<h2>createLoginButton</h2>
			<button ref="profile"></button>
		</div>
	</section>
	<h1> 메세지 </h1>
	<section class="login-grid">
		<div>
			<button class="kakao" @click="getProfile">사용자 정보 가져오기</button>
		</div>
		<div>
			<button class="kakao" ref="shareBtn" @click="KakaoTalkShare">카카오톡 공유</button>
		</div>
	</section>
</template>
<style scoped>
.login-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	column-gap: 20px;
}

button {
	border: 0;
	background: transparent;
	cursor: pointer;
	padding: 0.25rem 0.5rem;
}

button:hover {
	transform: scale(1.1);
	transition: ease-in-out 0.2s;
}

button img {
	width: 100%;
	height: 100%;
}
section {
	margin:20px;
	border-top:1px solid #dcdcdc;
	padding:20px 0;
}

button.kakao {
	background: #fee500;
	font-weight: 800;
	border-radius: 0.25rem;
	width:222px;
	height:49px;
	font-size:15px;
}
</style>