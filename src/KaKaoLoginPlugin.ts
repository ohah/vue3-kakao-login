import { build } from "./KakaoLogin";
import { isInitialized } from "./KakaoLogin/build";

interface AuthSuccessCallback {
  /**
   * @description 토큰 타입, "bearer"로 고정
   */
  token_type: string;
  /**
   * @description 사용자 엑세스 토큰 값
   */
  access_token: string;
  /**
   * @description 엑세스 토큰 만료 시간(초)
   */
  expires_in: number;
  /**
   * @description 사용자 리프레시 토큰 값
   */
  refresh_token: string;
  /**
   * @description 사용자 리프레시 토큰 만료 시간(초)
   */
  refresh_token_expires_in: number;
  /**
   * @description 인증된 사용자의 정보 조회 권한 범위 (범위가 여러개일 경우, 공백으로 구분)
   */
  scope: string;
  /**
   * @description OpenId Connect 확장 기능을 통해 발급되는 ID 토큰, Base64 인코딩된 사용자 인증 정보 포함
   */
  id_token?: string;
}

interface AuthStatusCallback {
  /**
   * "connect" 또는 "not_connected"
   */
  status: "connected" | "not_connected";
  user: Object;
}

interface AuthFailCallback {
  /**
   * @description 에러메세지
   */
  error: string;
  /**
   * @description 에러메세지 부가 설명
   */
  error_description: string;
}

interface FriendSuccessCallback {
  /**
   * @description 피커에서 선택한 친구 수
   */
  selectedTotalCount: number;
  /**
   * @description 피커에서 선택한 친구 정보
   * @type {SelectedUser[]}
   * */
  users: SelectedUser[];
}

interface SelectedUser {
  /**
   * @description 고유 식별자
   */
  uuid: string;
  /**
   * @description 회원번호
   * @type {string}
   * */
  id: string;
  /**
   * @description 프로필 닉네임
   * @type {string}
   * */
  profile_nickname: string;
  /**
   * @description 프로필 썸네일 이미지
   * @type {string}
   * */
  profile_thumbnail_image: string;
  /**
   * @description 즐겨찾기 설정 여부
   * @type {boolean}
   * */
  favorite: boolean;

}

interface PickerFailCallback {
  /**
   * @description 에러 코드
   * @type {string}
   * */
  code: string;
  /**
   * @description 에러 메세지
   * @type {string}
   * */
  msg: string;
}

/**
 * Shere
 */

/**
 * @description 메시지 하단에 추가되는 버튼 오브젝트입니다.
 */
interface ButtonObject {
  /**
   * 버튼의 타이틀
   */
  title: string;
  /**
   * 버튼 클릭시 이동할 링크 정보
   */
  link: Partial<LinkObject>;
}

/**
 * @description 가격 정보를 표현하기 위해 사용되는 오브젝트입니다
 */
interface CommerceObject {
  /**
   * @description 정상가격
   * @type {number}
   * */
  regularPrice: number;
  /**
   * @description 할인가격
   * @type {number}
   * */
  discountPrice: number;
  /**
   * @description 할인율
   * @type {number}
   * */
  discountRate: number;
  /**
   * @description 정액 할인액(할인율과 동시에 사용 불가)
   */
  fixedDiscountPrice: number;
  /**
   * @description 화폐단위
   * @type {string}
   * @default "원"
   * */
  currencyUnit: string;
  /**
   * @description 화폐 단위 표기 위치
   * @type {number} 0: 가격 뒤에 표기, 1: 가격 앞에 표기
   * @default 0
   */
  currencyUnitPosition: number;
  /**
   * @description 상품 이름
   */
  productName: string;
}

/**
 * @description 콘텐츠의 내용을 담고 있는 오브젝트입니다.
 */
interface ContentObject {
  /**
   * @description 콘텐츠의 타이틀
   * @type {string}
   * */
  title: string;
  /**
   * @description 콘텐츠의 이미지 URL
   * @type {string}
   * */
  imageUrl: string;
  /**
   * @description 콘텐츠 클릭 시 이동할 링크 정보
   * @type {LinkObject}
   * */
  link: Partial<LinkObject>;
  /**
   * @description 콘텐츠의 이미지 너비 (단위:px)
   * @type {number}
   * */
  imageWidth: number;
  /**
   * @description 콘텐츠의 이미지 높이 (단위:px)
   * @type {number}
   * */
  imageHeight: number;
  /**
   * @description 콘텐츠의 상세 설명
   * @type {string}
   * */
  description: string;
}

interface DefaultCommerceSettings {
  /**
   * @description 고정값 "commerce"
   * @type {string}
   * */
  objectType: string;
  /**
   * @description 메인 콘텐츠
   */
  content: Partial<ContentObject>;
  /**
   * @description 가격 정보
   * @type {CommerceObject}
   * */
  commerce: Partial<CommerceObject>;
  /**
   * @description 기본 타이틀 변경, [ 내 애플리케이션 > 플랫폼  > 사이트 도메인]의 첫번째 주소 링크 (buttonTitle보다 buttons가 우선순위 높음)
   * @type {string}
   * */
  buttonTitle: string;
  /**
   * @description 버튼 타이틀 및 링크 설정 가능, 최대 2개의 버튼 지원
   * @max 2
   * @type {ButtonObject}
   * */
  buttons: ButtonObject[];
  /**
   * @description 카카오톡이 설치되어있지 않은 경우 마켓의 카카오톡 설치 페이지로 이동
   * @type {boolean}
   * @default false
   * */
  installTalk: boolean;
  /**
   * @description 데스크톱 환경에서 카카오톡 공유를 완료했을 때 호출되는 콜백 함수(IE 미지원)
   * @type {Function}
   */
  callback: Function;
  /**
   * @description 카카오톡 공유 시 전송되는 알림에 포함되는 파라미터
   * @link https://developers.kakao.com/docs/latest/ko/message/js-link#set-kakaolink-callback
   * @type {Object | stirng}
   * */
  serverCallbackArgs: Object | string;
}

