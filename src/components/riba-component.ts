/**
 * This implementation of components replaces the old components of rivets following the Web Components v1 specs
 *
 * @see https://developer.mozilla.org/de/docs/Web/Web_Components/Using_custom_elements
 */

import Debug from 'debug';
import { View } from '../view';
import { Tinybind, EventHandler } from '../tinybind';
import { Binding } from '../binding';
import { parseAttribute } from '../parsers';
import { FakeHTMLElement } from './fake-html-element';

export type TemplateFunction = () => string | null;

export abstract class RibaComponent extends FakeHTMLElement {

  public static tagName: string;

  protected debug: Debug.IDebugger;
  protected view?: View;

  protected tinybind = new Tinybind();

  protected el: HTMLElement;

  protected abstract scope: any;

  /**
   * Returns all properties setted as attributes on the custom element
   */
  protected get props() {
    const props: any = {};
    const attributes = this.el.attributes;
    for (const i in attributes) {
      if (attributes.hasOwnProperty(i)) {
        const attribute: Node = attributes[i];
        const name = attribute.nodeName;
        props[name] = parseAttribute(attribute.nodeValue);
      }
    }
    return props;
  }

  private attributeObserverFallback?: MutationObserver;

  constructor(element?: HTMLElement) {
    super(element);
    this.debug = Debug('component:RibaComponent');
    this.debug('constructor called', element, this);

    if (element) {
      this.el = element;
    } else if (window.customElements) {
      this.el = ((this as any) as HTMLElement);
    } else {
      throw new Error(`element is required on browsers without custom elements support`);
    }

  }

  protected abstract template(): string | null;

  protected init(observedAttributes: string[]) {

    // if innerHTML is null this component uses the innerHTML which he already has!
    const template = this.template();
    this.debug('template', template);
    if (template !== null) {
      this.el.innerHTML = template;
    }

    this.RibaObservedAttributes();

    this.initAttributeObserver(observedAttributes);

    this.bind();

  }

  /**
   * Get attribute property by name
   * @param name Name of the attribute
   */
  protected prop(name: string) {
    return parseAttribute(this.el.getAttribute(name));
  }

  /**  */
  protected RibaObservedAttributes(): string[] {
    const fullPrefix = this.tinybind.fullPrefix;
    const attributes = this.props;
    this.debug('attributes', attributes);
    const observedAttr: string[] = [];
    const observedAttributes = [];
    return [];
  }

  /**
   * Returns an event handler for the bindings (most on-*) insite this component.
   */
  protected eventHandler(self: RibaComponent): EventHandler {
    // IMPORTANT this must be a function and not a Arrow Functions
    return function(this: EventHandler, context: Binding, ev: Event, binding: Binding, el: HTMLElement) {
      this.call(self, ev, binding.view.models, el, context);
    };
  }

  /**
   * Default custom Element method
   * Invoked when the custom element is first connected to the document's DOM.
   */
  protected connectedCallback() {
    this.debug('connectedCallback called');
  }

  /**
   * Default custom Element method
   * Invoked when the custom element is disconnected from the document's DOM.
   */
  protected disconnectedCallback() {
    this.debug('disconnectedCallback called');
    if (this.view) {
      this.view.unbind();
    }

    if (this.attributeObserverFallback) {
      this.attributeObserverFallback.disconnect();
    }
  }

  /**
   * Default custom Element method
   * Invoked when the custom element is moved to a new document.
   * @param attributeName
   * @param oldValue
   * @param newValue
   * @param namespace
   */
  protected attributeChangedCallback(attributeName: string, oldValue: any, newValue: any, namespace: string | null) {
    this.debug('attributeChangedCallback called', attributeName, oldValue, newValue, namespace);

    // automatically inject observed attributes to view scope
    if (this.view && this.view.models) {
      this.debug('this.scope', this.scope);
      this.scope[attributeName] = newValue;
    }
  }

  /**
   * Default custom Element method
   * Invoked when one of the custom element's attributes is added, removed, or changed.
   * Note: Not supported on polyfill: https://github.com/webcomponents/custom-elements#known-bugs-and-limitations
   * @param oldDocument
   * @param newDocument
   */
  protected adoptedCallback(oldDocument: Document, newDocument: Document) {
    this.debug('adoptedCallback called', oldDocument, newDocument);
  }

  protected bind() {
    const viewOptions = this.tinybind.getViewOptions({
      handler: this.eventHandler(this),
    });

    // this.debug('bind scope', this.scope);
    if (!this.el) {
      throw new Error('this.el is not defined');
    }

    this.view = new View(Array.prototype.slice.call(this.el.childNodes), this.scope, viewOptions);
    this.scope = this.view.models;
    this.view.bind();

    return this.view;
  }

  /**
   *
   */
  private initAttributeObserver(observedAttributes: string[]) {

    if ((window as any).customElements) {
      // use native implementaion
    } else if ((window as any).MutationObserver) {
      // use MutationObserver as fallback
      this.attributeObserverFallback = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes') {
            this.debug('attributes changed', mutation);
            if (mutation.attributeName) {
              // if this attribute is a watched attribute
              if (observedAttributes.indexOf(mutation.attributeName) !== -1) {
                const newValue = this.el.getAttribute(mutation.attributeName);
                this.attributeChangedCallback(mutation.attributeName, mutation.oldValue, newValue, mutation.attributeNamespace);
              }
            }
          }
        });
      });
      this.attributeObserverFallback.observe(this.el, {
        attributes: true,
      });
    } else {
      // use attribute change event as fallback for MutationObserver
      this.el.addEventListener('attribute-changed', (event) => {
        const data = ( event as CustomEvent ).detail;
        this.attributeChangedCallback(data.name, data.oldValue, data.oldValue, data.namespace);
      });
    }
  }
}
