/* @flow */

import React, { Component, PropTypes } from 'react';
import { Entity, AtomicBlockUtils, getEntityRange, EditorState, Modifier } from 'draft-js';
import classNames from 'classnames';
import Option from '../../Option';
import styles from '../Embedded/styles.css'; // eslint-disable-line no-unused-vars
import { Dropdown, DropdownOption } from '../../Dropdown';

export default class LinkList extends Component {

  static propTypes: Object = {
    editorState: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    modalHandler: PropTypes.object,
    config: PropTypes.object,
  };

  state: Object = {
    showModal: false,
    linkIndex: undefined,
  };

  componentWillMount(): void {
    const { modalHandler } = this.props;
    modalHandler.registerCallBack(this.showHideModal);
  }

  componentWillUnmount(): void {
    const { modalHandler } = this.props;
    modalHandler.deregisterCallBack(this.showHideModal);
  }

  onOptionClick: Function = (): void => {
    // this.signalShowModal = !this.state.showModal;
    // this.signalShowModal = true;
    this.setState({ showModal: true });
  }

  addLink: Function = (): void => {
    const { editorState, onChange, config: { allLinks }} = this.props;
    const { linkIndex, currentEntity } = this.state;
    const selectedLink = allLinks[linkIndex];
    const linkTitle = selectedLink.name;
    const linkTarget = selectedLink.href;
    let selection = editorState.getSelection();

    if (currentEntity) {
      const entityRange = getEntityRange(editorState, currentEntity);
      selection = selection.merge({
        anchorOffset: entityRange.start,
        focusOffset: entityRange.end,
      });
    }
    const entityKey = editorState
      .getCurrentContent()
      .createEntity('LINK', 'MUTABLE', { url: linkTarget })
      .getLastCreatedEntityKey();

    let contentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      selection,
      `${linkTitle}`,
      editorState.getCurrentInlineStyle(),
      entityKey,
    );
    let newEditorState = EditorState.push(editorState, contentState, 'insert-characters');

    // insert a blank space after link
    selection = newEditorState.getSelection().merge({
      anchorOffset: selection.get('anchorOffset') + linkTitle.length,
      focusOffset: selection.get('anchorOffset') + linkTitle.length,
    });
    newEditorState = EditorState.acceptSelection(newEditorState, selection);
    contentState = Modifier.insertText(
      newEditorState.getCurrentContent(),
      selection,
      ' ',
      newEditorState.getCurrentInlineStyle(),
      undefined
    );
    onChange(EditorState.push(newEditorState, contentState, 'insert-characters'));
    this.setState({ showModal: false });
  };

  showHideModal: Function = (): void => {
    // this.setState({
    //   showModal: this.signalShowModal,
    //   embeddedLink: undefined,
    // });
    // this.signalShowModal = false;
  }

  closeModal: Function = (): void => {
    this.setState({
      showModal: false,
      embeddedLink: undefined,
    });
  };

  stopPropagation: Function = (event: Object): void => {
    // event.preventDefault();
    // event.stopPropagation();
  };

  handleChangeLink: Function = (value): void => {
    this.setState({ linkIndex: value });
  }

  renderModal(): Object {
    const { linkIndex } = this.state;
    const { config: { popupClassName, allLinks }} = this.props;
    const selectedLink = allLinks[linkIndex];
    return (
      <div
        className={classNames('rdw-embedded-modal', popupClassName)}
        onClick={this.stopPropagation}
      >
        <div className="rdw-embedded-modal-link-section">
          <Dropdown
            className={classNames('rdw-fontfamily-dropdown')}
            onChange={this.handleChangeLink}
            modalHandler={this.props.modalHandler}
            optionWrapperClassName={classNames('rdw-fontfamily-optionwrapper')}
          >
            <span className="rdw-fontfamily-placeholder">
              {selectedLink && selectedLink.name}
            </span>
            {
              allLinks.map((link, index) =>
                <DropdownOption
                  active={linkIndex === index}
                  value={index}
                  key={index}
                >
                  {link.name}
                </DropdownOption>)
            }
          </Dropdown>
        </div>
        <span className="rdw-embedded-modal-btn-section">
          <button
            className="rdw-embedded-modal-btn"
            onClick={this.addLink}
            disabled={!selectedLink}
          >
            Add
          </button>
          <button
            className="rdw-embedded-modal-btn"
            onClick={this.closeModal}
          >
            Cancel
          </button>
        </span>
      </div>
    );
  }

  render(): Object {
    const { config: { icon, className } } = this.props;
    const { showModal } = this.state;
    return (
      <div
        className="rdw-embedded-wrapper"
        aria-haspopup="true"
        aria-expanded={showModal}
        aria-label="rdw-embedded-control"
      >
        <Option
          className={classNames(className)}
          value="unordered-list-item"
          onClick={this.onOptionClick}
        >
          <img
            src={icon}
            role="presentation"
          />
        </Option>
        {showModal ? this.renderModal() : undefined}
      </div>
    );
  }
}