interface DefaultFeedSettings {
  /**
   * @description 고정값 "feed"
   * @type {string}
   * */
  objectType: string;
  /**
   * @description 메세지의 메인 콘텐츠 정보
   * @type {ContentObject}
   * */
  content: Partial<ContentObject>;
  /**
   * @description 아이템 영역에 포함될 콘텐츠
   * @type {ItemContentObject}
   * */
  items: Partial<ItemContentObject>;
  /**
   * @description 콘텐츠에 대한 소셜 정보
   * @type {SocialObject}
   * */
  social: Partial<SocialObject>;
  /**
   * @description 기본 버튼 타이틀 변경, [내 애플리케이션 > 플랫폼 > 사이트 도메인]의 첫 번째 주소 링크 (buttonTitle 보다 buttons가 우선순위 높음)
   * @type {string}
   * */
  buttonTitle: string;
  /**
   * @description 버튼 타이틀 및 링크 설정 가능, 최대 2개의 버튼 지원
   * @max 2
   * @type {ButtonObject}
   * */
  buttons: ButtonObject[];
  /**
   * @description 카카오톡이 설치되어있지 않은 경우 마켓의 카카오톡 설치 페이지로 이동
   * @type {boolean}
   * @default false
   * */
  installTalk: boolean;
  /**
   * @description 데스크톱 환경에서 카카오톡 공유를 완료했을 때 호출되는 콜백 함수(IE 미지원)
   * @type {Function}
   * */
  callback: Function;
  /**
   * @description 카카오톡 공유 시 전송되는 알림에 포함되는 파라미터
   * @link https://developers.kakao.com/docs/latest/ko/message/js-link#set-kakaolink-callback
   * @type {Object | string}
   * */
  serverCallbackArgs: Object | string;
}

interface ShaereDefaultSettings {
  /**
   * @description DOM Element 또는 Element의 ID Selector를 넘기면, 해당 Element를 클릭할 때 카카오톡 공유가 됩니다.
   * @type {string | HTMLElement}
   */
  container: HTMLElement | string;
  /**
   * @description 스크랩할 사이트 URL, 해당 사이트의 메타 정보를 토대로 메시지 생성
   * @type {string}
   */
  requestUrl: string;
  /**
   * @description 메시지 템플릿 아이디, [내 애플리케이션 > 메시지 > 메시지 템플릿]에서 확인
   * @type {number}
   * */
  templateId: number;
  /**
   * @description 메시지 템플릿에서 활용할 arguments, ex) {'name':'kakao', 'url':'https://developers.kakao.com'}
   * @type {Object}
   * */
  templateArgs: { [key: string]: any };
  /**
   * @description 카카오톡이 설치되어있지 않은 경우 마켓의 카카오톡 설치 페이지로 이동
   * @type {boolean}
   * @default false
   * */
  installTalk: boolean;
  /**
   * @description 데스크톱 환경에서 카카오톡 공유를 완료했을 때 호출되는 콜백 함수(IE 미지원)
   * @type {Function}
   * */
  callback: Function;
  /**
   * @description 카카오톡 공유 시 전송되는 알림에 포함되는 파라미터
   * @link [전송 성공 알림 설정하기](https://developers.kakao.com/docs/latest/ko/message/js-link#set-kakaolink-callback)
   * @type {Object | string}
   * */
  serverCallbackArgs: Object | string;
}

interface DefaultListSettings {
  /**
   * @description 고정값 "location"
   * @type {string}
   * */
  objectType: string;
  /**
   * @description 메인 콘텐츠
   * @type {ContentObject}
   * */
  content: Partial<ContentObject>;
  /**
   * @description 지도 뷰에서 사용 할 주소, ex) 성남시 분당구 판교역로 235
   * @type {string}
   * */
  address: string;
  /**
   * @description 지도 뷰에서 사용 할 주소명 ex) 카카오 본사
   * @type {string}
   * */
  addressTitle: string;
  /**
   * @description 소셜 정보
   * @type {SocialObject}
   * */
  social: Partial<SocialObject>;
  /**
   * @description 기본 버튼 타이틀 변경, [내 애플리케이션 > 플랫폼 > 사이트 도메인]의 첫 번째 주소 링크 (buttonTitle 보다 buttons가 우선순위 높음)
   * @type {string}
   * */
  buttonTitle: string;
  /**
   * @description 버튼 타이틀 및 링크 설정 가능, 최대 2개의 버튼 지원
   * @max 2
   * @type {ButtonObject}
   * */
  buttons: ButtonObject[];
  /**
   * @description 카카오톡이 설치되어있지 않은 경우 마켓의 카카오톡 설치 페이지로 이동
   * @type {boolean}
   * @default false
   * */
  installTalk: boolean;
  /**
   * @description 데스크톱 환경에서 카카오톡 공유를 완료했을 때 호출되는 콜백 함수(IE 미지원)
   * @type {Function}
   * */
  callback: Function;
  /**
   * @description 카카오톡 공유 시 전송되는 알림에 포함되는 파라미터
   * @link https://developers.kakao.com/docs/latest/ko/message/js-link#set-kakaolink-callback
   * @type {Object | string}
   * */
  serverCallbackArgs: Object | string;
}

