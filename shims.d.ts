// 레몬스퀴지 타입 정의

type Cart = {
  discount: {
    code: string;
  };
}

type Order = {
  data: {
    id: string;
  }
}

type Data = {
  cart: Cart;
  order: Order;
}

interface Window {
  gtag: (...args: any[]) => void;
  createLemonSqueezy: () => void;
  LemonSqueezy: {
    /**
     * 페이지에서 Lemon.js를 초기화합니다.
     * @param options - 이벤트 핸들러를 포함한 옵션 객체입니다.
     */
    Setup: (options: {
      eventHandler: (event: { event: string, data: Data }) => void;
    }) => void;
    /**
     * 페이지의 `lemonsqueezy-button` 리스너를 새로고침합니다.
     */
    Refresh: () => void;

    Url: {
      /**
       * 지정된 Lemon Squeezy URL을 오픈합니다. 일반적으로 체크아웃 또는 결제 정보 업데이트 오버레이에 사용됩니다.
       * @param url - 오픈할 URL입니다.
       */
      Open: (url: string) => void;

      /**
       * 현재 열린 Lemon Squeezy 오버레이 체크아웃 창을 닫습니다.
       */
      Close: () => void;
    };
    Affiliate: {
      /**
       * 제휴 추적 ID를 가져옵니다.
       */
      GetID: () => string;

      /**
       * 지정된 URL에 제휴 추적 파라미터를 추가합니다.
       * @param url - 파라미터를 추가할 URL입니다.
       */
      Build: (url: string) => string;
    };
  };
}
