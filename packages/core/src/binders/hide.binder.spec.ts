import {
    Riba,
} from '../index';

import {
    hideBinder,
} from './hide.binder';

const riba = new Riba();
riba.module.binderService.regist(hideBinder);

describe('riba.binders', () => {
    let el: HTMLUnknownElement;

    beforeEach(() => {
        riba.configure({
            adapter: {
                subscribe: () => {/**/},
                unsubscribe: () => {/**/},
                read: () => {/**/},
                publish: () => {/**/},
            },
        });

        el = document.createElement('div');
        document.body.appendChild(el);
    });

    afterEach(() => {
        if (!el.parentNode) {
            throw new Error('el.parentNode is not defined!');
        }
        el.parentNode.removeChild(el);
    });

    describe('hide', () => {
        describe('with a truthy value', () => {
            it('hides the element', () => {
                (riba.binders.hide as any).routine(el, true);
                expect(el.style.display).toEqual('none');
            });
        });

        describe('with a falsey value', () => {
            it('shows the element', () => {
                (riba.binders.hide as any).routine(el, false);
                expect(el.style.display).toEqual('');
            });
        });
    });
});