interface DefaultLocationSettings {
  /**
   * @description 고정값 "location"
   * @type {string}
   * */
  objectType: string;
  /**
   * @description 메인 콘텐츠
   * @type {ContentObject}
   * */
  content: Partial<ContentObject>;
  /**
   * @description 지도 뷰에서 사용 할 주소, ex) 성남시 분당구 판교역로 235
   * @type {string}
   * */
  address: string;
  /**
   * @description 지도 뷰에서 사용될 주소명, ex) 카카오 본사
   * @type {string}
   * */
  addressTitle: string;
  /**
   * @description 소셜 정보
   * @type {SocialObject}
   * */
  social: Partial<SocialObject>;
  /**
   * @description 기본 버튼 타이틀 변경, [내 애플리케이션 > 플랫폼 > 사이트 도메인]의 첫 번째 주소 링크 (buttonTitle 보다 buttons가 우선순위 높음)
   * @type {string}
   * */
  buttonTitle: string;
  /**
   * @description 버튼 타이틀 및 링크 설정 가능, 최대 2개의 버튼 지원
   * @max 2
   * @type {ButtonObject}
   * */
  buttons: ButtonObject[];
  /**
   * @description 카카오톡이 설치되어
   * @type {boolean}
   * */
  installTalk: boolean;
  /**
   * @description 데스크톱 환경에서 카카오톡 공유를 완료했을 때 호출되는 콜백 함수 (IE 미지원)
   * @type {Function}
   * */
  callback: Function;
  /**
   * @description 카카오톡 공유 시 전송되는 알림에 포함되는 파라미터
   * @link https://developers.kakao.com/docs/latest/ko/message/js-link#set-kakaolink-callback
   * @type {Object | string}
   * */
  serverCallbackArgs: Object | string;
}

interface DefaultTextSettings {
  /**
   * @description 고정값 "text"
   * @type {string}
   * */
  objectType: string;
  /**
   * @description 최대 200자의 텍스트
   * @type {string}
   * */
  text: string;
  /**
   * @description 텍스트 클릭 시 이동할 링크 정보
   * @type {LinkObject}
   * */
  link: Partial<LinkObject>;
  /**
   * @description 기본 버튼 타이틀 변경, [내 애플리케이션 > 플랫폼 > 사이트 도메인]의 첫 번째 주소 링크 (buttonTitle 보다 buttons가 우선순위 높음)
   * @type {string}
   * */
  buttonTitle: string;
  /**
   * @description 버튼 타이틀 및 링크 설정 가능, 최대 2개의 버튼 지원
   * @max 2
   * @type {ButtonObject}
   * */
  buttons: ButtonObject[];
  /**
   * @description 카카오톡이 설치되어있지 않은 경우 마켓의 카카오톡 설치 페이지로 이동
   * @type {boolean}
   * @default false
   * */
  installTalk: boolean;
  /**
   * @description 데스크톱 환경에서 카카오톡 공유를 완료했을 때 호출되는 콜백 함수(IE 미지원)
   * @type {Function}
   * */
  callback: Function;
  /**
   * @description 카카오톡 공유 시 전송되는 알림에 포함되는 파라미터
   * @link https://developers.kakao.com/docs/latest/ko/message/js-link#set-kakaolink-callback
   * @type {Object | string}
   * */
  serverCallbackArgs: Object | string;
}

/**
 * 이미지 정보
 */
interface ImageInfos {
  original: {
    /**
     * 이미지의 FULl URL
     * @type {string}
     */
    url: string;
    /**
     * 이미지의 사이즈, 단위: Byte
     * @type {number}
     * */
    length: number;
    /**
     * 이미지의 포맷
     * @type {string}
     * */
    content_type: string;
    /**
     * 이미지의 가로 크기
     * @type {number}
     * */
    width: number;
    /**
     * 이미지의 세로 크기
     * @type {number}
     * */
    height: number;
  };
}

/**
 * 아이템 목록 형태의 콘텐츠를 표현할 때 사용하는 오브젝트입니다.
 */
interface ItemContentObject {
  /**
   * @description 헤더 또는 프로필 영역에 출력될 텍스트
   * @type {string}
   * */
  profileText: string;
  /**
   * @description 프로필 영역에 출력될 이미지
   * @type {string}
   * */
  profileImageUrl: string;
  /**
   * @description 이미지 아이템의 제목
   * @type {string}
   * */
  titleImageText: string;
  /**
   * @description 이미지 아이템의 제목 이미지
   * @type {string}
   * */
  titleImageUrl: string;
  /**
   * @description 이미지 아이템의 제목 아래에 회색 글씨로 출력되는 카테고리 정보
   * @type {string}
   * */
  titleImageCategory: string;
  /**
   * @description 각 텍스트 아이템 정보, 최대 5개의 아이템 지원
   * @max 5
   * @type {ItemObject}
   * */
  items: ItemObject[];
  /**
   * @description 주문금액, 결제 금액 등 아이템 영역의 요약 정보 제목
   * @type {string}
   * */
  sum: string;
  /**
   * @description 아이템 영역의 가격 합산 정보
   * @type {string}
   * */
  sumOp: string;
}

/**
 * 텍스트 아이템 정보
 */
interface ItemObject {
  /**
   * @description 아이템 이름
   * @type {string}
   * */
  item: string;
  /**
   * @description 아이템 가격
   * @type {string}
   * */
  itemOp: string;
}

/**
 * 메시지에서 콘텐츠 영역이나 버튼 클릭 시에 이동되는 링크 정보 오브젝트입니다. 오브젝트 내 프로퍼티 중 하나 이상은 반드시 존재해야 합니다.
 */
