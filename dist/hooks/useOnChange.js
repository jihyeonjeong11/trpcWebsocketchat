"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
function UseOnChange(initialValues) {
    const [values, setValues] = (0, react_1.useState)(initialValues);
    const handleChange = (event) => {
        setValues((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    };
    return {
        values,
        setValues,
        handleChange,
    };
}
exports.default = UseOnChange;
