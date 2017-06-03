import Embedded from './Embedded';
import Video from './Video';
import Line from './Line';
import getImageComponent from '../renderer/Image';

const getBlockRenderFunc = (config, customBlockRenderer) => (block) => {
  if (typeof customBlockRenderer === 'function') {
    const renderedComponent = customBlockRenderer(block, config, config.getEditorState);
    if (renderedComponent) return renderedComponent;
  }
  if (block.getType() === 'atomic') {
    const contentState = config.getEditorState().getCurrentContent();
    const entity = contentState.getEntity(block.getEntityAt(0));
    if (entity && entity.type === 'IMAGE') {
      return {
        component: getImageComponent(config),
        editable: false,
      };
    } else if (entity && entity.type === 'EMBEDDED_LINK') {
      return {
        component: Embedded,
        editable: false,
      };
    }
    if (block.getType() === 'atomic') {
      const contentState = getEditorState().getCurrentContent();
      const entity = contentState.getEntity(block.getEntityAt(0));
      if (entity && entity.type === 'IMAGE') {
        return {
          component: getImageComponent(config),
          editable: false,
        };
      } else if (entity && entity.type === 'EMBEDDED_LINK') {
        return {
          component: Embedded,
          editable: false,
        };
      } else if (entity && entity.type === 'VIDEO') {
        return {
          component: Video,
          editable: false,
        };
      } else if (entity && entity.type === 'LINE') {
        return {
          component: Line,
          editable: false,
        };
      }
    }
    return undefined;
  };
  return undefined;
};

export default getBlockRenderFunc;
