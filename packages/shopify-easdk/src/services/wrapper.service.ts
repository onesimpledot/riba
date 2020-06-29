import { EventDispatcher } from "@ribajs/core";

import {
  EASDK,
  // EASDKWrapper,
  // BarConfig,
  // Bar,
  // BarWrapper,
  // LoadingStateWrapper,
  // Config,
  // PaginationConfig,
  // ButtonConfig,
  // ButtonCallback,
  // Modal,
  // ModalWrapper,
  // ModalInit,
  // ModalAlertOptions,
  // ModalConfirmOptions,
  // ModalInputOptions,
  // ProductPickerOptions,
  // ProductPickerCallback,
  // User,
  // UserData,
  // ReceiveMessage,
  ShopifyApp,
} from "../interfaces/shopify-easdk";

export class WrapperService {
  public static inIframe() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }

  protected static ERRORS = {
    EASDK_NOT_FOUND: `Shopify's EASDK is required!
    Add <script src="https://cdn.shopify.com/s/assets/external/app.js"></script> to your html head.
    See https://help.shopify.com/en/api/embedded-apps/embedded-app-sdk for more informations.`,
  };

  public event = new EventDispatcher("shopify-easdk");

  protected shopifyApp: EASDK;

  constructor(shopifyApp?: EASDK) {
    if (!shopifyApp && !ShopifyApp) {
      throw new Error(WrapperService.ERRORS.EASDK_NOT_FOUND);
    }
    this.shopifyApp = shopifyApp || ShopifyApp;
  }

  public useFallback(force: boolean) {
    return !WrapperService.inIframe() || force;
  }
}
