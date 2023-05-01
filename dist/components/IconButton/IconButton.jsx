"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function IconButton({ children, shouldFill, className, ...rest }) {
    return (<button className={`flex h-10 w-10 items-center justify-center [&_svg]:h-6 [&_svg]:w-6 ${shouldFill ? '[&_svg>*]:fill-primaryText' : ''} ${className ? className : ''}`} {...rest}>
      {children}
    </button>);
}
exports.default = IconButton;
