import React from "react";

import "./app.scss";
import "../src/static/fonts/iconfont.css";

class App extends React.Component {
  render() {
    return this.props.children;
  }

}

export default App;