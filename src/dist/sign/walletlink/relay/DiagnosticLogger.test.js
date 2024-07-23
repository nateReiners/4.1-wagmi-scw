"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DiagnosticLogger_1 = require("./DiagnosticLogger");
describe('DiagnosticLogger', () => {
    describe('log', () => {
        let event;
        let props;
        class diagnosticLogger {
            log(eventType, Properties) {
                event = eventType;
                props = Properties;
            }
        }
        const diagnostic = new diagnosticLogger();
        test('calls the log function', () => {
            const logProperties = {
                message: 'a message',
                value: 'a value',
            };
            diagnostic.log(DiagnosticLogger_1.EVENTS.CONNECTED_STATE_CHANGE, logProperties);
            expect(event).toEqual(DiagnosticLogger_1.EVENTS.CONNECTED_STATE_CHANGE);
            expect(props).toEqual(logProperties);
        });
    });
});
//# sourceMappingURL=DiagnosticLogger.test.js.map