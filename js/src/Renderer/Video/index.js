import React, { PropTypes } from 'react';

const Video = ({ block, contentState }) => {
  const entity = contentState.getEntity(block.getEntityAt(0));
  const { src, height, width } = entity.getData();
  return (
    <video height={height} width={width} controls>
      <source src={src} type="video/mp4" />
    </video>);
};

Video.propTypes = {
  block: PropTypes.object,
  contentState: PropTypes.object,
};

export default Video;
