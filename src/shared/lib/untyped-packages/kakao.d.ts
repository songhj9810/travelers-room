declare namespace Kakao {
  /** Kakao SDK 버전 */
  const VERSION: string

  /** 사용한 리소스 해제 */
  function cleanup(): void

  /**
   * Kakao SDK 초기화
   * @param appKey 앱 키
   */
  function init(appKey: string): void

  /** 초기화 여부 확인 */
  function isInitialized(): boolean

  /** Kakao SDK 공통 에러 */
  interface KakaoError {
    name: "KakaoError"
    message: string
  }

  /** 카카오톡 공유 API 모듈 */
  namespace Share {
    /** 사용한 카카오톡 공유 모듈 리소스 해제 */
    function cleanup(): void

    /**
     * 스크랩 메시지 보내기
     * @param settings
     * @param settings.requestUrl 스크랩할 URL
     * @param settings.templateId 사용자 정의 템플릿 ID
     * @param settings.templateArgs 사용자 인자 키와 값
     * @param settings.installTalk 카카오톡 미설치 시, 설치 페이지 이동 여부
     * @param settings.serverCallbackArgs 카카오톡 공유 전송 성공 알림에 포함할 키와 값
     */
    function sendScrap(settings: {
      requestUrl: string
      templateId?: number
      templateArgs?: object
      installTalk?: boolean
      serverCallbackArgs?: object
    }): void
  }
}

declare global {
  interface Window {
    Kakao: typeof Kakao
  }
}

export {}
