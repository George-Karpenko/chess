export default class AbstractCheck {
    #nextHandler;

    setNext(handler) {
        this.#nextHandler = handler;
        return handler;
    }

    handle(request) {
        if (this.#nextHandler) {
            return this.#nextHandler.handle(request);
        }

        return null;
    }
}