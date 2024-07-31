import React from "react";
import "./index.scss";


// title
const Title = ({ title, className, children }) => {
    const content = title ? title : (children ? children : null);
    return content && <h2 className={className}>{content}</h2>
}

export default Title;