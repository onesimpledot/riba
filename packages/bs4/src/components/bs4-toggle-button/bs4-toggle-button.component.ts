/**
 * This components is used to trigger a toggle event used in other components or parts of your project. This site itself uses the bs4-toggle-button to open or close the sidebar.
 * @attribute "target-id" (Required) The id with which the toggle event is triggered
 * @method toggle	 Triggeres the toggle event
 * @property state Can be 'hidden' or something else
 * @property isClosed Is true if the state is 'hidden'
 * @property targetId Passed attribute value, see `target-id` attribute
 */

import {
  Component,
  EventDispatcher,
} from '@ribajs/core';

import {
  TOGGLE_BUTTON,
} from '../../constants';

type State = 'undefined' | 'overlay-left' | 'overlay-right' | 'side-left' | 'side-right' | 'hidden' | 'visable';

interface Scope {
  targetId?: string;
  toggle: Bs4ToggleButtonComponent['toggle'];
  state: State;
  isClosed: boolean;
}

// TODO extend from Bs4ButtonComponent
export class Bs4ToggleButtonComponent extends Component {

  static get observedAttributes() {
    return ['target-id'];
  }

  protected requiredAttributes() {
    return ['targetId'];
  }

  public static tagName = 'bs4-toggle-button';

  protected autobind = true;

  protected eventDispatcher?: EventDispatcher;

  protected scope: Scope = {
    targetId: undefined,
    toggle: this.toggle,
    state: 'undefined',
    isClosed: false,
  };

  constructor(element?: HTMLElement) {
    super(element);
  }

  public toggle() {
    // console.debug('toggle', this.eventDispatcher);
    if (this.eventDispatcher) {
      this.eventDispatcher.trigger(TOGGLE_BUTTON.eventNames.toggle, this.scope.targetId);
    }
  }

  protected async afterBind() {
    await super.afterBind();
    // Trigger init to trigger there current state of all the components that are connected to this component
    return this.eventDispatcher?.trigger(TOGGLE_BUTTON.eventNames.init, this.scope.targetId);
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.init(Bs4ToggleButtonComponent.observedAttributes);
  }

  protected onToggledEvent(state: State) {
    this.scope.state = state;
    this.scope.isClosed = state === 'hidden';
  }

  protected initEventDispatcher(id: string) {
    if (this.eventDispatcher) {
      this.eventDispatcher.off(TOGGLE_BUTTON.eventNames.toggled, this.onToggledEvent);
    }
    this.eventDispatcher = new EventDispatcher(TOGGLE_BUTTON.nsPrefix + id);
    this.eventDispatcher.on(TOGGLE_BUTTON.eventNames.toggled, this.onToggledEvent.bind(this));
    // Triggered state triggered by `..trigger('init', ...`
    this.eventDispatcher.on(TOGGLE_BUTTON.eventNames.state, this.onToggledEvent.bind(this));
  }

  protected attributeChangedCallback(attributeName: string, oldValue: any, newValue: any, namespace: string | null) {
    super.attributeChangedCallback(attributeName, oldValue, newValue, namespace);
  }

  protected parsedAttributeChangedCallback(attributeName: string, oldValue: any, newValue: any, namespace: string | null) {
    super.parsedAttributeChangedCallback(attributeName, oldValue, newValue, namespace);
    if (attributeName === 'targetId' && newValue) {
      this.initEventDispatcher(newValue);
    }
  }

  // deconstructor
  protected disconnectedCallback() {
    super.disconnectedCallback();
    if (this.eventDispatcher) {
      this.eventDispatcher.off(TOGGLE_BUTTON.eventNames.toggled, this.onToggledEvent);
    }
  }

  protected template() {
    if (!this.el.hasChildNodes()) {
      console.warn('No child elements found, this component as no template so you need to define your own as child of this component.');
    }
    return null;
  }
}
