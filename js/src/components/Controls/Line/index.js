/* @flow */

import React, { Component, PropTypes } from 'react';
import { Entity, AtomicBlockUtils } from 'draft-js';
import classNames from 'classnames';
import Option from '../../Option';
import styles from '../Embedded/styles.css'; // eslint-disable-line no-unused-vars
import { Dropdown, DropdownOption } from '../../Dropdown';

export default class Line extends Component {

  static propTypes: Object = {
    editorState: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    modalHandler: PropTypes.object,
    config: PropTypes.object,
  };

  state: Object = {
    lineType: 'solid',
    embeddedLink: '',
    showModal: false,
    width: '100%',
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

  setURLInputReference: Function = (ref: Object): void => {
    this.urlInput = ref;
  };

  setWidthInputReference: Function = (ref: Object): void => {
    this.widthInput = ref;
  };

  updateEmbeddedLink: Function = (event: Object): void => {
    this.setState({
      embeddedLink: event.target.value,
    });
  };

  updateWidth: Function = (event: Object): void => {
    this.setState({
      width: event.target.value,
    });
  };

  addLine: Function = (): void => {
    const { editorState, onChange } = this.props;
    const { lineType, width } = this.state;
    const entityKey = editorState
      .getCurrentContent()
      .createEntity('LINE', 'MUTABLE', { type: lineType, width })
      .getLastCreatedEntityKey();
    const newEditorState = AtomicBlockUtils.insertAtomicBlock(
      editorState,
      entityKey,
      ' '
    );
    onChange(newEditorState);
    this.closeModal();
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

  handleChangeLineType: Function = (value: String): void => {
    this.setState({ lineType: value });
  }

  rendeEmbeddedLinkModal(): Object {
    const { lineType, width } = this.state;
    const { config: { popupClassName }} = this.props;
    return (
      <div
        className={classNames('rdw-embedded-modal', popupClassName)}
        onClick={this.stopPropagation}
      >
        <div className="rdw-embedded-modal-link-section">
          <Dropdown
            className={classNames('rdw-fontfamily-dropdown')}
            onChange={this.handleChangeLineType}
            modalHandler={this.props.modalHandler}
            optionWrapperClassName={classNames('rdw-fontfamily-optionwrapper')}
          >
            <span className="rdw-fontfamily-placeholder">
              {lineType || 'Font Family'}
            </span>
            {
              ['solid', 'dashed'].map((type, index) =>
                <DropdownOption
                  active={lineType === type}
                  value={type}
                  key={index}
                >
                  {type}
                </DropdownOption>)
            }
          </Dropdown>
          <div className="rdw-embedded-modal-size">
            <input
              ref={this.setWidthInputReference}
              onChange={this.updateWidth}
              onBlur={this.updateWidth}
              value={width}
              className="rdw-embedded-modal-size-input"
              placeholder="Width"
            />
          </div>
        </div>
        <span className="rdw-embedded-modal-btn-section">
          <button
            className="rdw-embedded-modal-btn"
            onClick={this.addLine}
            disabled={!lineType || !width}
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
        {showModal ? this.rendeEmbeddedLinkModal() : undefined}
      </div>
    );
  }
}
