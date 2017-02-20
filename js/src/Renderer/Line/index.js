import React, { PropTypes } from 'react';

const Line = ({ block, contentState }) => {
  const entity = contentState.getEntity(block.getEntityAt(0));
  const { type, width } = entity.getData();
  return (
    <hr style={{ borderTop: `1px ${type}`, width }} />
  );
};

Line.propTypes = {
  block: PropTypes.object,
  contentState: PropTypes.object,
};

export default Line;