interface LinkObject {
  /**
   * @description PC 버전 카카오톡에서 사용하는 웹 링크 URL
   * @type {string}
   * */
  webUrl: string;
  /**
   * @description 모바일 버전 카카오톡에서 사용하는 웹 링크 URL
   * @type {string}
   * */
  mobileWebUrl: string;
  /**
   * @description 안드로이드 카카오톡에서 사용하는 앱 링크 URL에서 사용될 파라미터
   * @type {string}
   * */
  androidExecutionParams: string;
  /**
   * @description iOS 카카오톡에서 사용하는 앱 링크 URL에서 사용될 파라미터
   * @type {string}
   * */
  iosExecutionParams: string;
}

/**
 * 좋아요 수, 댓글 수의 소셜 정보를 표현하기 위해 사용되는 오브젝트입니다
 */
interface SocialObject {
  /**
   * @description 콘텐츠의 좋아요 수
   * @type {number}
   * */
  likeCount: number;
  /**
   * @description 콘텐츠의 댓글 수
   * @type {number}
   * */
  commentCount: number;
  /**
   * @description 콘텐츠의 공유 수
   * @type {number}
   */
  sharedCount: number;
  /**
   * @description 콘텐츠의 조회 수
   * @type {number}
   */
  viewCount: number;
  /**
   * @description 콘텐츠의 구독 수
   * @type {number}
   */
  subscriberCount: number;
}

interface KaKaoProperties {
  API: {
    /**
     * @description 인가 코드를 받을 URI
     * @type {string}
     */
    redirectUri: string;
    /**
     * @description 인가 코드 요청과 응답 과정에서 유지할 수 있는 파라미터
     * @type {string}
     * */
    state: string;
    /**
     * @description 추가 동의 받을 항목의 키 ex)account_email, gender, OpenID Connect 확장 기능 사용시, 추가 동의 받을 항목의 키와 "openid"를 함께 전달해야함
     * @type {string}
     * */
    scope: string;
    /**
     * @description 인가 코드 요청시 추가 상호작용을 요청하고자 할 때 전달하는 파라미터 ex) "cert": 인증로그인, "login": 다른 계정으로 로그인
     * @type {string}
     */
    prompts: string;
    /**
     * @description ID 토큰 재생 공격 방지를 위한 검증 값, 임의의 문자열, ID 토큰 검증 시 사용
     * @type {string}
     * */
    nonce: string;
    /**
     * @description 간편 로그인 사용 여부
     * @type {boolean}
     * @default true
     * */
    throughTalk: boolean;
    /**
     * @description 세션이 종료된 뒤에도 엑세스 토큰을 사용할 수 있도록 로컬 스토리지 저장 여부
     * @type {boolean}
     * @default true
     */
    persistAccessToken: boolean;
    /**
     * @description 호출할 API URL
     * @type {string}
     */
    url: string;
    /**
     * @description API에 전달할 파라미터
     * @type {object}
     * */
    data?: object;
    /**
     * 파일 첨부가 필요한 API에서 이용하는 파일 파라미터
     * @type {FileList | File[] | Blob[]}
     * */
    files?: FileList | File[] | Blob[];
    /**
     * @description API 호출 성공시 콜백 함수
     * */
    success?: (response: AuthSuccessCallback) => void;
    /**
     * @description API 호출 실패시 콜백 함수
     * */
    fail?: (error: AuthFailCallback) => void;
    /**
     * @description API 호출이 성공하거나 실패할 경우 항상 호출할 콜백 함수
     * */
    always?: (message: AuthSuccessCallback | AuthFailCallback) => void;
    /**
     * @description DOM Element 또는 Element의 ID Selector를 넘기면, 해당 Element 내부에 로그인 버튼이 생성됩니다.
     * @type {string | HTMLElement}
     */
    container: HTMLElement | string;
    /**
     * @description 카카오 로그인 컴포넌트의 생성 위치
     * @type {string} "kr" | "en"
     * @default kr
     * */
    lang: string;
    /**
     * @description 로그인 버튼의 사이즈
     * @type {string} "small" | "medium" | "large"
     * @default medium
     * */
    size: string;
  };
  /**
   * Kakao.Channel
   * @description 카카오 채널 플러그인과 관련된 함수들이 포함되어 있습니다.
   */
  Channel: {
    /**
     * DOM Element 또는 Element의 ID Selector
     * @type {string | HTMLElement}
     * */
    container: HTMLElement | string;
    /**
     * @description 대상 카카오톡 채널 홈 URL에 포함된 카카오톡 채널 ID
     * @type {string}
     * */
    channelPublicId: string;
    /**
     * @description 1:1 채팅 버튼에 들어갈 제목
     * @type {consult | question}
     * @default consult
     * */
    title: "consult" | "question";
    /**
     * @description 1:1 채팅 버튼의 사이즈, "small"|"large"
     * @type {small | large}
     * @default small
     * */
    size: "small" | "large";
    /**
     * @description 1:1 채팅 버튼의 색상, "yellow"|"black"
     * @type {yellow | black}
     * @default yellow
     * */
    color: "yellow" | "black";
    /**
     * @description 1:1 채팅 버튼의 모양, "pc"|"mobile"
     * @type {pc | mobile}
     * @default pc
     * */
    shape: "pc" | "mobile";
    /**
     * @description 화면 배율에 따라 2x 3x 이미지를 사용, IE 미지원
     * @type {boolean}
     * @default false
     * */
    supportMultipleDensities: boolean;
  };
  /**
   * KaKao.Navi
   * @description 카카오내비 앱을 통해 목적지 공유 및 길 안내 기능을 실행합니다
   * 카카오내비 앱이 설치돼 있다면 앱, 그렇지 않다면 설치 페이지를 엽니다.
   * */
  Navi: ViaPoint & {
    /**
     * @description 좌표타입
     * @type {wgs84|katec}
     * */
    coordType: string;
    /**
     * @description 차종 (1: 1종 (승용차/소형승합차/소형화물화), 2: 2종 (중형승합차/중형화물차), 3: 3종 (대형승합차/2축 대형화물차), 4: 4종 (3축 대형화물차), 5: 5종 (4축이상 특수화물차), 6: 6종 (경차), 7: 이륜차)
     * @default 1
     * */
    vehicleType: number;
    /**
     * @description 경로 옵션 (1: 가장 빠른 경로, 2: 무료 도로, 3: 가장 짧은 경로, 4: 자동차 전용 도로 제외, 5: 큰길 우선, 6: 고속도로 우선, 8: 일반 도로 우선, 100: 추천 경로)
     * @default 100
     * */
    rpOption: number;
    /**
     * @description 전체 경로 보기 여부
     * @type {boolean}
     * @default false
     * */
    routeInfo: boolean;
    /**
     * @description 시작 좌표 x
     * @type {number}
     * */
    sX: number;
    /**
     * @description 시작 좌표 y
     * @type {number}
     * */
    sY: number;
    /**
     * @description 시작 앵글
     * @type {number<range>} 0~359
     * */
    sAngle: number;
    /**
     * @description 길 안내 종료(전체 경로 보기) 후 호출할 URI
     * @type {string}
     * */
    returnUri: string;
    /**
     * @description 경유지 정보 (최대 3개)
     * @type {ViaPoint[]}
     * */
    viaPoints: ViaPoint[];
  },
  Picker:{
    /**
     * @description 친구 피커 타이틀 영역에 표시될 텍스트
     * @type {string}
     * @default "카카오톡 친구 선택"
     */
    title: string;
    /**
     * @description 검색 기능 사용 여부
     * @type {boolean}
     * @default true
     * */
    enableSearch: boolean;
    /**
     * @description 내 프로필 표시 여부
     * @type {boolean}
     * @default true
     * */
    showMyProfile: boolean;
    /**
     * @description 즐겨찾기 표시 여부
     * @type {boolean}
     * @default true
     * */
    showFavorite: boolean;
    /**
     * @description 선택된 친구 표시 여부
     * @type {boolean}
     * @default true
     * */
    showPickedFriend: boolean;
    /**
     * @description 최대 선택 가능 친구 수 (최대 100명)
     * @type {number}
     * @default 30
     */
    maxPickableCount: number;
    /**
     * @description 최소 선택 가능 친구 수 (최대 100명)
     * @type {number}
     * @default 1
     */
    minPickableCount: number;
    /**
     * @description 친구 관계 유형 (카카오톡/카카오스토리/카카오톡 & 카카오스토리)
     * @type { talk | story| talkstory }
     * @default "talk"
     * */
    serviceTypeFilter: "talk" | "story" | "talkstory";
    /**
     * @description 선택된 친구에 대한 정보를 받을 콜백 함수
     * @type {FriendSuccessCallback}
     * */
    success: FriendSuccessCallback
    /**
      * @description 에러를 받을 콜백 함수
      * @type {PickerFailCallback}
      * */
    fail: PickerFailCallback
    /**
     * @description 성공 여부와 관계 없이 항상 호출되는 콜백 함수
     * @type {FriendSuccessCallback | PickerFailCallback}
     * */
    always: FriendSuccessCallback | PickerFailCallback
    /**
     * @description 선택한 친구 정보를 받을 서비스 URL
     * @type {string}
     * */
    returnUrl: string
    /**
     * @description 뒤로가기 버튼 노출 유무
     * @type {boolean}
     * @default true
     * */
    enableBackButton: boolean
  }
  Share: ShaereDefaultSettings;
}

