import * as React from "react";
import { TrixEditor } from "react-trix";

export class Test extends React.Component {
  handleEditorReady(editor) {
    // this is a reference back to the editor if you want to
    // do editing programatically
    editor.insertText("editor is ready <p>ok</p>");
  }
  handleChange(html, text) {
    // html is the new html content
    // text is the new text content
    console.log(html)
  }
  render() {
    return (
      <TrixEditor onChange={this.handleChange} onEditorReady={this.handleEditorReady} />
    );
  }
}

export default Test
