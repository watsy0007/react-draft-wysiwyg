/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Entity, AtomicBlockUtils } from 'draft-js';

import LayoutComponent from './Component';

class Embedded extends Component {

  static propTypes: Object = {
    editorState: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    modalHandler: PropTypes.object,
    config: PropTypes.object,
    translations: PropTypes.object,
  };

  state: Object = {
    expanded: false,
  };

  componentWillMount(): void {
    const { modalHandler } = this.props;
    modalHandler.registerCallBack(this.expandCollapse);
  }

  componentWillUnmount(): void {
    const { modalHandler } = this.props;
    modalHandler.deregisterCallBack(this.expandCollapse);
  }

  setURLInputReference: Function = (ref: Object): void => {
    this.urlInput = ref;
  };

  setHeightInputReference: Function = (ref: Object): void => {
    this.heightInput = ref;
  };

  setWidthInputReference: Function = (ref: Object): void => {
    this.widthInput = ref;
  };

  updateEmbeddedLink: Function = (event: Object): void => {
    let value = event.target.value;
    // if value is something likes "<iframe height=498 width=510 src='http://player.youku.com/embed/XMjQ4NDkxMTI5Mg==' frameborder=0 'allowfullscreen'></iframe>", then we will extract src;
    if (/^<iframe/.test(value)) {
      const elem = document.createElement('div');
      elem.innerHTML = value;

      const iframes = elem.getElementsByTagName('iframe');

      value = iframes[0].src;
    }
    this.setState({
        embeddedLink: value,
    })
  }
  expandCollapse: Function = (): void => {
    this.setState({
      expanded: this.signalExpanded,
    });
    this.signalExpanded = false;
  }

  onExpandEvent: Function = (): void => {
    this.signalExpanded = !this.state.expanded;
  };

  doExpand: Function = (): void => {
    this.setState({
      expanded: true,
    });
  };

  doCollapse: Function = (): void => {
    this.setState({
      expanded: false,
    });
  };

  addEmbeddedLink: Function = (embeddedLink, height, width): void => {
    const { editorState, onChange } = this.props;
    const entityKey = editorState
      .getCurrentContent()
      .createEntity('EMBEDDED_LINK', 'MUTABLE', { src: embeddedLink, height, width })
      .getLastCreatedEntityKey();
    const newEditorState = AtomicBlockUtils.insertAtomicBlock(
      editorState,
      entityKey,
      ' '
    );
    onChange(newEditorState);
    this.doCollapse();
  };

  render(): Object {
    const { config, translations } = this.props;
    const { expanded } = this.state
    const EmbeddedComponent = config.component || LayoutComponent;
    return (
      <EmbeddedComponent
        config={config}
        translations={translations}
        onChange={this.addEmbeddedLink}
        expanded={expanded}
        onExpandEvent={this.onExpandEvent}
        doExpand={this.doExpand}
        doCollapse={this.doCollapse}
      />
    );
  }
}

export default Embedded;

// todo: make default heights configurable