/**
 * @description 경유지 정보(최대 3개)
 */
interface ViaPoint {
  /**
   * @description 목적지 이름
   */
  name: string;
  /**
   * @description 목적지의 x좌표(경도).
   * wgs84 또는 katec 좌표계의 값
   */
  x: number;
  /**
   * @description 목적지의 y좌표(위도).
   * wgs84 또는 katec 좌표계의 값
   * */
  y: number;
}

interface KakaoAuth {
  /**
   * 카카오 JavaScript SDK를 초기화합니다. SDK를 사용하기 전에 호출해야 합니다.
   * @type {string}
   * @description Javascript 키
   * @throws {Error} 앱키가 유효하지 않을때 에러가 발생
   * */
  init(apiKey: string): void;
  /**
   * API를 호출하기 위해 사용한 리소스를 해제합니다.
   */
  cleanup(): void;
  /**
   * 카카오 JavaScript SDK의 초기화 여부를 반환합니다.
   * @returns {boolean} 초기화 여부
   */
  isInitialized(): boolean;
  API: {
    /**
     * API를 호출하기 위해 사용한 리소스를 해제합니다.
     */
    cleanup(): void;
    /**
     * 카카오 API를 호출할 수 있습니다.
     * @description API 호출과 관련된 설정을 key/values로 전달합니다.
     */
    request({
      url,
      data,
      files,
      success,
      fail,
      always,
    }: Partial<Pick<
      KaKaoProperties["API"],
      "url" | "data" | "files" | "success" | "fail" | "always"
    >>): void;
  };
  Auth: {
    /**
     * 사용자가 앱에 로그인할 수 있도록 인가 코드를 요청하는 함수입니다. 인가 코드를 받을 수 있는 서버 개발이 필요합니다.
     */
    authorize({
      redirectUri,
      state,
      scope,
      prompts,
      nonce,
      throughTalk,
    }: Partial<Pick<
      KaKaoProperties["API"],
      "redirectUri" | "state" | "scope" | "prompts" | "nonce" | "throughTalk"
    >>): void;
    /**
     * 로그인 버튼을 생성하기 위해 삽입한 iframe을 삭제하고 리소스를 해제합니다
     */
    cleanup(): void;
    /**
     * 카카오 로그인 버튼을 생성합니다.
     * @description Kakao.Auth.login 직접 로그인 버튼을 제작하여 사용할 때 이용하세요.
     * @param {object} settings - 로그인 버 튼과 관련된 설정을 key/value로 전달합니다.
     * */
    createLoginButton({
      container,
      lang,
      size,
      success,
      fail,
      always,
      scope,
      nonce,
      persistAccessToken,
      throughTalk,
    }: Partial<Pick<
      KaKaoProperties["API"],
      | "container"
      | "lang"
      | "size"
      | "success"
      | "fail"
      | "always"
      | "scope"
      | "nonce"
      | "persistAccessToken"
      | "throughTalk"
    >>): void;
    /**
     * @returns {string} 사용중인 엑세스 토큰
     */
    getAccessToken(): string;
    /**
     * @returns {string} 사용중인 App Key
     */
    getAppKey(): string;
    /**
     * @deprecated 이 API는 보안 정책으로 폐기되었습니다
     */
    getRefreshToken(): string;
    /**
     * @returns {AuthStatusCallback} 현재 로그인 상태를 반환
     */
    getStatusInfo(callback: (option: AuthStatusCallback) => void): void;
    /**
     * 사용자가 앱에 로그인할 수 있도록 로그인 팝업창을 띄우는 함수입니다. 사용자의 클릭 이벤트 이후에 호출되어야 브라우저에 의해 팝업이 차단되지 않습니다.
     * @param {object} settings - 로그인과 관련된 설정을 key/value로 전달합니다.
     */
    login({
      success,
      fail,
      always,
      scope,
      nonce,
    }: Partial<
      Pick<
        KaKaoProperties["API"],
        "success" | "fail" | "always" | "scope" | "nonce"
      >
    >): void;
    /**
     * 다른 계정으로 로그인할 수 있도록 로그인 팝업창을 띄우는 함수입니다. 사용자의 클릭 이벤트 이후에 호출되어야 브라우저에 의해 팝업이 차단되지 않습니다.
     * */
    loginForm({
      success,
      fail,
      always,
      scope,
      nonce,
      persistAccessToken,
    }: Partial<Pick<
      KaKaoProperties["API"],
      "success" | "fail" | "always" | "scope" | "nonce" | "persistAccessToken"
    >>): void;
    /**
     * 현재 로그인되어 있는 사용자를 로그아웃시키고, Access Token을 삭제합니다.
     */
    logout(callback: (e: any) => void): void;
    /**
     * @description API 호출 시 사용할 엑세스 토큰을 설정합니다
     * @param {string} token - 엑세스 토큰
     * @param {boolean} persist - 세션이 종료된 뒤에도 엑세스 토큰을 사용할 수 있도록 로컬 스토리지 저장 여부
     * */
    setAccessToken(token: string, persist?: boolean): void;
    /**
     * @deprecated 이 API는 보안 정책으로 폐기되었습니다
     * */
    setRefreshToken(): void;
  };
  Channel: {
    /**
     * @description Kakao.Channel.createAddChannelButton.
     * 직접 버튼을 제작하여 사용할 필요가 없는 경우 유용합니다.
     * 카카오톡 채널 추가와 관련된 설정을 key/value로 전달합니다.
     * @demo https://developers.kakao.com/tool/demo/channel/add
     * @param {string} channelPublicId - 대상 카카오톡 채널 홈 URL에 포함된 카카오톡 채널 공개 ID
     * */
    addChannel({
      channelPublicId,
    }: Pick<KaKaoProperties["Channel"], "channelPublicId">): void;
    /**
     * @description Kakao.Channel.createChatButton 직접 버튼을 제작하여 사용할 필요가 없는 경우 유용합니다.
     * 카카오톡 채널 1:1 채팅을 시작합니다. 사용자의 클릭 이벤트 이후에 호출되어야 브라우저에 의해 팝업이 차단되지 않습니다.
     * @demo https://developers.kakao.com/tool/demo/channel/chat?method=chat
     */
    chat({
      channelPublicId,
    }: Pick<KaKaoProperties["Channel"], "channelPublicId">): void;
    /**
     * @description Kakao.Channel.addChannel 직접 버튼을 제작하여 사용할 때 이용하세요.
     * @demo https://developers.kakao.com/tool/demo/channel/add?method=button
     */
    createAddChannelButton({
      container,
      channelPublicId,
      size,
      supportMultipleDensities,
    }: Partial<Pick<
      KaKaoProperties["Channel"],
      "container" | "channelPublicId" | "size" | "supportMultipleDensities"
    >>): void;
    /**
     * @description Kakao.Channel.chat 직접 버튼을 제작하여 사용할 때 이용하세요.
     * @description 카카오톡 채널 1:1 채팅 버튼을 생성합니다.
     * @demo https://developers.kakao.com/tool/demo/channel/chat?method=button
     * */
    createChatButton({
      container,
      channelPublicId,
      title,
      size,
      color,
      shape,
      supportMultipleDensities,
    }: Partial<Pick<
      KaKaoProperties["Channel"],
      | "container"
      | "channelPublicId"
      | "title"
      | "size"
      | "color"
      | "shape"
      | "supportMultipleDensities"
    >>): void;
  };
  /**
   * @description 카카오내비 앱을 통해 목적지 공유 및 길 안내 기능을 실행합니다.
   * 카카오내비 앱이 설치돼 있다면 앱 그렇지 않다면 설치 페이지를 엽니다
   */
  Navi: {
    /**
     * @description 카카오내비 앱으로 목적지를 공유합니다. 모바일 기기에서만 동작합니다.
     * @demo https://developers.kakao.com/tool/demo/navi/share
     * */
    shere(): void;
    /**
     * @description 카카오내비 앱으로 목적지를 공유합니다. 모바일 기기에서만 동작합니다.
     */
    start({
      name,
      x,
      y,
      coordType,
      vehicleType,
      rpOption,
      routeInfo,
      sX,
      sY,
      sAngle,
      returnUri,
      viaPoints,
    }: Partial<KaKaoProperties["Navi"]>): void;
  };
  /**
   * @description 피커와 관련된 함수들이 포함되어 있습니다
   */
  Picker: {
    /**
     * @description 피커를 호출하기 위해 사용한 리소스를 해제합니다
     * */
    cleanup(): void;
    /**
     * @description 한 명의 친구를 선택할 때 사용합니다.
     * @example
     * ```ts
     * Kakao.Picker.selectFriend({
     * title: '친구 선택',
     * showMyProfile: false,
     * success: function(response) {
     *   console.log(response)
     * },
     * fail: function(error) {
     *   console.log(error)
     * },
     *})
     *```
     */
    selectFriend({ title, enableSearch, showMyProfile, showFavorite, serviceTypeFilter, success, fail, always, returnUrl, enableBackButton }: Partial<Omit<KaKaoProperties['Picker'], "showPickedFriend" | "maxPickableCount" | "minPickableCount">>): void;
    /**
     * @description 여러 명의 친구를 선택할 때 사용합니다.
     * @example
     * ```ts
     * Kakao.Picker.selectFriends({
     *  title: '친구 선택',
     *  showMyProfile: false,
     *  maxPickableCount: 10,
     *  minPickableCount: 1,
     *  success: function(response) {
     *    console.log(response)
     *  },
     *  fail: function(error) {
     *    console.log(error)
     *  },
     *})
     *```
     */
    selectFriends({ title, enableSearch, showMyProfile, showFavorite, serviceTypeFilter, success, fail, always, returnUrl, enableBackButton}: Partial<KaKaoProperties['Picker']>): void;
  };
  /**
   * @description 카카오톡 공유와 관련된 함수들이 포함되어 있습니다.
   */
  Share: {
    /**
     * @description 카카오톡 공유와 관련된 리소스를 해제 합니다
     */
    cleanup(): void;
    /**
     * @description Kakao.Share.sendCustom 직접 카카오톡 공유 버튼을 제작하여 사용할 때 이용하세
     * @demo [데모 보러가기](https://developers.kakao.com/tool/demo/message/kakaolink?message_type=custom)
     * @description 메시지 템플릿을 이용하여 카카오톡 공유를 하는 기능입니다.
     * @demo [메시지 템플릿 가이드로 이동](https://developers.kakao.com/docs/latest/ko/message/message-template)
     */
    createCustomButton({
      container,
      templateId,
      templateArgs,
      installTalk,
      callback,
      serverCallbackArgs,
    }: Partial<Omit<KaKaoProperties["Share"], "requestUrl">>): void;
    /**
     * @description Kakao.Share.sendDefault 직접 카카오톡 공유 버튼을 제작하여 사용할 때 이용하세요.
     * @demo [데모 보러가기](https://developers.kakao.com/tool/demo/message/kakaolink?default_template=feed)
     * @description 기본 템플릿 타입 (Feed, List, Location, Commerce, Text)에 따라 메시지를 구성하여 카카오톡 공유를 하는 기능입니다
     */
    createDefaultButton({container}: 
      Pick<KaKaoProperties["Share"], "container"> &
        Partial<DefaultFeedSettings> &
        Partial<DefaultListSettings> &
        Partial<DefaultLocationSettings> &
        Partial<DefaultCommerceSettings> &
        Partial<DefaultTextSettings>
    ): void;
    /**
     * @description Kakao.Share.sendScrap 직접 카카오톡 공유 버튼을 제작하여 사용할 때 이용하세요.
     * @demo [데모 보러가기](https://developers.kakao.com/tool/demo/message/kakaolink?message_type=scrap)
     */
    createScrapButton({
      container,
      requestUrl,
      templateId,
      templateArgs,
      installTalk,
      callback,
      serverCallbackArgs,
    }: Partial<KaKaoProperties["Share"]>): void;
    /**
     * @description 업로드된 이미지의 경로를 전달하면 이미지를 삭제할 수 있습니다.
     */
    deleteImage({
      imageUrl,
    }: {
      /**
       * @description 삭제할 이미지의 URL
       */
      imageUrl: string;
    }): Promise<any>;
    /**
     * @description 스크랩하고 싶은 이미지의 경로를 전달하면 스크랩후 업로드 합니다(이미지는 20일동안 보관됩니다.)
     */
    scrapImage({
      imageUrl,
    }: {
      /**
       * @description 스크랩할 이미지의 URL
       */
      imageUrl: string;
    }): Promise<ImageInfos>;
    /**
     * @description Kakao.Share.createCustomButton 직접 카카오톡 공유 버튼을 제작하여 사용할 필요가 없는 경우 유용합니다.
     * @demo [데모 보러가기](https://developers.kakao.com/tool/demo/message/kakaolink?message_type=custom)
     * @param param0
     */
    sendCustom({
      templateId,
      templateArgs,
      installTalk,
      callback,
      serverCallbackArgs,
    }: Partial<Pick<
      KaKaoProperties["Share"],
      | "templateId"
      | "templateArgs"
      | "installTalk"
      | "callback"
      | "serverCallbackArgs"
    >>): void;
    /**
     * @description Kakao.Share.createDefaultButton 직접 카카오톡 공유 버튼을 제작하여 사용할 필요가 없는 경우 유용합니다.
     * @demo [데모 보러가기](https://developers.kakao.com/tool/demo/message/kakaolink?default_template=feed)
     */
    sendDefault({}: Partial<
      DefaultFeedSettings &
      DefaultListSettings &
      DefaultLocationSettings &
      DefaultCommerceSettings &
      DefaultTextSettings
    >): void;
    /**
     * @description Kakao.Share.createScrapButton 직접 카카오톡 공유 버튼을 제작하여 사용할 필요가 없는 경우 유용합니다.
     * @demo [데모 보러가기](https://developers.kakao.com/tool/demo/message/kakaolink?message_type=scrap)
     */
    sendScrap({
      requestUrl,
      templateId,
      templateArgs,
      installTalk,
      callback,
      serverCallbackArgs,
    }: Partial<Omit<KaKaoProperties["Share"], "container">>): void;
    uploadImage({ file }: { file: FileList }): Promise<ImageInfos>;
  },
  Stroy: {
    /**
     * @description 카카오스토리 공유 버튼과 관련된 리소스를 해제합니다.
     * */
    cleanup(): void;
    /**
     * @description 지정한 Element를 클릭할 때 카카오스토리 채널로부터 소식을 받도록 합니다.
     * @demo [데모 보러가기](https://developers.kakao.com/tool/demo/story/follow)
     * */
    createFollowButton({container, id, showFollowerCount, type}:{
      /**
       * @description DOM Element 또는 Element의 ID Selector를 넘기면, 해당 Element를 클릭할 때 지정한 채널을구독합니다.
       * @type {string | HTMLElement}
       * */
      container:string | HTMLElement, 
      /**
       * @description 소식을 받을 카카오스토리 채널 ID. ex) kakao
       * */
      id:string,
      /**
       * @description 구독자 수를 노출합니다.
       * @default true
       */
      showFollowerCount:boolean,
      /**
       * @description 구독자 수를 노출할 형태를 정합니다.
       * @default horizontal
       * */
      type:string
    }):void
    /**
     * @description 지정한 Element를 클릭할 때 카카오스토리 공유 창이 열리도록 합니다.
     * @demo [데모 보러가기](https://developers.kakao.com/tool/demo/story/share?method=web-button)
     */
    createShareButton({container, url, text}:{
      /**
       * @description DOM Element 또는 Element의 ID Selector를 넘기면, 해당 Element를 클릭할 때 카카오스토리 공유 창이 열립니다.
       * @type {string | HTMLElement}
       */
      container:string | HTMLElement,
      /**
       * @description 카카오 스토리로 공유할 웹 페이지의 URL.
       * @default ${current-page's-URL} 
       * */
      url:string,
      /**
       * @description 공유 창에 표시할 텍스트
       * @default ""
       * */
      text:string
    }):void
    /**
     * @description 모바일 환경에서 카카오스토리 앱 공유 화면을 엽니다.
     * @demo [데모 보러가기](https://developers.kakao.com/tool/demo/story/share?method=app)
     * ```ts
     * // 1. 필수 옵션만 사용. 메타 정보는 스크랩 서버가 자동으로 생성
     * Kakao.Story.open({  
     *  url: 'http://my.share.url.com',  
     *  text: 'Text to share'
     * });
     * // 2. 스크랩된 url의 메타 정보를 바꾸고 싶을때
     * Kakao.Story.open({
     *   url: 'http://my.share.url.com',
     *   text: 'Text to share',
     *   urlInfo: {
     *     title: 'The title of a shared site',
     *     desc: 'A description of a website',
     *     name: 'The name at the bottom',
     *     images: ['http://my.image.url']
     *   }
     * })
     * ```
     * */
    open({install, url, text, urlInfo}:{
      /**
       * @description 카카오스토리 앱이 설치되어 있지 않은 경우 마켓의 카카오스토리 설치 페이지로 이동합니다.
       * @default false
       */
      install?:boolean,
      /**
       * @description 카카오스토리로 공유할 웹 페이지의 URL
       * @default ${current-page's-URL}
       * */
      url?:string,
      /**
       * @description 공유 창에 표시할 텍스트
       * @default ""
       * */
      text?:string,
      /**
       * @description 위에 입력한 url에 대한 추가적인 정보 (입력하지 않을 경우 스크랩 서버가 자동으로 생성)
       * */
      urlInfo?:{
        /**
         * @description 스크랩 영역에 표시할 제목
         */
        title?:string,
        /**
         * @description 스크랩 영역에 표시할 설명
         */
        desc?:string,
        /**
         * @description 스크랩 영역에 표시할 사이트 이름
         */
        name?:string,
        /**
         * @description 스크랩 영역에 표시할 이미지 URL
         * */
        images?:string[]
      }
      /**
       * @description 카카오스토리 웹 공유 화면을 엽니다.
       * @demo [데모 보러가기](https://developers.kakao.com/tool/demo/story/share)
       */
      share({url, text}:{
        /**
         * @description 카카오스토리로 공유할 웹 페이지의 URL
         * @default ${current-page's-URL}
         */
        url?:string, 
        /**
         * @description 공유 창에 표시할 텍스트
         * @default ""
         * */
        text?:string
      }):void
    }):void
  };
}

export { isInitialized }

export default {
  install: build,
};
export type {
  KakaoAuth,
  AuthSuccessCallback,
  AuthStatusCallback,
  AuthFailCallback,
  FriendSuccessCallback,
  PickerFailCallback,
  ButtonObject,
  CommerceObject,
  ContentObject,
  DefaultCommerceSettings,
  DefaultFeedSettings,
  DefaultListSettings,
  DefaultLocationSettings,
  DefaultTextSettings,
  ImageInfos,
  ItemContentObject,
  ItemObject,
  LinkObject,
  SocialObject,
  KaKaoProperties,
  ViaPoint,
};
