import {
  Bs4FormComponent,
  Scope as Bs4FormScope,
} from "@ribajs/bs4/src/components/bs4-form/bs4-form.component";

export interface Scope extends Bs4FormScope {
  octoberHandler: string;
}

export class OcFormComponent extends Bs4FormComponent {
  public static tagName = "oc-form";

  public _debug = false;

  static get observedAttributes() {
    return [...Bs4FormComponent.observedAttributes, "october-handler"];
  }

  protected requiredAttributes(): string[] {
    const requiredAttributes = super.requiredAttributes();
    requiredAttributes.push("octoberHandler");
    return requiredAttributes;
  }

  protected getDefaultScope(): Scope {
    const scope = super.getDefaultScope() as Partial<Scope>;
    scope.octoberHandler = "";
    return scope as Scope;
  }

  protected scope: Scope = this.getDefaultScope();

  protected connectedCallback() {
    this.debug("connectedCallback");
    this.init(OcFormComponent.observedAttributes);
    this.addEventListeners();
  }

  protected ajaxSubmit() {
    this.debug("ajaxSubmit", this.scope.octoberHandler);
    const submitSettings = this.getSubmitSettings();
    if (!submitSettings) {
      console.warn("Can't get submit settings");
      return;
    }

    if (!this.formEl) {
      console.warn("No form found");
      return;
    }

    // See October CMS JavaScript API: https://octobercms.com/docs/ajax/javascript-api
    const $form = window.jQuery(this.formEl);
    ($form as any).request(this.scope.octoberHandler, {
      error: (jqXHR: any, statusText: string, error: any) => {
        console.error(jqXHR, statusText, error);
        if (jqXHR.responseJSON?.error) {
          this.onErrorSubmit(jqXHR.responseJSON.error, jqXHR.responseJSON.error, jqXHR);
        } else {
          this.onErrorSubmit(statusText, statusText, jqXHR);
        }
      },
    });

    // See October CMS JavaScript API AJAX handlers: https://octobercms.com/docs/ajax/handlers
<<<<<<< HEAD
    $form.one("ajaxSuccess", (event: JQuery.Event, context: any, body: any, statusText: string, jqXHR: any) => {
      this.onSuccessSubmit(statusText, body.result, jqXHR);
    });
    $form.one("ajaxError", (event: JQuery.Event, context: any, message: string, statusText: string, jqXHR: any) => {
      this.onErrorSubmit(statusText, message, jqXHR);
    });
=======
    $form.one(
      "ajaxSuccess",
      (
        event: JQuery.Event,
        context: any,
        data: any,
        // statusText: string,
        // jqXHR: any
      ) => {
        this.onSuccessSubmit(data);
      }
    );
    $form.one(
      "ajaxError",
      (
        event: JQuery.Event,
        context: any,
        data: any,
        statusText: string,
        // jqXHR: any
      ) => {
        this.onErrorSubmit(new Error(statusText));
      }
    );
>>>>>>> 776d8cb904c1d9a0bb978b159a7702848436e9a9
  }
}
