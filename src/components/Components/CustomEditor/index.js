import React, { Component } from 'react'
import Editor from 'draft-js-editor/lib/Editor'
import defaultDecorator from 'draft-js-editor/lib/components/defaultDecorator'
import { EditorState, convertFromHTML, ContentState } from 'draft-js'
import {stateToHTML} from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';

class MultipleEditorsDemo extends Component {

  constructor(props){
    super(props)
    const blocksFromHTML = convertFromHTML(this.props.initValue);
    const state = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
    this.state = {
      editorState1: EditorState.createWithContent(state)
    }
  }

  render = () => {
    return <div>
      <div style={{padding: 5, border: 'solid 1px #ddd'}}>
        <Editor
          onChange={(editorState1) => {
            this.setState({ editorState1 })
            this.props.handleChange(stateToHTML(this.state.editorState1.getCurrentContent()))
          }}
          editorState={this.state.editorState1}
        />
      </div>
    </div>
  }
}

export default MultipleEditorsDemo
